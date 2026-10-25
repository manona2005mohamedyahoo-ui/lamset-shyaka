import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { MobileProduct, MobileVariant } from '@workspace/api-client-react';
import * as Haptics from 'expo-haptics';
import { z } from 'zod';

const LineSchema = z.object({
  variantId: z.string(), handle: z.string(), title: z.string(), variantTitle: z.string(),
  image: z.string(), price: z.string(), currency: z.string(), quantity: z.number().int().min(1).max(99),
});
const StateSchema = z.object({ favorites: z.array(z.string()), cart: z.array(LineSchema) });
export type CartLine = z.infer<typeof LineSchema>;
type Saved = z.infer<typeof StateSchema>;
type Store = Saved & {
  ready: boolean; error: string; message: string;
  toggleFavorite: (handle: string) => void;
  add: (product: MobileProduct, variant: MobileVariant, quantity: number) => void;
  quantity: (variantId: string, quantity: number) => void;
  clear: () => void;
  dismiss: () => void;
};
const KEY = 'lamset-mobile-shop-v1';
const Context = createContext<Store | null>(null);

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<Saved>({ favorites: [], cart: [] });
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const queue = useRef(Promise.resolve());
  const loaded = useRef(false);
  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem(KEY).then(raw => {
      if (alive && raw) {
        const saved = StateSchema.safeParse(JSON.parse(raw));
        if (!saved.success) throw new Error('Invalid stored data');
        setState(saved.data);
      }
      loaded.current = true;
    }).catch(() => { if (alive) setError('تعذّر استعادة بيانات هذا الجهاز. لن نستبدلها تلقائيًا.'); })
      .finally(() => { if (alive) setReady(true); });
    return () => { alive = false; };
  }, []);
  useEffect(() => {
    if (!ready || !loaded.current) return;
    const snapshot = JSON.stringify(state);
    queue.current = queue.current.then(() => AsyncStorage.setItem(KEY, snapshot))
      .catch(() => setError('تعذّر حفظ السلة والمفضلة على الجهاز. التغييرات الحالية لم تُحفظ.'));
  }, [state, ready]);
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(''), 2800);
    return () => clearTimeout(timer);
  }, [message]);
  const feedback = (text: string) => { setMessage(text); Haptics.selectionAsync().catch(() => {}); };
  const value: Store = {
    ...state, ready, error, message, dismiss: () => setMessage(''),
    toggleFavorite(handle) {
      if (!ready || !loaded.current) return;
      setState(s => ({ ...s, favorites: s.favorites.includes(handle) ? s.favorites.filter(h => h !== handle) : [...s.favorites, handle] }));
      Haptics.selectionAsync().catch(() => {});
    },
    add(product, variant, quantity) {
      if (!ready || !loaded.current || !variant.available) return;
      setState(s => {
        const old = s.cart.find(l => l.variantId === variant.id);
        const line: CartLine = {
          variantId: variant.id, handle: product.handle, title: product.title, variantTitle: variant.title,
          image: product.images[0]?.url ?? '', price: variant.price, currency: variant.currency,
          quantity: Math.min(99, (old?.quantity ?? 0) + quantity),
        };
        return { ...s, cart: [...s.cart.filter(l => l.variantId !== variant.id), line] };
      });
      feedback('أُضيفت إلى سلتك');
    },
    quantity(id, quantity) {
      if (!ready || !loaded.current) return;
      setState(s => ({ ...s, cart: quantity < 1 ? s.cart.filter(l => l.variantId !== id) : s.cart.map(l => l.variantId === id ? { ...l, quantity: Math.min(99, quantity) } : l) }));
    },
    clear() { if (ready && loaded.current) setState(s => ({ ...s, cart: [] })); },
  };
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useShop() {
  const value = useContext(Context);
  if (!value) throw new Error('ShopProvider is missing');
  return value;
}
