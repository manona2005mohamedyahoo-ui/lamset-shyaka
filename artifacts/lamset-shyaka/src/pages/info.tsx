import { useParams } from 'wouter';
import { CircleDashed, Mail } from 'lucide-react';
import { ButtonLink, EditorialImage, EmptyState, Ornament, PageHeader, Reveal } from '@/components/editorial';
import { useSeo } from '@/hooks/use-seo';
import { CATEGORIES } from '@/lib/site';
import { useBranding } from '@/context/branding';
import NotFound from './not-found';

export function About() {
  const branding = useBranding();
  useSeo('عن الدار', 'تعرّفي على لمسة شياكة: بوتيك للحقائب النسائية والعطور والطرح والأوشحة.');
  return (
    <>
      <PageHeader eyebrow="عن الدار" title={`${branding.name}: عن اللمسة الأخيرة`} intro="الاسم يقول الكثير: لمسة — شيء صغير، وشياكة — أناقة تُرى من التفاصيل." />
      <section className="mx-auto grid max-w-6xl gap-12 px-5 md:grid-cols-2 md:px-10">
        <Reveal>
          <EditorialImage name="atelier" alt="ركن عاجي هادئ بوشاح بيج معلق في ضوء ذهبي" className="aspect-[4/5]" />
        </Reveal>
        <Reveal className="space-y-6 text-lg leading-loose">
          <p>
            {branding.name} بوتيك عربي يجمع ثلاثة أشياء تحبها المرأة حين تستعد للخروج: <strong className="font-medium">حقيبة</strong> تحمل يومها،{' '}
            <strong className="font-medium">عطر</strong> يسبقها، و<strong className="font-medium">طرحة أو وشاح</strong> يكمل ملامح الإطلالة.
          </p>
          <p className="text-muted-foreground">
            نحن في بداية الطريق. هذا هو الإصدار الأول من المتجر، والقطع ستُضاف حين تكون جاهزة. لن نكتب هنا ما لم يحدث بعد — ستُكتب قصتنا مع كل قطعة ننشرها.
          </p>
          <Ornament />
          <ul className="space-y-3 text-base">
            {CATEGORIES.map((c) => (
              <li key={c.slug} className="flex items-baseline gap-3">
                <span className="text-xs text-[hsl(var(--gold-deep))]">{c.roman}</span>
                <span className="font-display text-xl">{c.name}</span>
                <span className="text-sm text-muted-foreground">— {c.line}</span>
              </li>
            ))}
          </ul>
          <ButtonLink href="/shop" primary>
            تسوقي الآن
          </ButtonLink>
        </Reveal>
      </section>
    </>
  );
}

const POLICIES: Record<string, { title: string; topics: string[] }> = {
  shipping: { title: 'سياسة الشحن والتوصيل', topics: ['مناطق التوصيل المتاحة', 'المدة المتوقعة للتوصيل', 'رسوم الشحن', 'تتبع الطلب'] },
  returns: { title: 'سياسة الاستبدال والإرجاع', topics: ['مدة طلب الإرجاع أو الاستبدال', 'حالة القطعة المقبولة', 'استثناءات العطور لأسباب صحية', 'طريقة استرداد المبلغ'] },
  privacy: { title: 'سياسة الخصوصية', topics: ['البيانات التي تُجمع', 'كيفية استخدامها وحمايتها', 'ملفات تعريف الارتباط', 'حقوقك في الوصول والحذف'] },
};

export function Policy() {
  const { slug } = useParams<{ slug: string }>();
  const p = POLICIES[slug ?? ''];
  useSeo(p?.title ?? 'سياسة غير موجودة', p ? `${p.title} في لمسة شياكة — مسودة بانتظار إعداد المالك.` : 'الصفحة غير موجودة.');
  if (!p) return <NotFound />;
  return (
    <>
      <PageHeader eyebrow="السياسات · مسودة" title={p.title} intro="هذه السياسة لم تُعتمد بعد. سيضيف صاحب المتجر التفاصيل الرسمية قبل بدء البيع، ولا يُعتدّ بأي محتوى هنا حتى ذلك الحين." />
      <section className="mx-auto max-w-3xl px-5 md:px-10">
        <div className="border border-dashed border-[hsl(var(--gold)/.6)] bg-card/60 p-8" data-testid="status-policy-draft">
          <p className="eyebrow">بانتظار إعداد المالك</p>
          <h2 className="font-display mt-2 text-2xl">ما ستتضمنه هذه السياسة</h2>
          <ul className="mt-6 space-y-4">
            {p.topics.map((t) => (
              <li key={t} className="flex items-center gap-3 text-muted-foreground">
                <CircleDashed className="h-4 w-4 shrink-0 text-[hsl(var(--gold-deep))]" /> {t} — <span className="text-sm">لم يُحدد بعد</span>
              </li>
            ))}
          </ul>
        </div>
        <nav aria-label="سياسات أخرى" className="mt-10 flex flex-wrap gap-3">
          {Object.entries(POLICIES)
            .filter(([k]) => k !== slug)
            .map(([k, v]) => (
              <ButtonLink key={k} href={`/policies/${k}`}>
                {v.title}
              </ButtonLink>
            ))}
        </nav>
      </section>
    </>
  );
}

export function Contact() {
  useSeo('تواصلي معنا', 'بيانات التواصل مع لمسة شياكة لم تُضف بعد.');
  return (
    <>
      <PageHeader eyebrow="تواصلي معنا" title="بيانات التواصل قيد الإعداد" />
      <div className="px-5">
        <EmptyState
          testId="status-contact"
          icon={<Mail className="h-7 w-7" strokeWidth={1.3} />}
          title="لم تُضف وسائل التواصل بعد"
          body="لم يحدد صاحب المتجر بعد رقمًا أو بريدًا أو حسابات للتواصل. ستُنشر هنا فور إعدادها، ولن نعرض بيانات غير مؤكدة."
          actions={[
            { href: '/about', label: 'عن الدار' },
            { href: '/', label: 'الرئيسية', primary: true },
          ]}
        />
      </div>
    </>
  );
}

