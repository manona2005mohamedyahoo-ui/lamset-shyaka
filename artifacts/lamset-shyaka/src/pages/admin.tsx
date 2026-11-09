import { useEffect, useState, type FormEvent } from "react";
import { Link } from "wouter";
import { useAuth } from "@clerk/react";
import {
  getGetStoreBrandingQueryKey,
  useGetAdminStoreBranding,
  useGetMobileStore,
  useUpdateAdminStoreBranding,
  type StoreBranding,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowUpRight, Check, LoaderCircle, ShieldCheck } from "lucide-react";
import { ButtonLink, PageHeader } from "@/components/editorial";
import { useSeo } from "@/hooks/use-seo";

const BRAND_COLORS: { key: "background" | "foreground" | "primary" | "accent"; label: string; help: string }[] = [
  { key: "background", label: "خلفية المتجر", help: "خلفية الصفحات الرئيسية." },
  { key: "foreground", label: "لون النص", help: "يجب أن يظل واضحًا على الخلفية." },
  { key: "primary", label: "اللون الأساسي", help: "الأزرار والعناصر الأساسية." },
  { key: "accent", label: "اللون المميز", help: "التفاصيل الذهبية والعناوين المميزة." },
];

function safeShopifyAdminUrl(value?: string) {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && /^[a-z0-9-]+\.myshopify\.com$/i.test(url.hostname) && url.pathname === "/admin"
      ? url.toString()
      : undefined;
  } catch {
    return undefined;
  }
}

function contrastingText(hex: string) {
  const light = "#FBFAF7";
  const dark = "#1A1714";
  const luminance = (value: string) => {
    const channels = value.slice(1).match(/.{2}/g)!.map((part) => parseInt(part, 16) / 255);
    const linear = channels.map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
    return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
  };
  const against = (text: string) => {
    const a = luminance(text);
    const b = luminance(hex);
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  };
  return against(light) >= against(dark) ? light : dark;
}

