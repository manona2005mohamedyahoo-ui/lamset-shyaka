import { useEffect, useRef } from 'react';
import { BRAND } from '@/lib/site';
import { useBranding } from '@/context/branding';

function setMeta(attr: 'name' | 'property', key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
}

export function useSeo(title: string, description: string) {
  const branding = useBranding();
  useEffect(() => {
    const pageTitle = title === BRAND ? branding.name : title;
    const full = pageTitle === branding.name ? branding.name : `${pageTitle} | ${branding.name}`;
    const currentDescription = description.replaceAll(BRAND, branding.name);
    document.title = full;
    setMeta('name', 'description', currentDescription);
    setMeta('property', 'og:title', full);
    setMeta('property', 'og:description', currentDescription);
    setMeta('name', 'twitter:title', full);
    setMeta('name', 'twitter:description', currentDescription);
  }, [title, description, branding.name]);
}

export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      el.classList.add('in');
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add('in');
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}
