import React, { useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useGetMobileProducts } from '@workspace/api-client-react';
import { Page, Copy, ProductCard, Empty, Loading, s } from '@/components/shop-ui';
import { categories, categoryMatches, firstVariant } from '@/lib/catalog';
import { useColors } from '@/hooks/useColors';
import { fonts } from '@/constants/colors';

export default function Shop() {
  const params = useLocalSearchParams<{ category?: string }>();
  const [selected, setSelected] = useState<string | null>(null);
  const category = selected ?? params.category ?? 'all';
  const [search, setSearch] = useState('');
  const [available, setAvailable] = useState(false);
  const [sort, setSort] = useState<'default' | 'low' | 'high'>('default');
  const c = useColors();
  const products = useGetMobileProducts({ query: { staleTime: 60000, retry: 1 } });
  const filtered = (products.data ?? []).filter(p => categoryMatches(p, category) &&
    `${p.title} ${p.description} ${p.tags.join(' ')}`.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()) &&
    (!available || p.variants.some(v => v.available)));
  if (sort !== 'default') filtered.sort((a, b) => (Number(firstVariant(a)?.price ?? 0) - Number(firstVariant(b)?.price ?? 0)) * (sort === 'low' ? 1 : -1));
  return <Page title="اكتشفي ما يشبهكِ" subtitle="شنط، عطور، ولمسات تُكمّل إطلالتكِ">
    <View style={{ paddingHorizontal: 22 }}>
      <View style={{ flexDirection: 'row-reverse', alignItems: 'center', borderWidth: 1, borderColor: c.border, backgroundColor: c.card, paddingHorizontal: 12 }}>
        <Feather name="search" size={19} color={c.mutedForeground} />
        <TextInput accessibilityLabel="ابحثي عن منتج" placeholder="شنطة، عطر، طرحة…" placeholderTextColor={c.mutedForeground} value={search} onChangeText={setSearch} returnKeyType="search" style={{ flex: 1, minHeight: 49, paddingHorizontal: 10, fontFamily: fonts.body, textAlign: 'right', color: c.foreground }} />
        {!!search && <Pressable onPress={() => setSearch('')} accessibilityLabel="مسح البحث" style={s.icon}><Feather name="x" size={18} color={c.foreground} /></Pressable>}
      </View>
    </View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection: 'row-reverse', gap: 10, paddingHorizontal: 22, paddingVertical: 20 }}>
      {categories.map(cat => <Pressable key={cat.id} accessibilityRole="button" accessibilityState={{ selected: category === cat.id }} onPress={() => setSelected(cat.id)} style={{ paddingHorizontal: 19, paddingVertical: 9, backgroundColor: category === cat.id ? c.primary : c.muted }}><Copy style={{ color: category === cat.id ? c.primaryForeground : c.foreground }}>{cat.name}</Copy></Pressable>)}
    </ScrollView>
    <View style={{ paddingHorizontal: 22 }}>
      <View style={[s.row, { paddingBottom: 18, borderBottomWidth: 1, borderBottomColor: c.border }]}>
        <Pressable onPress={() => setAvailable(v => !v)} accessibilityRole="checkbox" accessibilityState={{ checked: available }} style={[s.row, { minHeight: 44, gap: 7 }]}>
          <Feather name={available ? 'check-square' : 'square'} color={c.accent} size={18} /><Copy style={{ fontSize: 12 }}>المتاح فقط</Copy>
        </Pressable>
        <Pressable onPress={() => setSort(v => v === 'default' ? 'low' : v === 'low' ? 'high' : 'default')} style={[s.row, { minHeight: 44, gap: 5 }]} accessibilityLabel="تغيير ترتيب السعر"><Feather name="sliders" color={c.foreground} size={16} /><Copy style={{ fontSize: 12 }}>{sort === 'default' ? 'الترتيب الافتراضي' : sort === 'low' ? 'السعر: الأقل أولًا' : 'السعر: الأعلى أولًا'}</Copy></Pressable>
      </View>
      <Copy muted style={{ fontSize: 12, marginVertical: 14 }}>{products.isSuccess ? `${filtered.length} منتج` : 'كتالوج المتجر'}</Copy>
      {products.isLoading ? <Loading /> : products.isError ? <Empty icon="wifi-off" title="الاتصال غير متاح" detail="تعذّر جلب المنتجات من المتجر. لم نعرض منتجات بديلة أو أسعارًا غير مؤكدة." retry={() => { void products.refetch(); }} /> : filtered.length ? <View style={s.grid}>{filtered.map(p => <ProductCard key={p.id} product={p} />)}</View> : <Empty icon="search" title={products.data?.length ? 'لا توجد نتائج مطابقة' : 'المجموعة قيد التجهيز'} detail={products.data?.length ? 'جرّبي كلمة مختلفة أو غيّري الفلاتر.' : 'لم تُنشر منتجات بعد. اسحبي تفاصيل الإطلالة من خيالكِ، وسنضع المنتجات الحقيقية هنا عند نشرها.'} />}
    </View>
  </Page>;
}
