import React, { useState } from 'react';
import { Dimensions, Modal, Pressable, ScrollView, View } from 'react-native';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { useGetMobileProduct } from '@workspace/api-client-react';
import { Page, Copy, Action, Loading, Empty, s } from '@/components/shop-ui';
import { useColors } from '@/hooks/useColors';
import { fonts } from '@/constants/colors';
import { firstVariant, money, variantLabel } from '@/lib/catalog';
import { useShop } from '@/context/shop';

export default function Product() {
  const { handle = '' } = useLocalSearchParams<{ handle: string }>();
  const product = useGetMobileProduct(handle, { query: { enabled: !!handle, staleTime: 30000, retry: 1 } });
  const c = useColors(); const shop = useShop();
  const [variantId, setVariantId] = useState(''); const [image, setImage] = useState(0);
  const [quantity, setQuantity] = useState(1); const [zoom, setZoom] = useState(false);
  const p = product.data;
  const variant = p?.variants.find(v => v.id === variantId) ?? (p ? firstVariant(p) : undefined);
  if (product.isLoading) return <Page title="تفاصيل المنتج" back><Loading /></Page>;
  if (product.isError || !p) return <Page title="تفاصيل المنتج" back><Empty title="تعذّر عرض المنتج" detail="قد يكون غير منشور، أو الاتصال غير متاح الآن." retry={() => { void product.refetch(); }} /></Page>;
  const selectedImage = p.images[image] ?? p.images[0];
  return <Page title={p.title} back>
    <Pressable disabled={!selectedImage} onPress={() => setZoom(true)} accessibilityRole="button" accessibilityLabel="تكبير صورة المنتج" style={{ backgroundColor: c.muted }}>
      {selectedImage ? <Image source={{ uri: selectedImage.url }} contentFit="cover" style={{ height: Dimensions.get('window').width * 1.05, width: '100%' }} accessibilityLabel={selectedImage.alt} /> : <Empty icon="image" title="الصورة غير متاحة" detail="لم تُضف صورة لهذا المنتج بعد." />}
      {selectedImage && <View style={{ position: 'absolute', left: 15, bottom: 15, padding: 10, backgroundColor: c.card }}><Feather name="maximize-2" color={c.foreground} size={18} /></View>}
    </Pressable>
    {p.images.length > 1 && <ScrollView horizontal contentContainerStyle={{ flexDirection: 'row-reverse', gap: 10, padding: 20 }}>{p.images.map((img, i) => <Pressable key={img.url} onPress={() => setImage(i)} accessibilityLabel={`الصورة ${i + 1}`} style={{ borderWidth: 2, borderColor: i === image ? c.accent : c.clear }}><Image source={{ uri: img.url }} style={{ width: 65, height: 75 }} contentFit="cover" /></Pressable>)}</ScrollView>}
    <View style={s.section}>
      <View style={s.row}>
        <Copy style={{ fontFamily: fonts.heading, fontSize: 27, lineHeight: 40 }}>{variant ? money(variant.price, variant.currency) : 'السعر غير متاح'}</Copy>
        <Pressable onPress={() => shop.toggleFavorite(p.handle)} accessibilityRole="button" accessibilityLabel="تغيير المفضلة" style={s.icon}><Feather name="heart" size={24} color={shop.favorites.includes(p.handle) ? c.destructive : c.foreground} /></Pressable>
      </View>
      <Copy muted style={{ marginTop: 8 }}>{variant?.available ? 'متاح للطلب • التأكيد النهائي عند إتمام الطلب' : 'غير متاح حاليًا'}</Copy>
      {p.variants.length > 1 && <View style={{ marginTop: 22 }}><Copy style={{ marginBottom: 10 }}>اختاري النوع / اللون / المقاس</Copy><View style={{ flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 8 }}>{p.variants.map(v => <Pressable key={v.id} onPress={() => setVariantId(v.id)} accessibilityRole="button" accessibilityState={{ selected: variant?.id === v.id }} style={{ borderWidth: 1, borderColor: variant?.id === v.id ? c.accent : c.border, paddingVertical: 10, paddingHorizontal: 12, opacity: v.available ? 1 : .5 }}><Copy>{variantLabel(v)}{!v.available ? ' — غير متاح' : ''}</Copy></Pressable>)}</View></View>}
      <View style={[s.row, { marginVertical: 24 }]}><Copy>الكمية</Copy><View style={s.row}>
        <Pressable onPress={() => setQuantity(v => Math.min(99, v + 1))} accessibilityLabel="زيادة الكمية" style={s.icon}><Feather name="plus" size={20} color={c.foreground} /></Pressable><Copy>{quantity}</Copy><Pressable disabled={quantity === 1} onPress={() => setQuantity(v => Math.max(1, v - 1))} accessibilityLabel="تقليل الكمية" style={s.icon}><Feather name="minus" size={20} color={c.foreground} /></Pressable>
      </View></View>
      <Action label="أضيفي إلى السلة" disabled={!variant?.available || !shop.ready || !!shop.error} onPress={() => { if (variant) shop.add(p, variant, quantity); }} />
      <View style={{ height: 10 }} /><Action outline label="اطلبي الآن" disabled={!variant?.available || !shop.ready || !!shop.error} onPress={() => { if (variant) { shop.add(p, variant, quantity); router.push('/cart'); } }} />
      <View style={{ borderTopWidth: 1, borderColor: c.border, marginTop: 28, paddingTop: 20 }}><Copy style={{ fontFamily: fonts.heading, fontSize: 25, lineHeight: 37 }}>التفاصيل</Copy><Copy muted style={{ marginTop: 10 }}>{p.description || 'لم تضف صاحبة المتجر وصفًا لهذا المنتج بعد.'}</Copy></View>
      <Copy muted style={{ marginTop: 24, fontSize: 12 }}>تُعرض خيارات الشحن وتكلفته وشروط الطلب داخل صفحة Shopify قبل تأكيد الشراء. لا يتم حجز المخزون بمجرد الإضافة للسلة.</Copy>
    </View>
    <Modal visible={zoom} onRequestClose={() => setZoom(false)} animationType="fade">
      <View style={{ flex: 1, backgroundColor: c.background, justifyContent: 'center' }}>
        <Pressable onPress={() => setZoom(false)} accessibilityLabel="إغلاق الصورة" style={{ position: 'absolute', top: 65, right: 20, zIndex: 2, padding: 14 }}><Feather name="x" size={26} color={c.foreground} /></Pressable>
        <ScrollView maximumZoomScale={4} minimumZoomScale={1} centerContent contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}><Image source={{ uri: selectedImage?.url }} contentFit="contain" style={{ width: '100%', height: 550 }} /></ScrollView>
      </View>
    </Modal>
  </Page>;
}
