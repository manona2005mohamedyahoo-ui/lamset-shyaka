import { type FormEvent, type ReactNode, useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Heart, Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import { CATEGORIES, NAV } from '@/lib/site';
import { cn } from '@/lib/utils';
import { BrandMark, useBranding } from '@/context/branding';

function SearchForm({ id, onDone }: { id: string; onDone?: () => void }) {
  const [, setLocation] = useLocation();
  const [q, setQ] = useState('');
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const v = q.trim();
    setLocation(v ? `/shop?q=${encodeURIComponent(v)}` : '/shop');
    onDone?.();
  };
  return (
    <form role="search" onSubmit={submit} className="relative w-full">
      <label htmlFor={id} className="sr-only">
        ابحثي في المتجر
      </label>
      <input
        id={id}
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="ابحثي عن حقيبة، عطر، وشاح..."
        className="h-11 w-full border-b border-foreground/25 bg-transparent pe-10 ps-1 text-sm placeholder:text-muted-foreground/80 focus:border-[hsl(var(--gold))] focus:outline-none"
        data-testid={`input-${id}`}
      />
      <button
        type="submit"
        aria-label="بحث"
        className="absolute inset-y-0 end-0 grid w-10 place-items-center text-foreground/70 hover:text-[hsl(var(--gold-deep))]"
        data-testid={`button-${id}`}
      >
        <Search className="h-4 w-4" />
      </button>
    </form>
  );
}

function IconLink({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      aria-label={label}
      title={label}
      className="grid h-11 w-11 place-items-center text-foreground/80 transition-colors hover:text-[hsl(var(--gold-deep))]"
      data-testid={`link-icon${href.replace(/\//g, '-')}`}
    >
      {children}
    </Link>
  );
}

