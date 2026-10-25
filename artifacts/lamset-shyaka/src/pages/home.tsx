import { useState } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Gift, Layers, ShieldCheck, Sparkles } from 'lucide-react';
import { ButtonLink, EditorialImage, Ornament, Reveal } from '@/components/editorial';
import { useSeo } from '@/hooks/use-seo';
import { BRAND, CATEGORIES } from '@/lib/site';
import { cn } from '@/lib/utils';

const TABS = ['الأكثر مبيعًا', 'الجديد', 'المميز', 'العروض'] as const;

function Hero() {
  return (
    <section className="relative">
      <div className="mx-auto grid max-w-7xl md:grid-cols-[1fr_1.15fr] md:items-stretch">
        <div className="order-2 flex flex-col justify-center px-6 py-14 md:order-1 md:px-12 md:py-24">
          <p className="eyebrow rise">حقائب · عطور · طرح وأوشحة</p>
          <h1 className="font-display rise d1 mt-5 text-5xl leading-[1.25] md:text-7xl">
            التفصيلة الأخيرة
            <br />
            <span className="text-gold">هي ما يُذكَر.</span>
          </h1>
          <p className="rise d2 mt-6 max-w-md text-base text-muted-foreground md:text-lg">
            في {BRAND} نؤمن أن الأناقة لا تصرخ. حقيبة تُحمل بهدوء، عطر يترك أثرًا، ووشاح ينساب كما ينبغي — لمسات صغيرة تكتمل بها الإطلالة.
          </p>
          <div className="rise d3 mt-10 flex flex-wrap items-center gap-4">
            <ButtonLink href="/shop" primary className="min-h-12 px-10">
              تسوقي الآن
              <ArrowLeft className="h-4 w-4" />
            </ButtonLink>
            <Link href="/about" className="text-sm underline decoration-[hsl(var(--gold))] underline-offset-8 hover:text-[hsl(var(--gold-deep))]" data-testid="link-hero-about">
              تعرّفي على الدار
            </Link>
          </div>
        </div>
        <div className="relative order-1 md:order-2">
          <EditorialImage
            name="hero"
            eager
            alt="تكوين تحريري لحقيبة عاجية ووشاح حريري بيج وزجاجة عطر بغطاء ذهبي على حجر الترافرتين"
            className="aspect-[4/5] md:aspect-auto md:h-full md:min-h-[640px]"
            imgClassName="slowzoom"
            sizes="(min-width: 768px) 55vw, 100vw"
          />
          <div className="absolute bottom-5 start-5 bg-background/85 px-4 py-2 text-xs backdrop-blur rise d4">
            صورة تحريرية للإلهام — ليست منتجًا معروضًا
          </div>
        </div>
      </div>
    </section>
  );
}

