import { type FormEvent, useEffect, useState } from 'react';
import { useLocation, useSearch } from 'wouter';
import { PackageOpen, RotateCcw, Search, SlidersHorizontal } from 'lucide-react';
import { EmptyState, PageHeader } from '@/components/editorial';
import { useSeo } from '@/hooks/use-seo';
import { CATEGORIES, type CategorySlug } from '@/lib/site';
import { cn } from '@/lib/utils';

const PRICES = [
  { id: 'all', label: 'كل الأسعار' },
  { id: 'low', label: 'الأقل سعرًا أولًا' },
  { id: 'high', label: 'الأعلى سعرًا أولًا' },
];
const COLORS = [
  { id: 'ivory', label: 'عاجي', hex: '#f3ead9' },
  { id: 'beige', label: 'بيج', hex: '#d9c4a3' },
  { id: 'gold', label: 'ذهبي', hex: '#b8975a' },
  { id: 'brown', label: 'بني', hex: '#6e5038' },
  { id: 'black', label: 'أسود', hex: '#1a1611' },
];

export function ShopView({ lockedCategory }: { lockedCategory?: CategorySlug }) {
  const search = useSearch();
  const [, setLocation] = useLocation();
  const urlQ = new URLSearchParams(search).get('q') ?? '';
  const [q, setQ] = useState(urlQ);
  const [cat, setCat] = useState<CategorySlug | 'all'>(lockedCategory ?? 'all');
  const [price, setPrice] = useState('all');
  const [colors, setColors] = useState<string[]>([]);
  const [inStock, setInStock] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => setQ(urlQ), [urlQ]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const v = q.trim();
    if (lockedCategory) return;
    setLocation(v ? `/shop?q=${encodeURIComponent(v)}` : '/shop');
  };
  const reset = () => {
    setCat(lockedCategory ?? 'all');
    setPrice('all');
    setColors([]);
    setInStock(false);
    setQ('');
    if (!lockedCategory) setLocation('/shop');
  };
  const active = (cat !== (lockedCategory ?? 'all') ? 1 : 0) + (price !== 'all' ? 1 : 0) + colors.length + (inStock ? 1 : 0) + (urlQ ? 1 : 0);

  const chip = 'min-h-10 border px-4 text-sm transition-colors';
  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-5 md:px-10 lg:grid-cols-[260px_1fr]">
      <div>
        <button
          className="flex min-h-11 w-full items-center justify-between border border-border px-4 text-sm lg:hidden"
          aria-expanded={filtersOpen}
          aria-controls="filters"
          onClick={() => setFiltersOpen((o) => !o)}
          data-testid="button-filters-toggle"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" /> التصفية {active > 0 && `(${active})`}
          </span>
          <span>{filtersOpen ? 'إخفاء' : 'عرض'}</span>
        </button>
        <aside id="filters" aria-label="عوامل التصفية" className={cn('space-y-9 lg:block', filtersOpen ? 'mt-6 block' : 'hidden')}>
          {!lockedCategory && (
            <fieldset>
              <legend className="eyebrow mb-3">القسم</legend>
              <div className="flex flex-wrap gap-2">
                {[{ slug: 'all' as const, name: 'الكل' }, ...CATEGORIES].map((c) => (
                  <button
                    key={c.slug}
                    aria-pressed={cat === c.slug}
                    onClick={() => setCat(c.slug)}
                    className={cn(chip, cat === c.slug ? 'border-foreground bg-foreground text-background' : 'border-border hover:border-[hsl(var(--gold))]')}
                    data-testid={`filter-category-${c.slug}`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </fieldset>
          )}
          <fieldset>
            <legend className="eyebrow mb-3">السعر</legend>
            <div className="space-y-2">
              {PRICES.map((p) => (
                <label key={p.id} className="flex cursor-pointer items-center gap-3 text-sm">
                  <input type="radio" name="price" checked={price === p.id} onChange={() => setPrice(p.id)} className="h-4 w-4 accent-[hsl(var(--gold-deep))]" data-testid={`filter-price-${p.id}`} />
                  {p.label}
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="eyebrow mb-3">اللون</legend>
            <div className="flex flex-wrap gap-3">
              {COLORS.map((c) => {
                const on = colors.includes(c.id);
                return (
                  <button
                    key={c.id}
                    aria-pressed={on}
                    aria-label={c.label}
                    title={c.label}
                    onClick={() => setColors((s) => (on ? s.filter((x) => x !== c.id) : [...s, c.id]))}
                    className={cn('h-9 w-9 rounded-full border-2 transition-transform', on ? 'scale-110 border-[hsl(var(--gold-deep))]' : 'border-border')}
                    style={{ backgroundColor: c.hex }}
                    data-testid={`filter-color-${c.id}`}
                  />
                );
              })}
            </div>
          </fieldset>
          <fieldset>
            <legend className="eyebrow mb-3">التوفر</legend>
            <label className="flex cursor-pointer items-center gap-3 text-sm">
              <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} className="h-4 w-4 accent-[hsl(var(--gold-deep))]" data-testid="filter-in-stock" />
              المتوفر فقط
            </label>
          </fieldset>
          <button onClick={reset} disabled={active === 0} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-40" data-testid="button-reset-filters">
            <RotateCcw className="h-4 w-4" /> إعادة الضبط
          </button>
        </aside>
      </div>

      <div>
        <form role="search" onSubmit={submit} className="relative">
          <label htmlFor="shop-q" className="sr-only">
            البحث في المنتجات
          </label>
          <input
            id="shop-q"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ما الذي تبحثين عنه؟"
            className="font-display h-14 w-full border-b border-foreground/30 bg-transparent pe-12 text-2xl placeholder:text-muted-foreground/60 focus:border-[hsl(var(--gold))] focus:outline-none"
            data-testid="input-shop-search"
          />
          <button type="submit" aria-label="بحث" className="absolute inset-y-0 end-0 grid w-12 place-items-center" data-testid="button-shop-search">
            <Search className="h-5 w-5" />
          </button>
        </form>
        <p className="mt-4 text-sm text-muted-foreground" aria-live="polite" data-testid="text-result-count">
          {urlQ ? `نتائج البحث عن «${urlQ}»: ` : ''}٠ منتج
        </p>
        <div className="mt-10">
          <EmptyState
            testId="empty-shop"
            icon={<PackageOpen className="h-7 w-7" strokeWidth={1.3} />}
            title={urlQ || active > 0 ? 'لا توجد نتائج مطابقة' : 'لم تُنشر منتجات بعد'}
            body="المتجر متصل حديثًا ولم تُضف إليه أي منتجات حتى الآن. ستظهر القطع هنا تلقائيًا بمجرد نشرها، وستعمل أدوات البحث والتصفية عليها مباشرة."
            actions={[
              { href: '/', label: 'العودة للرئيسية' },
              ...(lockedCategory ? [{ href: '/shop', label: 'كل المتجر', primary: true }] : []),
            ]}
          />
        </div>
      </div>
    </div>
  );
}

export default function Shop() {
  useSeo('المتجر', 'تصفحي حقائب وعطور وطرح لمسة شياكة، مع البحث والتصفية حسب القسم والسعر واللون والتوفر.');
  return (
    <>
      <PageHeader eyebrow="المتجر" title="كل ما في الدار" intro="ابحثي وصفّي حسب القسم أو السعر أو اللون. لا توجد منتجات منشورة حاليًا." />
      <ShopView />
    </>
  );
}
