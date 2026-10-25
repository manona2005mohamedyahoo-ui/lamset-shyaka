import React from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { useGetMobileProducts } from '@workspace/api-client-react';
import { Page, Empty, Loading, ProductCard, Action, Copy, s } from '@/components/shop-ui';
import { useShop } from '@/context/shop';

export default function Favorites() {
  const shop = useShop(); const products = useGetMobileProducts({ query: { staleTime: 60000, retry: 1 } });
  const list = (products.data ?? []).filter(p => shop.favorites.includes(p.handle));
  return <Page title="مفضّلتكِ" subtitle="تفاصيل حبيتيها… تستاهل ترجعي لها">
    {!shop.ready ? <Loading /> : !shop.favorites.length ? <><Empty icon="heart" title="كل حاجة حلوة تبدأ بإعجاب" detail="اضغطي على القلب بجوار أي منتج، وهتلاقيه هنا. المفضلة محفوظة على جهازكِ." /><View style={s.section}><Action label="اكتشفي المنتجات" onPress={() => router.push('/shop')} /></View></> : products.isLoading ? <Loading /> : products.isError ? <Empty title="تعذّر تحميل المفضلة" detail="اختياراتكِ محفوظة، لكن الاتصال بالمتجر غير متاح حاليًا." retry={() => { void products.refetch(); }} /> : <View style={s.section}>
      <View style={s.grid}>{list.map(p => <ProductCard key={p.id} product={p} />)}</View>
      {list.length < shop.favorites.length && <Copy muted>بعض المنتجات المحفوظة لم تعد منشورة. لم نحذفها من اختياراتكِ.</Copy>}
    </View>}
  </Page>;
}
