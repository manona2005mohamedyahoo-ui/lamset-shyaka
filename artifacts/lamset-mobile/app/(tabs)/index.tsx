import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useGetMobileProducts } from '@workspace/api-client-react';
import { Page, Copy, Action, ProductCard, Empty, Loading, s } from '@/components/shop-ui';
import { fonts } from '@/constants/colors';
import { categories } from '@/lib/catalog';
import { useColors } from '@/hooks/useColors';

export default function Home() {
  const c = useColors();
  const products = useGetMobileProducts({ query: { staleTime: 60000, retry: 1 } });
  return <Page>
    <View style={[s.row, { paddingHorizontal: 22, paddingBottom: 15 }]}>
      <View><Copy style={{ fontFamily: fonts.heading, fontSize: 30, lineHeight: 43 }}>لمسة شياكة <Copy style={{ color: c.accent }}>◆</Copy></Copy><Copy muted style={{ fontSize: 10, letterSpacing: 2 }}>للتفاصيل التي تشبهكِ</Copy></View>
      <Pressable onPress={() => router.push('/shop')} accessibilityRole="button" accessibilityLabel="البحث في المنتجات" style={s.icon}><Feather name="search" size={22} color={c.foreground} /></Pressable>
    </View>
    <View style={{ marginHorizontal: 16 }}>
      <Image source={require('../../assets/images/hero-800.webp')} style={{ width: '100%', height: 310 }} contentFit="cover" accessibilityLabel="صورة تحريرية لحقيبة وعطر ووشاح، وليست منتجات معروضة للبيع" />
      <View style={{ position: 'absolute', bottom: 10, right: 10, backgroundColor: c.card, paddingHorizontal: 8 }}><Copy muted style={{ fontSize: 9 }}>صورة للإلهام • ليست منتجًا معروضًا</Copy></View>
    </View>
    <View style={{ paddingHorizontal: 23, paddingVertical: 23 }}>
      <Copy style={{ color: c.accent, fontSize: 11 }}>شياكة تبدأ بتفصيلة</Copy>
      <Copy style={{ fontFamily: fonts.heading, fontSize: 38, lineHeight: 53, marginVertical: 5 }}>التفصيلة الأخيرة،{'\n'}هي ما يُذكَر.</Copy>
      <Copy muted style={{ marginBottom: 20 }}>شنطة ترافق يومكِ، عطر يشبهكِ، وطرحة تُكمّل الحكاية.</Copy>
      <Action label="اكتشفي المتجر" onPress={() => router.push('/shop')} />
    </View>
    <View style={{ borderTopWidth: 1, borderColor: c.border, paddingTop: 22 }}>
      <View style={[s.row, { paddingHorizontal: 22 }]}><Copy style={{ fontFamily: fonts.heading, fontSize: 26, lineHeight: 40 }}>اختاري عالمكِ</Copy><Copy muted style={{ fontSize: 11 }}>ثلاث لمسات، أنتِ</Copy></View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection: 'row-reverse', gap: 12, padding: 20 }}>
        {categories.slice(1).map(cat => <Pressable key={cat.id} onPress={() => router.push({ pathname: '/shop', params: { category: cat.id } })} accessibilityRole="button" accessibilityLabel={cat.name}>
          <Image source={cat.image} style={{ width: 137, height: 164 }} contentFit="cover" accessibilityLabel={`صورة تعريفية بقسم ${cat.name}`} />
          <Copy style={{ fontFamily: fonts.heading, fontSize: 22, lineHeight: 34, marginTop: 7 }}>{cat.name} ←</Copy>
        </Pressable>)}
      </ScrollView>
    </View>
    <View style={s.section}>
      <View style={[s.row, { marginBottom: 18 }]}><Copy style={{ fontFamily: fonts.heading, fontSize: 27, lineHeight: 40 }}>من المتجر</Copy><Pressable onPress={() => router.push('/shop')}><Copy muted>عرض الكل ←</Copy></Pressable></View>
      {products.isLoading ? <Loading /> : products.isError ? <Empty icon="wifi-off" title="تعذّر عرض المنتجات" detail="لم نتمكن من الاتصال بكتالوج المتجر. حاولي مجددًا بعد قليل." retry={() => { void products.refetch(); }} /> : products.data?.length ? <View style={s.grid}>{products.data.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}</View> : <Empty title="لم تُنشر منتجات بعد" detail="نجهّز المجموعة. ستظهر هنا المنتجات الحقيقية فور نشرها في المتجر." />}
    </View>
    <View style={{ backgroundColor: c.secondary, margin: 20, padding: 24 }}>
      <Copy style={{ fontFamily: fonts.heading, fontSize: 29, lineHeight: 42 }}>شياكتكِ… بطريقتكِ</Copy>
      <Copy muted>احفظي ما يعجبكِ في المفضلة، وارجعي له وقت ما تحبي. الأسعار والتوافر تُراجع عند إتمام الطلب.</Copy>
      <Pressable onPress={() => router.push('/favorites')} style={{ marginTop: 14 }}><Copy>إلى مفضّلتكِ ←</Copy></Pressable>
    </View>
  </Page>;
}
