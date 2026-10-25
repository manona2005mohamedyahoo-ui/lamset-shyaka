import { Heart, ShoppingBag, UserRound } from 'lucide-react';
import { EmptyState, PageHeader } from '@/components/editorial';
import { useSeo } from '@/hooks/use-seo';

export function Cart() {
  useSeo('السلة', 'سلة التسوق في لمسة شياكة.');
  return (
    <>
      <PageHeader eyebrow="سلة التسوق" title="سلتك فارغة" />
      <div className="px-5">
        <EmptyState
          testId="empty-cart"
          icon={<ShoppingBag className="h-7 w-7" strokeWidth={1.3} />}
          title="لا شيء هنا بعد"
          body="لم تُنشر منتجات في المتجر حتى الآن، لذا لا يمكن إضافة قطع إلى السلة. حين تُنشر القطع ستتمكنين من إضافتها وإتمام الطلب من هنا."
          actions={[
            { href: '/shop', label: 'تسوقي الآن', primary: true },
            { href: '/policies/shipping', label: 'سياسة الشحن' },
          ]}
        />
      </div>
    </>
  );
}

export function Favorites() {
  useSeo('المفضلة', 'القطع المفضلة لديك في لمسة شياكة.');
  return (
    <>
      <PageHeader eyebrow="المفضلة" title="قائمة أمنياتك" />
      <div className="px-5">
        <EmptyState
          testId="empty-favorites"
          icon={<Heart className="h-7 w-7" strokeWidth={1.3} />}
          title="لم تحفظي أي قطعة"
          body="ستظهر هنا القطع التي تحفظينها للعودة إليها لاحقًا. لا توجد منتجات منشورة بعد."
          actions={[{ href: '/shop', label: 'استكشفي المتجر', primary: true }]}
        />
      </div>
    </>
  );
}

export function Account() {
  useSeo('حسابي', 'حسابات العملاء في لمسة شياكة غير مفعّلة بعد.');
  return (
    <>
      <PageHeader eyebrow="حسابي" title="الحسابات غير مفعّلة بعد" intro="لم يتم تفعيل تسجيل الدخول وإنشاء الحسابات للعملاء في هذا الإصدار. لا نطلب منك أي بيانات حاليًا." />
      <div className="px-5">
        <EmptyState
          testId="status-account"
          icon={<UserRound className="h-7 w-7" strokeWidth={1.3} />}
          title="قريبًا: مساحتك الخاصة"
          body="عند التفعيل ستتمكنين من متابعة طلباتك وحفظ عناوينك ومفضلتك. سيُعلن عن ذلك على هذه الصفحة."
          actions={[
            { href: '/policies/privacy', label: 'سياسة الخصوصية' },
            { href: '/shop', label: 'المتجر', primary: true },
          ]}
        />
        <div className="mx-auto mt-6 flex max-w-xl justify-center">
          <button disabled className="min-h-11 cursor-not-allowed border border-border px-8 text-sm text-muted-foreground" data-testid="button-login-disabled">
            تسجيل الدخول — غير متاح بعد
          </button>
        </div>
      </div>
    </>
  );
}
