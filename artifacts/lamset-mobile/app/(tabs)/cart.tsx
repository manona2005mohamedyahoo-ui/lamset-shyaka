import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useCreateMobileCheckout } from '@workspace/api-client-react';
import { Page, Copy, Empty, Action, Loading, s } from '@/components/shop-ui';
import { useShop } from '@/context/shop';
import { useColors } from '@/hooks/useColors';
import { fonts } from '@/constants/colors';
import { money } from '@/lib/catalog';

export default function Cart() {
  const shop = useShop(); const c = useColors();
  const checkout = useCreateMobileCheckout();
  const [review, setReview] = useState<{ url: string; subtotal: string; currency: string; snapshot: string } | null>(null);
  const [error, setError] = useState('');
  const [opening, setOpening] = useState(false);
  const currencies = [...new Set(shop.cart.map(l => l.currency))];
  const currency = currencies[0] ?? '';
  const subtotal = shop.cart.reduce((sum, line) => sum + Number(line.price) * line.quantity, 0);
  const snapshot = JSON.stringify(shop.cart.map(l => ({ merchandiseId: l.variantId, quantity: l.quantity })));
  const validReview = review && review.snapshot === snapshot ? review : null;
  async function prepare() {
    setError(''); setReview(null);
    const expected = snapshot;
    try {
      const data = await checkout.mutateAsync({ data: { lines: shop.cart.map(l => ({ merchandiseId: l.variantId, quantity: l.quantity })) } });
      setReview({ url: data.checkoutUrl, subtotal: data.subtotal, currency: data.currency, snapshot: expected });
    } catch (e) {
      const response = e as { data?: { error?: string } };
      setError(response.data?.error ?? 'تعذّر تجهيز الطلب. راجعي اتصال المتجر وحاولي مجددًا.');
    }
  }
  async function openCheckout() {
    if (!validReview) return;
    setOpening(true); setError('');
    try { await WebBrowser.openBrowserAsync(validReview.url); }
    catch { setError('تعذّر فتح صفحة إتمام الطلب. حاولي مجددًا.'); }
    finally { setOpening(false); }
  }
  return <Page title="سلتكِ" subtitle="اختياراتكِ الحلوة في مكان واحد">
    {!shop.ready ? <Loading /> : !shop.cart.length ? <><Empty title="لسه في مكان لحاجة حلوة" detail="سلتكِ فاضية حاليًا. اكتشفي المجموعة واختاري التفصيلة اللي تشبهكِ." /><View style={s.section}><Action label="ابدئي التسوق" onPress={() => router.push('/shop')} /></View></> : <View style={{ paddingHorizontal: 22 }}>
      {shop.cart.map(line => <View key={line.variantId} style={{ borderBottomWidth: 1, borderColor: c.border, paddingVertical: 18, flexDirection: 'row-reverse', gap: 14 }}>
        <Pressable onPress={() => router.push({ pathname: '/product/[handle]', params: { handle: line.handle } })}>{line.image ? <Image source={{ uri: line.image }} style={{ width: 83, height: 110 }} contentFit="cover" accessibilityLabel={line.title} /> : <View style={{ width: 83, height: 110, backgroundColor: c.muted }} />}</Pressable>
        <View style={{ flex: 1 }}>
          <Copy style={{ fontFamily: fonts.medium }}>{line.title}</Copy>
          {line.variantTitle !== 'Default Title' && <Copy muted style={{ fontSize: 12 }}>{line.variantTitle}</Copy>}
          <Copy>{money(line.price, line.currency)}</Copy>
          <View style={s.row}><View style={[s.row, { gap: 2 }]}>
            <Pressable disabled={checkout.isPending} accessibilityLabel="زيادة الكمية" onPress={() => shop.quantity(line.variantId, line.quantity + 1)} style={s.icon}><Feather name="plus" size={16} color={c.foreground} /></Pressable><Copy>{line.quantity}</Copy>
            <Pressable disabled={checkout.isPending} accessibilityLabel="تقليل الكمية" onPress={() => shop.quantity(line.variantId, line.quantity - 1)} style={s.icon}><Feather name="minus" size={16} color={c.foreground} /></Pressable>
          </View><Pressable disabled={checkout.isPending} accessibilityLabel={`حذف ${line.title}`} onPress={() => shop.quantity(line.variantId, 0)} style={s.icon}><Feather name="trash-2" size={17} color={c.mutedForeground} /></Pressable></View>
        </View>
      </View>)}
      <View style={{ backgroundColor: c.secondary, padding: 20, marginTop: 24, gap: 14 }}>
        <Copy style={{ fontFamily: fonts.heading, fontSize: 25, lineHeight: 38 }}>مراجعة الطلب</Copy>
        <View style={s.row}><Copy>إجمالي المنتجات التقديري</Copy><Copy>{currencies.length === 1 ? money(subtotal, currency) : 'عملات مختلفة'}</Copy></View>
        <Copy muted style={{ fontSize: 12 }}>الشحن والضرائب والخصومات تُحسب داخل Shopify حسب العنوان وإعدادات المتجر. الأسعار هنا آخر أسعار معروفة وقد تتغيّر.</Copy>
        {!!error && <Copy style={{ color: c.destructive }}>{error}</Copy>}
        {validReview ? <>
          <View style={s.row}><Copy>إجمالي Shopify الحالي</Copy><Copy>{money(validReview.subtotal, validReview.currency)}</Copy></View>
          <Copy muted style={{ fontSize: 12 }}>لم يتم تأكيد طلبكِ أو الدفع. كمّلي بيانات التوصيل وراجعي الإجمالي النهائي في الصفحة الآمنة.</Copy>
          <Action label="المتابعة لإتمام الطلب الآمن" busy={opening} onPress={() => { void openCheckout(); }} />
        </> : <Action label="راجعي السعر والتوافر" busy={checkout.isPending} disabled={currencies.length !== 1 || !!shop.error} onPress={() => { void prepare(); }} />}
      </View>
      <Copy muted style={{ marginTop: 18, fontSize: 12 }}>لن نمسح سلتكِ عند فتح صفحة الدفع؛ الرجوع منها لا يُثبت إتمام الشراء.</Copy>
    </View>}
  </Page>;
}