function Header() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-3 md:h-20 md:px-8">
        <button
          className="grid h-11 w-11 place-items-center lg:hidden"
          aria-label="فتح القائمة"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen(true)}
          data-testid="button-menu-open"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/" className="flex items-baseline gap-2" data-testid="link-logo">
          <BrandMark className="font-display text-2xl md:text-3xl" />
          <span className="hidden h-1.5 w-1.5 rotate-45 bg-[hsl(var(--gold))] sm:block" aria-hidden="true" />
        </Link>
        <nav aria-label="التنقل الرئيسي" className="ms-10 hidden lg:block">
          <ul className="flex gap-7 text-sm">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className={cn(
                    'relative py-2 transition-colors hover:text-[hsl(var(--gold-deep))]',
                    location === n.href && 'text-[hsl(var(--gold-deep))] after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-[hsl(var(--gold))]',
                  )}
                  aria-current={location === n.href ? 'page' : undefined}
                  data-testid={`link-nav${n.href.replace(/\//g, '-')}`}
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ms-auto hidden w-64 xl:block">
          <SearchForm id="search-header" />
        </div>
        <div className="ms-auto flex items-center xl:ms-4">
          <button
            className="grid h-11 w-11 place-items-center text-foreground/80 hover:text-[hsl(var(--gold-deep))] xl:hidden"
            aria-label="بحث"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((s) => !s)}
            data-testid="button-search-toggle"
          >
            <Search className="h-5 w-5" />
          </button>
          <IconLink href="/favorites" label="المفضلة">
            <Heart className="h-5 w-5" strokeWidth={1.5} />
          </IconLink>
          <IconLink href="/account" label="حسابي">
            <User className="h-5 w-5" strokeWidth={1.5} />
          </IconLink>
          <IconLink href="/cart" label="السلة">
            <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
          </IconLink>
        </div>
      </div>
      {searchOpen && (
        <div className="rise border-t border-border/60 px-5 py-3 xl:hidden">
          <SearchForm id="search-drawer" onDone={() => setSearchOpen(false)} />
        </div>
      )}

      <div
        className={cn(
          'fixed inset-0 z-50 bg-foreground/40 transition-opacity duration-500 lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <aside
        id="mobile-nav"
        aria-label="قائمة الجوال"
        aria-hidden={!open}
        className={cn(
          'fixed inset-y-0 right-0 z-50 flex h-[100dvh] w-[86%] max-w-sm flex-col bg-background px-6 py-5 shadow-2xl transition-transform duration-500 ease-out lg:hidden',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex items-center justify-between">
          <BrandMark className="font-display text-2xl" />
          <button
            className="grid h-11 w-11 place-items-center"
            aria-label="إغلاق القائمة"
            onClick={() => setOpen(false)}
            tabIndex={open ? 0 : -1}
            data-testid="button-menu-close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-6">{open && <SearchForm id="search-mobile" onDone={() => setOpen(false)} />}</div>
        <ul className="mt-8 space-y-1">
          {NAV.map((n, i) => (
            <li key={n.href}>
              <Link
                href={n.href}
                tabIndex={open ? 0 : -1}
                className="flex items-baseline justify-between border-b border-border/60 py-4"
                data-testid={`link-mobile${n.href.replace(/\//g, '-')}`}
              >
                <span className="font-display text-2xl">{n.label}</span>
                <span className="text-xs text-[hsl(var(--gold-deep))]">{`٠${i + 1}`}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-auto grid grid-cols-3 gap-2 pt-6 text-center text-xs text-muted-foreground">
          {[
            ['/cart', 'السلة'],
            ['/favorites', 'المفضلة'],
            ['/account', 'حسابي'],
          ].map(([h, l]) => (
            <Link key={h} href={h} tabIndex={open ? 0 : -1} className="border border-border py-3 hover:text-foreground">
              {l}
            </Link>
          ))}
        </div>
      </aside>
    </header>
  );
}

function Footer() {
  const branding = useBranding();
  const groups = [
    { title: 'الأقسام', links: [{ href: '/shop', label: 'كل المتجر' }, ...CATEGORIES.map((c) => ({ href: `/category/${c.slug}`, label: c.name }))] },
    {
      title: 'السياسات',
      links: [
        { href: '/policies/shipping', label: 'الشحن والتوصيل' },
        { href: '/policies/returns', label: 'الاستبدال والإرجاع' },
        { href: '/policies/privacy', label: 'الخصوصية' },
      ],
    },
    {
      title: 'الدار',
      links: [
        { href: '/about', label: `عن ${branding.name}` },
        { href: '/contact', label: 'تواصلي معنا' },
        { href: '/account', label: 'حسابي' },
        { href: '/admin', label: 'إعدادات الهوية' },
      ],
    },
  ];
  return (
    <footer className="mt-24 bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:px-10">
        <div>
          <p className="font-display text-4xl"><BrandMark className="font-display text-4xl" /></p>
          <p className="mt-4 max-w-xs text-sm text-primary-foreground/65">
            حقائب، عطور، وطرح وأوشحة — اللمسة الأخيرة التي تكتمل بها إطلالتك.
          </p>
          <div className="mt-6 h-px w-24 bg-[hsl(var(--gold))]" />
        </div>
        {groups.map((g) => (
          <nav key={g.title} aria-label={g.title}>
            <h2 className="text-xs tracking-widest text-[hsl(var(--gold))]">{g.title}</h2>
            <ul className="mt-5 space-y-3 text-sm text-primary-foreground/80">
              {g.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition-colors hover:text-[hsl(var(--gold))]" data-testid={`link-footer${l.href.replace(/\//g, '-')}`}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-primary-foreground/10">
        <p className="mx-auto max-w-7xl px-6 py-6 text-xs text-primary-foreground/50 md:px-10">
          © {new Date().getFullYear()} {branding.name}. المتجر في مرحلة الإعداد — لم تُنشر منتجات بعد.
        </p>
      </div>
    </footer>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div dir="rtl" className="flex min-h-[100dvh] flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:right-4 focus:top-4 focus:z-[70] focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground">
        تخطي إلى المحتوى
      </a>
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
