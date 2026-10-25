import type { MobileProduct, MobileVariant } from '@workspace/api-client-react';

export const categories = [
  { id: 'all', name: 'الكل', image: require('../assets/images/hero-800.webp') },
  { id: 'bags', name: 'الشنط', image: require('../assets/images/bags-800.webp') },
  { id: 'perfume', name: 'العطور', image: require('../assets/images/perfume-800.webp') },
  { id: 'scarves', name: 'الطرح', image: require('../assets/images/scarves-800.webp') },
] as const;
export function categoryMatches(product: MobileProduct, category: string) {
  if (category === 'all') return true;
  const value = `${product.category} ${product.tags.join(' ')}`.toLowerCase();
  const patterns: Record<string, RegExp> = {
    bags: /bag|handbag|شنط|حقيبة|حقائب/,
    perfume: /perfume|fragrance|عطر|عطور|برفيوم/,
    scarves: /scarf|scarves|hijab|طرح|وشاح|أوشحة|حجاب/,
  };
  return patterns[category]?.test(value) ?? false;
}
export function firstVariant(product: MobileProduct) {
  return product.variants.find(v => v.available) ?? product.variants[0];
}
export function money(value: string | number, currency: string) {
  try { return new Intl.NumberFormat('ar-EG', { style: 'currency', currency, maximumFractionDigits: 2 }).format(Number(value)); }
  catch { return `${Number(value).toFixed(2)} ${currency}`; }
}
export function variantLabel(variant: MobileVariant) {
  return variant.title === 'Default Title' ? 'الخيار الأساسي' : variant.title;
}