export default function Admin() {
  useSeo("إعدادات الهوية", "إعدادات اسم وشعار وألوان المتجر.");
  const { isLoaded, isSignedIn } = useAuth();
  const client = useQueryClient();
  const settings = useGetAdminStoreBranding({
    query: { enabled: isLoaded && Boolean(isSignedIn), retry: false, staleTime: 0 },
  });
  const shopify = useGetMobileStore({
    query: { enabled: Boolean(settings.data), retry: false, staleTime: 60_000 },
  });
  const update = useUpdateAdminStoreBranding();
  const [draft, setDraft] = useState<StoreBranding>();
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (settings.data) setDraft(settings.data);
  }, [settings.data]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft) return;
    setNotice("");
    const logoUrl = draft.logoUrl?.trim() || null;
    if (logoUrl) {
      try {
        const parsed = new URL(logoUrl);
        if (parsed.protocol !== "https:") throw new Error();
      } catch {
        setNotice("رابط الشعار يجب أن يبدأ بـ https://");
        return;
      }
    }
    update.mutate(
      { data: { ...draft, name: draft.name.trim(), logoUrl } },
      {
        onSuccess: async (saved) => {
          setDraft(saved);
          setNotice("تم حفظ الهوية وتحديث بيانات الواجهات.");
          await Promise.all([
            client.invalidateQueries({ queryKey: getGetStoreBrandingQueryKey() }),
            client.invalidateQueries({ queryKey: settings.queryKey }),
          ]);
        },
        onError: (error) => setNotice(error instanceof Error ? error.message : "تعذّر حفظ التغييرات."),
      },
    );
  }

  return (
    <>
      <PageHeader eyebrow="إدارة المتجر" title="إعدادات الهوية" intro="غيّري الاسم والشعار والألوان التي تظهر في الموقع والتطبيق." />
      <section className="mx-auto max-w-4xl space-y-8 px-5 md:px-10">
        {!isLoaded ? (
          <div className="flex min-h-40 items-center justify-center text-muted-foreground"><LoaderCircle className="me-2 h-5 w-5 animate-spin" /> جارٍ التحقق من تسجيل الدخول…</div>
        ) : !isSignedIn ? (
          <div className="border border-border bg-card p-7 md:p-10">
            <ShieldCheck className="h-8 w-8 text-[hsl(var(--gold-deep))]" />
            <h2 className="font-display mt-4 text-2xl">هذه الصفحة لصاحبة المتجر</h2>
            <p className="mt-2 text-sm text-muted-foreground">سجّلي الدخول ببريد الإدارة الذي تم إعداده للمشروع. إنشاء حساب آخر لا يمنح صلاحية تعديل الهوية.</p>
            <ButtonLink href="/sign-in?redirect_url=/admin" primary className="mt-6">تسجيل الدخول</ButtonLink>
          </div>
        ) : settings.isLoading ? (
          <div className="flex min-h-40 items-center justify-center text-muted-foreground"><LoaderCircle className="me-2 h-5 w-5 animate-spin" /> جارٍ تحميل الإعدادات…</div>
        ) : settings.isError || !draft ? (
          <div role="alert" className="border border-border bg-card p-7">
            <h2 className="font-display text-2xl">لم نتمكن من فتح الإعدادات</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              قد لا يملك هذا الحساب صلاحية الإدارة، أو أن إعداد الاتصال بالخدمة يحتاج إلى مراجعة. لم نفتح حقول التعديل دون تحقق من الخادم.
            </p>
            <button type="button" onClick={() => void settings.refetch()} className="mt-5 min-h-11 border border-border px-5 text-sm hover:bg-muted">إعادة المحاولة</button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-8">
            <div className="grid gap-8 border border-border bg-card p-6 md:grid-cols-[1.2fr_.8fr] md:p-8">
              <div className="space-y-6">
                <label className="block space-y-2">
                  <span className="text-sm font-medium">اسم المتجر</span>
                  <input
                    required
                    maxLength={80}
                    value={draft.name}
                    onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                    className="h-12 w-full border border-input bg-background px-3 text-sm"
                    data-testid="input-brand-name"
                  />
                </label>
                <label className="block space-y-2">
                  <span className="text-sm font-medium">رابط الشعار</span>
                  <input
                    type="url"
                    inputMode="url"
                    placeholder="https://..."
                    value={draft.logoUrl ?? ""}
                    onChange={(event) => setDraft({ ...draft, logoUrl: event.target.value || null })}
                    className="h-12 w-full border border-input bg-background px-3 text-left text-sm"
                    dir="ltr"
                    data-testid="input-brand-logo"
                  />
                  <span className="block text-xs leading-relaxed text-muted-foreground">استخدمي رابط صورة HTTPS متاحًا للعامة، مثل رابط من Shopify Files. اتركيه فارغًا لاستخدام اسم المتجر كنص.</span>
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  {BRAND_COLORS.map(({ key, label, help }) => (
                    <label key={key} className="space-y-2">
                      <span className="block text-sm font-medium">{label}</span>
                      <span className="flex h-12 items-center gap-3 border border-input bg-background px-3">
                        <input
                          type="color"
                          aria-label={label}
                          value={draft[key]}
                          onChange={(event) => setDraft({ ...draft, [key]: event.target.value.toUpperCase() })}
                          className="h-8 w-10 cursor-pointer border-0 bg-transparent p-0"
                          data-testid={`input-brand-${key}`}
                        />
                        <span className="font-mono text-sm" dir="ltr">{draft[key]}</span>
                      </span>
                      <span className="block text-xs text-muted-foreground">{help}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">يُرفض الحفظ إذا لم يكن تباين النص والخلفية واللون المميز واضحًا بما يكفي للقراءة.</p>
              </div>
              <aside className="flex flex-col justify-center border border-border/70 bg-background p-6" aria-label="معاينة الهوية">
                <p className="eyebrow">معاينة الهوية</p>
                <div className="mt-6 flex min-h-20 items-center justify-center border-b border-border pb-5">
                  {draft.logoUrl ? (
                    <img src={draft.logoUrl} alt={`شعار ${draft.name}`} className="max-h-16 max-w-48 object-contain" />
                  ) : (
                    <span className="font-display text-3xl">{draft.name}</span>
                  )}
                </div>
                <div className="mt-6 space-y-4">
                  <div className="h-3 w-4/5" style={{ backgroundColor: draft.primary }} />
                  <p className="text-sm" style={{ color: draft.foreground }}>ستظهر الهوية المحدّثة في صفحات المتجر والتطبيق.</p>
                  <button type="button" className="min-h-11 w-full px-5 text-sm" style={{ backgroundColor: draft.primary, color: contrastingText(draft.primary) }}>زر المتجر</button>
                  <p className="text-sm font-medium" style={{ color: draft.accent }}>تفاصيل باللون المميز</p>
                </div>
              </aside>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <button
                type="submit"
                disabled={update.isPending || !draft.name.trim()}
                className="inline-flex min-h-12 items-center justify-center gap-2 bg-primary px-7 text-sm text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                data-testid="button-save-branding"
              >
                {update.isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                {update.isPending ? "جارٍ الحفظ…" : "حفظ التغييرات"}
              </button>
              {notice && <p role="status" aria-live="polite" className="text-sm text-muted-foreground">{notice}</p>}
            </div>
          </form>
        )}

        <aside className="border border-dashed border-[hsl(var(--gold)/.6)] bg-card/50 p-6 md:p-8">
          <h2 className="font-display text-2xl">ما الذي يتغير في Shopify؟</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            هذه الإعدادات تغيّر واجهة الموقع والتطبيق فقط. الكتالوج والأسعار والمخزون وإتمام الشراء تظل في Shopify. شعار وقالب Shopify وصفحات الدفع ورسائل الطلب تحتاج تحديثًا منفصلًا داخل إدارة Shopify، ولا يستطيع هذا النموذج تعديلها.
          </p>
          {safeShopifyAdminUrl(shopify.data?.managementUrl) ? (
            <a href={safeShopifyAdminUrl(shopify.data?.managementUrl)} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm underline underline-offset-4">
              فتح إدارة Shopify <ArrowUpRight className="h-4 w-4" />
            </a>
          ) : (
            <p className="mt-5 text-xs text-muted-foreground">رابط إدارة Shopify غير متاح الآن؛ تحققي من اتصال Shopify وإعداد حسابكِ خارجه.</p>
          )}
          <p className="mt-3 text-xs text-muted-foreground">الألوان تُحفظ في قاعدة بيانات المشروع. صلاحية التعديل تُراجع على الخادم لحساب الإدارة المحدد، وليس باختيار دور من واجهة المتجر.</p>
        </aside>
        <p className="pb-10 text-sm text-muted-foreground"><Link href="/" className="underline underline-offset-4">العودة إلى المتجر</Link></p>
      </section>
    </>
  );
}