function Categories() {
  return (
    <section aria-labelledby="cats-title" className="mx-auto max-w-7xl px-5 pt-24 md:px-10">
      <Reveal className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="eyebrow">ثلاثة عوالم</p>
          <h2 id="cats-title" className="font-display mt-2 text-4xl md:text-5xl">
            اختاري من أين تبدئين
          </h2>
        </div>
        <p className="max-w-sm text-sm text-muted-foreground">الصور أدناه تحريرية للتعريف بالأقسام، وليست قوائم منتجات.</p>
      </Reveal>
      <div className="mt-12 grid gap-6 md:grid-cols-12 md:gap-8">
        {CATEGORIES.map((c, i) => (
          <Reveal
            key={c.slug}
            className={cn(i === 0 && 'md:col-span-6', i === 1 && 'md:col-span-6 md:mt-24', i === 2 && 'md:col-span-8 md:col-start-3')}
          >
            <Link href={`/category/${c.slug}`} className="group block" data-testid={`link-category-${c.slug}`}>
              <EditorialImage
                name={c.image}
                alt={c.alt}
                className={cn(i === 2 ? 'aspect-[16/10]' : 'aspect-[4/5]')}
                imgClassName="transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
              />
              <div className="mt-5 flex items-baseline justify-between gap-4">
                <div>
                  <span className="text-xs text-[hsl(var(--gold-deep))]">{c.roman}</span>
                  <h3 className="font-display text-3xl">{c.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{c.line}</p>
                </div>
                <span className="flex items-center gap-2 text-sm transition-transform duration-500 group-hover:-translate-x-1">
                  اكتشفي <ArrowLeft className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Curated() {
  const [tab, setTab] = useState<(typeof TABS)[number]>(TABS[0]);
  return (
    <section aria-labelledby="curated-title" className="mt-28 bg-ivory py-20">
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <Reveal className="text-center">
          <p className="eyebrow">مختارات</p>
          <h2 id="curated-title" className="font-display mt-2 text-4xl md:text-5xl">
            اكتشفي التشكيلة
          </h2>
          <Ornament className="mx-auto mt-5" />
        </Reveal>
        <div role="tablist" aria-label="تصنيفات المختارات" className="mt-10 flex justify-center gap-1 overflow-x-auto border-b border-border">
          {TABS.map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              aria-controls="curated-panel"
              onClick={() => setTab(t)}
              className={cn(
                'relative min-h-11 shrink-0 px-5 text-sm transition-colors',
                tab === t ? 'text-foreground after:absolute after:inset-x-3 after:-bottom-px after:h-0.5 after:bg-[hsl(var(--gold))]' : 'text-muted-foreground hover:text-foreground',
              )}
              data-testid={`tab-${t}`}
            >
              {t}
            </button>
          ))}
        </div>
        <div id="curated-panel" role="tabpanel" aria-label={tab} key={tab} className="rise relative mt-12" data-testid="panel-curated-empty">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className={cn('aspect-[3/4] border border-dashed border-[hsl(var(--gold)/.45)]', i > 1 && 'hidden md:block')} />
            ))}
          </div>
          <div className="absolute inset-0 grid place-items-center px-4"><div className="max-w-md bg-ivory px-6 py-6 text-center shadow-sm">
            <p className="font-display text-2xl">لا توجد منتجات منشورة في «{tab}» بعد</p>
            <p className="mt-2 text-sm text-muted-foreground">ستظهر القطع هنا تلقائيًا حين تنشرها الدار من متجرها.</p>
          </div></div>
        </div>
      </div>
    </section>
  );
}

function Manifesto() {
  return (
    <section className="mx-auto mt-28 grid max-w-7xl items-center gap-10 px-5 md:grid-cols-2 md:gap-20 md:px-10">
      <Reveal>
        <EditorialImage name="atelier" alt="ركن داخلي هادئ بقوس عاجي ووشاح بيج معلّق على قضيب نحاسي في ضوء ذهبي" className="aspect-[4/5]" />
      </Reveal>
      <Reveal>
        <p className="eyebrow">فلسفتنا</p>
        <blockquote className="font-display mt-4 text-3xl leading-[1.6] md:text-4xl">
          «لا نبحث عن الكثير، بل عن القطعة التي تشبهك.»
        </blockquote>
        <p className="mt-6 text-muted-foreground">
          {BRAND} مساحة صغيرة للمرأة التي تحب أن تختار بهدوء. نجمع الحقيبة والعطر والوشاح في مكان واحد، لأن الإطلالة لا تكتمل بقطعة منفردة.
        </p>
        <ButtonLink href="/about" className="mt-8">
          اقرئي عن الدار
        </ButtonLink>
      </Reveal>
    </section>
  );
}

function Service() {
  const items = [
    { icon: Layers, title: 'ثلاثة أقسام متكاملة', body: 'حقائب وعطور وطرح في مكان واحد، لتنسيق الإطلالة كاملة.' },
    { icon: Gift, title: 'اختيار بعناية', body: 'المتجر قيد الإعداد، وستُعرض القطع فور نشرها من الدار.' },
    { icon: ShieldCheck, title: 'سياسات واضحة', body: 'سياسات الشحن والإرجاع والخصوصية قيد الإعداد وستُنشر قبل البيع.', href: '/policies/shipping' },
    { icon: Sparkles, title: 'حساب شخصي لاحقًا', body: 'حسابات العملاء والمفضلة غير مفعّلة بعد. سنعلن عند تفعيلها.', href: '/account' },
  ];
  return (
    <section aria-labelledby="svc-title" className="mx-auto mt-28 max-w-7xl px-5 md:px-10">
      <Reveal>
        <h2 id="svc-title" className="font-display text-3xl md:text-4xl">
          ما يجب أن تعرفيه الآن
        </h2>
        <div className="gold-rule mt-6" />
      </Reveal>
      <div className="mt-10 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ icon: Icon, title, body, href }) => (
          <Reveal key={title}>
            <Icon className="h-6 w-6 text-[hsl(var(--gold-deep))]" strokeWidth={1.3} />
            <h3 className="mt-4 text-lg font-medium">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            {href && (
              <Link href={href} className="mt-3 inline-block text-sm underline decoration-[hsl(var(--gold))] underline-offset-4">
                التفاصيل
              </Link>
            )}
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Closing() {
  return (
    <section className="mx-auto mt-28 max-w-7xl px-5 md:px-10">
      <Reveal className="relative overflow-hidden bg-primary px-6 py-20 text-center text-primary-foreground md:py-28">
        <EditorialImage name="scarves" alt="" className="absolute inset-0 opacity-25" />
        <div className="relative">
          <Ornament className="mx-auto" />
          <p className="font-display mx-auto mt-6 max-w-2xl text-4xl leading-snug md:text-5xl">لمسة واحدة تكفي لتغيّر الإطلالة كلها.</p>
          <Link href="/shop" className="mt-10 inline-flex min-h-12 items-center gap-2 bg-[hsl(var(--gold))] px-10 text-sm text-primary transition-colors hover:bg-primary-foreground" data-testid="link-closing-shop">
            تسوقي الآن <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

export default function Home() {
  useSeo(BRAND, 'لمسة شياكة — بوتيك عربي للحقائب النسائية والعطور والطرح والأوشحة. اكتشفي اللمسة الأخيرة لإطلالتك.');
  return (
    <>
      <Hero />
      <Categories />
      <Curated />
      <Manifesto />
      <Service />
      <Closing />
    </>
  );
}
