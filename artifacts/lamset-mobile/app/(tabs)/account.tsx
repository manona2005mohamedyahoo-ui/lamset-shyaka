import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { router } from 'expo-router';
import { useGetMobileStore } from '@workspace/api-client-react';
import { Page, Copy, Action, s } from '@/components/shop-ui';
import { fonts } from '@/constants/colors';
import { useColors } from '@/hooks/useColors';
import { useShop } from '@/context/shop';
import { useBranding } from '@/context/branding';

export default function Account() {
  const c = useColors(); const shop = useShop(); const branding = useBranding();
  const store = useGetMobileStore({ query: { staleTime: 60000, retry: 1 } });
  const [busy, setBusy] = useState(false); const [error, setError] = useState('');
  async function manage() {
    setBusy(true); setError('');
    try {
      const result = await store.refetch();
      if (!result.data) throw new Error('Store unavailable');
      const url = new URL(result.data.managementUrl);
      if (url.protocol !== 'https:' || !/^[a-z0-9-]+\.myshopify\.com$/i.test(url.hostname) || url.pathname !== '/admin') throw new Error('Invalid administration URL');
      await WebBrowser.openBrowserAsync(url.toString());
    } catch { setError('تعذّر فتح الإدارة. تأكدي من ربط Shopify وحاولي مجددًا.'); }
    finally { setBusy(false); }
  }
  return <Page title="مساحتكِ" subtitle="كل التفاصيل اللي تهمكِ">
    <View style={{ marginHorizontal: 22, padding: 24, backgroundColor: c.secondary }}>
      <View style={s.row}><Copy style={{ fontFamily: fonts.heading, fontSize: 27, lineHeight: 40 }}>أهلًا بيكِ في {branding.name}</Copy><Feather name="user" size={26} color={c.accent} /></View>
      <Copy muted style={{ marginTop: 10 }}>تصفّحي كضيفة واحفظي اختياراتكِ على جهازكِ. بيانات التوصيل والدفع تُدخل في Shopify عند إتمام الطلب.</Copy>
    </View>
    <View style={s.section}>
      {[{ title: 'مفضّلتكِ', detail: `${shop.favorites.length} من اختياراتكِ`, icon: 'heart' as const, route: '/favorites' as const }, { title: 'سلة التسوق', detail: `${shop.cart.reduce((n, l) => n + l.quantity, 0)} قطعة في السلة`, icon: 'shopping-bag' as const, route: '/cart' as const }].map(row => <Pressable key={row.route} onPress={() => router.push(row.route)} style={[s.row, { paddingVertical: 19, borderBottomWidth: 1, borderColor: c.border }]}><View style={[s.row, { justifyContent: 'flex-start' }]}><Feather name={row.icon} size={22} color={c.foreground} /><View><Copy>{row.title}</Copy><Copy muted style={{ fontSize: 12 }}>{row.detail}</Copy></View></View><Feather name="chevron-left" size={18} color={c.mutedForeground} /></Pressable>)}
    </View>
    <View style={{ margin: 22, borderWidth: 1, borderColor: c.border, padding: 22 }}>
      <Feather name="shield" size={27} color={c.accent} style={{ alignSelf: 'flex-end', marginBottom: 12 }} />
      <Copy style={{ fontFamily: fonts.heading, fontSize: 26, lineHeight: 39 }}>لصاحبة المتجر</Copy>
      <Copy muted style={{ marginTop: 8, marginBottom: 18 }}>إدارة المنتجات والصور والمخزون والطلبات من لوحة Shopify الآمنة. تفتح خارج التطبيق، وتحتاج تسجيل دخول بحساب المالك أو موظفة بصلاحية مناسبة.</Copy>
      <Action label="فتح إدارة المتجر ↗" busy={busy} onPress={() => { void manage(); }} />
      {!!error && <Copy style={{ color: c.destructive, marginTop: 10 }}>{error}</Copy>}
      <Copy muted style={{ fontSize: 11, marginTop: 13 }}>هذا المدخل لا يمنح أي صلاحيات. التحقق من الهوية والصلاحيات يتم لدى Shopify، وليس عبر اختيار دور داخل التطبيق.</Copy>
    </View>
    <View style={s.section}><Copy style={{ fontFamily: fonts.heading, fontSize: 25, lineHeight: 38 }}>قبل ما تطلبي</Copy><Copy muted style={{ marginTop: 8 }}>راجعي سياسات التوصيل والاستبدال والخصوصية في صفحة إتمام الطلب. لا نعرض مواعيد شحن أو بيانات تواصل لم تُدخلها صاحبة المتجر.</Copy><Copy muted style={{ fontSize: 11, marginTop: 20 }}>{branding.name} • نسخة التطبيق الأولى{'\n'}المفضلة والسلة محليتان، ولا تتزامنان بين الأجهزة حاليًا.</Copy></View>
  </Page>;
}
