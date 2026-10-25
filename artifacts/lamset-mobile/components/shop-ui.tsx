import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View, Platform, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import type { MobileProduct } from '@workspace/api-client-react';
import { useColors } from '@/hooks/useColors';
import { fonts } from '@/constants/colors';
import { firstVariant, money } from '@/lib/catalog';
import { useShop } from '@/context/shop';

export function Copy({ children, style, muted = false }: { children: React.ReactNode; style?: StyleProp<import('react-native').TextStyle>; muted?: boolean }) {
  const c = useColors();
  return <Text style={[{ fontFamily: fonts.body, color: muted ? c.mutedForeground : c.foreground, fontSize: 14, lineHeight: 25, textAlign: 'right', writingDirection: 'rtl' }, style]}>{children}</Text>;
}
export function Page({ children, scroll = true, title, subtitle, back = false }: { children: React.ReactNode; scroll?: boolean; title?: string; subtitle?: string; back?: boolean }) {
  const c = useColors(); const insets = useSafeAreaInsets(); const store = useShop();
  const body = <>
    {!!title && <View style={s.pageHeader}>
      {back && <Pressable accessibilityRole="button" accessibilityLabel="رجوع" onPress={() => router.canGoBack() ? router.back() : router.replace('/')} style={s.icon}><Feather name="arrow-right" size={22} color={c.foreground} /></Pressable>}
      <View style={{ flex: 1 }}><Copy style={{ fontFamily: fonts.heading, fontSize: 32, lineHeight: 44 }}>{title}</Copy>{!!subtitle && <Copy muted>{subtitle}</Copy>}</View>
    </View>}
    {!!store.error && <Copy style={{ color: c.destructive, paddingHorizontal: 22 }}>{store.error}</Copy>}
    {children}
  </>;
  return <View style={{ flex: 1, backgroundColor: c.background, paddingTop: Platform.OS === 'web' ? Math.max(67, insets.top) : insets.top }}>
    {scroll ? <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>{body}</ScrollView> : <View style={{ flex: 1 }}>{body}</View>}
    {!!store.message && <Pressable onPress={store.dismiss} style={{ position: 'absolute', left: 20, right: 20, bottom: 100, padding: 15, backgroundColor: c.primary }}><Copy style={{ color: c.primaryForeground, textAlign: 'center' }}>{store.message}</Copy></Pressable>}
  </View>;
}
export function Action({ label, onPress, disabled, busy, outline = false }: { label: string; onPress: () => void; disabled?: boolean; busy?: boolean; outline?: boolean }) {
  const c = useColors();
  return <Pressable accessibilityRole="button" accessibilityState={{ disabled: !!disabled || !!busy, busy: !!busy }} disabled={disabled || busy} onPress={onPress} style={({ pressed }) => ({ minHeight: 50, paddingHorizontal: 20, paddingVertical: 12, borderWidth: 1, borderColor: c.primary, backgroundColor: outline ? c.clear : c.primary, opacity: disabled || busy ? .4 : pressed ? .7 : 1, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 10 })}>
    {busy ? <ActivityIndicator color={outline ? c.primary : c.primaryForeground} /> : null}
    <Copy style={{ color: outline ? c.primary : c.primaryForeground, fontFamily: fonts.medium, textAlign: 'center' }}>{label}</Copy>
  </Pressable>;
}
export function Empty({ icon = 'shopping-bag', title, detail, retry }: { icon?: React.ComponentProps<typeof Feather>['name']; title: string; detail: string; retry?: () => void }) {
  const c = useColors();
  return <View style={s.empty}><Feather name={icon} size={35} color={c.accent} /><Copy style={{ fontFamily: fonts.heading, fontSize: 25, lineHeight: 38, textAlign: 'center' }}>{title}</Copy><Copy muted style={{ textAlign: 'center', maxWidth: 310 }}>{detail}</Copy>{retry && <Action label="حاولي مجددًا" onPress={retry} outline />}</View>;
}
export function Loading() { const c = useColors(); return <View style={s.empty}><ActivityIndicator color={c.accent} /><Copy muted>بنجهّز لكِ التفاصيل…</Copy></View>; }
export function ProductCard({ product }: { product: MobileProduct }) {
  const c = useColors(); const shop = useShop(); const variant = firstVariant(product);
  return <View style={{ width: '48%', marginBottom: 22 }}>
    <Pressable accessibilityRole="button" accessibilityLabel={`تفاصيل ${product.title}`} onPress={() => router.push({ pathname: '/product/[handle]', params: { handle: product.handle } })}>
      <View style={{ aspectRatio: .78, backgroundColor: c.muted }}>
        {product.images[0] ? <Image source={{ uri: product.images[0].url }} style={StyleSheet.absoluteFill} contentFit="cover" accessibilityLabel={product.images[0].alt} /> : <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Feather name="image" color={c.mutedForeground} size={30} /></View>}
        {!variant?.available && <View style={{ position: 'absolute', bottom: 10, right: 10, backgroundColor: c.card, paddingHorizontal: 8 }}><Copy style={{ fontSize: 11 }}>غير متاح حاليًا</Copy></View>}
      </View>
      <Copy style={{ marginTop: 8, fontFamily: fonts.medium }}>{product.title}</Copy>
      {variant && <Copy muted>{money(variant.price, variant.currency)}</Copy>}
    </Pressable>
    <Pressable accessibilityRole="button" accessibilityLabel={shop.favorites.includes(product.handle) ? 'إزالة من المفضلة' : 'إضافة للمفضلة'} onPress={() => shop.toggleFavorite(product.handle)} style={{ position: 'absolute', top: 7, left: 7, padding: 10, backgroundColor: c.card }}>
      <Feather name="heart" color={shop.favorites.includes(product.handle) ? c.destructive : c.foreground} size={18} />
    </Pressable>
  </View>;
}
export const s = StyleSheet.create({
  pageHeader: { flexDirection: 'row-reverse', gap: 10, alignItems: 'center', paddingHorizontal: 22, paddingTop: 10, paddingBottom: 20 },
  icon: { minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  empty: { paddingHorizontal: 26, paddingVertical: 40, gap: 15, alignItems: 'center' },
  section: { paddingHorizontal: 22, marginTop: 28 },
  row: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  grid: { flexDirection: 'row-reverse', flexWrap: 'wrap', justifyContent: 'space-between' },
});
