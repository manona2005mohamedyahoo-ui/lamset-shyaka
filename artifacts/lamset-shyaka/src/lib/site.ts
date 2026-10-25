export const BRAND = 'لمسة شياكة';

export const img = (name: string) => `${import.meta.env.BASE_URL}images/${name}`;

export type CategorySlug = 'bags' | 'perfume' | 'scarves';

export interface Category {
  slug: CategorySlug;
  name: string;
  roman: string;
  line: string;
  long: string;
  image: string;
  alt: string;
}

export const CATEGORIES: Category[] = [
  {
    slug: 'bags',
    name: 'الحقائب',
    roman: '٠١',
    line: 'خطوط هادئة تحمل يومك بثقة',
    long: 'حقيبة واحدة مختارة بعناية قد تكون هي ما يجمع الإطلالة كلها. هنا ستُعرض الحقائب النسائية حين تنشرها الدار.',
    image: 'bags',
    alt: 'صورة تحريرية لحقيبة يد سوداء بتفاصيل ذهبية على قماش عاجي',
  },
  {
    slug: 'perfume',
    name: 'العطور',
    roman: '٠٢',
    line: 'أثر يبقى بعد أن تغادري المكان',
    long: 'العطر هو التوقيع الذي لا يُرى. سيضم هذا القسم العطور المختارة فور إضافتها إلى المتجر.',
    image: 'perfume',
    alt: 'صورة تحريرية لزجاجة عطر كهرمانية بغطاء ذهبي على حجر بيج',
  },
  {
    slug: 'scarves',
    name: 'الطرح والأوشحة',
    roman: '٠٣',
    line: 'انسيابية القماش حين يلامس الضوء',
    long: 'طبقات من الشيفون والحرير بألوان هادئة. ستظهر الطرح والأوشحة هنا عند نشرها.',
    image: 'scarves',
    alt: 'صورة تحريرية لطرح من الشيفون بألوان العاجي والبيج والأسود',
  },
];

export const NAV = [
  { href: '/', label: 'الرئيسية' },
  { href: '/shop', label: 'المتجر' },
  ...CATEGORIES.map((c) => ({ href: `/category/${c.slug}`, label: c.name })),
  { href: '/about', label: 'عن الدار' },
];
