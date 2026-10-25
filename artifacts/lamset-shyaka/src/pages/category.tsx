import { Link, useParams } from 'wouter';
import { EditorialImage } from '@/components/editorial';
import { useSeo } from '@/hooks/use-seo';
import { CATEGORIES } from '@/lib/site';
import { cn } from '@/lib/utils';
import { ShopView } from './shop';
import NotFound from './not-found';

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const cat = CATEGORIES.find((c) => c.slug === slug);
  useSeo(cat?.name ?? 'قسم غير موجود', cat ? `${cat.name} في لمسة شياكة — ${cat.line}.` : 'القسم المطلوب غير موجود.');
  if (!cat) return <NotFound />;
  return (
    <>
      <section className="relative">
        <EditorialImage name={cat.image} alt={cat.alt} eager className="h-[58vh] min-h-[380px] md:h-[64vh]" imgClassName="slowzoom" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(30_12%_9%/.7)] via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-5 pb-10 text-[hsl(var(--ivory))] md:px-10">
          <p className="rise text-xs tracking-widest text-[hsl(var(--gold))]">القسم {cat.roman}</p>
          <h1 className="font-display rise d1 mt-2 text-5xl md:text-7xl" data-testid="text-page-title">
            {cat.name}
          </h1>
          <p className="rise d2 mt-3 max-w-xl text-[hsl(var(--ivory)/.85)]">{cat.long}</p>
        </div>
      </section>
      <nav aria-label="الأقسام" className="mx-auto flex max-w-7xl gap-6 overflow-x-auto px-5 py-6 text-sm md:px-10">
        {CATEGORIES.map((c) => (
          <Link
            key={c.slug}
            href={`/category/${c.slug}`}
            aria-current={c.slug === cat.slug ? 'page' : undefined}
            className={cn('shrink-0 py-2', c.slug === cat.slug ? 'border-b border-[hsl(var(--gold))] text-foreground' : 'text-muted-foreground hover:text-foreground')}
          >
            {c.name}
          </Link>
        ))}
      </nav>
      <div className="gold-rule mx-auto mb-12 max-w-7xl" />
      <ShopView key={cat.slug} lockedCategory={cat.slug} />
    </>
  );
}
