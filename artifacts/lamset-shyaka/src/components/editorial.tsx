import { type ReactNode } from 'react';
import { Link } from 'wouter';
import { useReveal } from '@/hooks/use-seo';
import { img } from '@/lib/site';
import { cn } from '@/lib/utils';

export function EditorialImage({
  name,
  alt,
  className,
  imgClassName,
  eager,
  sizes = '(min-width: 768px) 50vw, 100vw',
}: {
  name: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
  sizes?: string;
}) {
  return (
    <div className={cn('overflow-hidden bg-secondary', className)}>
      <img
        src={img(`${name}.webp`)}
        srcSet={`${img(`${name}-800.webp`)} 800w, ${img(`${name}.webp`)} 1600w`}
        sizes={sizes}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className={cn('h-full w-full object-cover', imgClassName)}
        data-testid={`img-${name}`}
      />
    </div>
  );
}

export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={cn('reveal', className)}>
      {children}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  children?: ReactNode;
}) {
  return (
    <header className="mx-auto max-w-6xl px-5 pb-10 pt-14 md:px-10 md:pt-20">
      <p className="eyebrow rise">{eyebrow}</p>
      <h1 className="font-display rise d1 mt-3 text-4xl leading-tight md:text-6xl" data-testid="text-page-title">
        {title}
      </h1>
      {intro && <p className="rise d2 mt-5 max-w-2xl text-base text-muted-foreground md:text-lg">{intro}</p>}
      {children}
      <div className="gold-rule rise d3 mt-10" />
    </header>
  );
}

export function Ornament({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 12" className={cn('h-3 w-28 text-[hsl(var(--gold))]', className)} aria-hidden="true">
      <path d="M0 6h50M70 6h50" stroke="currentColor" strokeWidth=".8" />
      <path d="M60 1l5 5-5 5-5-5z" fill="none" stroke="currentColor" strokeWidth=".8" />
    </svg>
  );
}

export function EmptyState({
  icon,
  title,
  body,
  actions,
  testId,
}: {
  icon: ReactNode;
  title: string;
  body: string;
  actions?: { href: string; label: string; primary?: boolean }[];
  testId: string;
}) {
  return (
    <div
      className="rise mx-auto flex max-w-xl flex-col items-center border border-border bg-card/60 px-6 py-14 text-center md:px-12"
      data-testid={testId}
      role="status"
    >
      <div className="grid h-16 w-16 place-items-center rounded-full border border-[hsl(var(--gold)/.5)] text-[hsl(var(--gold-deep))]">
        {icon}
      </div>
      <Ornament className="mt-6" />
      <h2 className="font-display mt-4 text-2xl md:text-3xl">{title}</h2>
      <p className="mt-3 text-muted-foreground">{body}</p>
      {actions && (
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {actions.map((a) => (
            <ButtonLink key={a.href} href={a.href} primary={a.primary}>
              {a.label}
            </ButtonLink>
          ))}
        </div>
      )}
    </div>
  );
}

export function ButtonLink({
  href,
  children,
  primary,
  className,
}: {
  href: string;
  children: ReactNode;
  primary?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      data-testid={`link-${href.replace(/\//g, '-').replace(/^-/, '') || 'home'}`}
      className={cn(
        'inline-flex min-h-11 items-center justify-center gap-2 px-7 text-sm tracking-wide transition-colors duration-500',
        primary
          ? 'bg-primary text-primary-foreground hover:bg-[hsl(var(--gold-deep))]'
          : 'border border-foreground/70 hover:border-[hsl(var(--gold))] hover:text-[hsl(var(--gold-deep))]',
        className,
      )}
    >
      {children}
    </Link>
  );
}
