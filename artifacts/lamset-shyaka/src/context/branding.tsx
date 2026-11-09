import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useGetStoreBranding, type StoreBranding } from "@workspace/api-client-react";

export const DEFAULT_BRANDING: StoreBranding = {
  name: "لمسة شياكة",
  logoUrl: null,
  background: "#F6F2E9",
  foreground: "#1A1714",
  primary: "#1A1714",
  accent: "#81652E",
};

const BrandingContext = createContext<StoreBranding>(DEFAULT_BRANDING);

function hexToHsl(hex: string): string {
  const [r, g, b] = hex.slice(1).match(/.{2}/g)!.map((value) => parseInt(value, 16) / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let hue = 0;
  let saturation = 0;
  const lightness = (max + min) / 2;

  if (delta) {
    saturation = delta / (1 - Math.abs(2 * lightness - 1));
    switch (max) {
      case r: hue = ((g - b) / delta) % 6; break;
      case g: hue = (b - r) / delta + 2; break;
      default: hue = (r - g) / delta + 4;
    }
    hue *= 60;
    if (hue < 0) hue += 360;
  }
  return `${Math.round(hue)} ${Math.round(saturation * 100)}% ${Math.round(lightness * 100)}%`;
}

function contrastingText(hex: string): string {
  const light = "#FBFAF7";
  const dark = "#1A1714";
  const luminance = (value: string) => {
    const channels = value.slice(1).match(/.{2}/g)!.map((part) => parseInt(part, 16) / 255);
    const linear = channels.map((channel) =>
      channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
    );
    return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
  };
  const against = (text: string) => {
    const a = luminance(text);
    const b = luminance(hex);
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  };
  return against(light) >= against(dark) ? light : dark;
}

export function BrandingProvider({ children }: { children: ReactNode }) {
  const query = useGetStoreBranding({
    query: { staleTime: 0, refetchInterval: 60_000, retry: 1, refetchOnWindowFocus: true },
  });
  const branding = query.data ?? DEFAULT_BRANDING;

  useEffect(() => {
    const root = document.documentElement;
    for (const token of ["secondary", "muted", "popover", "ivory"]) root.style.setProperty(`--${token}`, hexToHsl(branding.background));
    for (const token of ["secondary-foreground", "muted-foreground", "popover-foreground"]) root.style.setProperty(`--${token}`, hexToHsl(branding.foreground));
    root.style.setProperty("--background", hexToHsl(branding.background));
    root.style.setProperty("--foreground", hexToHsl(branding.foreground));
    root.style.setProperty("--card", hexToHsl(branding.background));
    root.style.setProperty("--card-foreground", hexToHsl(branding.foreground));
    root.style.setProperty("--primary", hexToHsl(branding.primary));
    root.style.setProperty("--accent", hexToHsl(branding.accent));
    root.style.setProperty("--gold", hexToHsl(branding.accent));
    root.style.setProperty("--gold-deep", hexToHsl(branding.accent));
    root.style.setProperty("--ring", hexToHsl(branding.accent));
    root.style.setProperty("--primary-foreground", hexToHsl(contrastingText(branding.primary)));
    root.style.setProperty("--accent-foreground", hexToHsl(contrastingText(branding.accent)));
    document.querySelector('meta[property="og:site_name"]')?.setAttribute("content", branding.name);
    const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (favicon) favicon.href = branding.logoUrl ?? `${import.meta.env.BASE_URL}favicon.svg`;
  }, [branding]);

  return <BrandingContext.Provider value={branding}>{children}</BrandingContext.Provider>;
}

export function useBranding(): StoreBranding {
  return useContext(BrandingContext);
}

export function BrandMark({ className = "" }: { className?: string }) {
  const brand = useBranding();
  return brand.logoUrl ? (
    <img src={brand.logoUrl} alt={brand.name} className={`max-h-10 max-w-36 object-contain ${className}`} />
  ) : (
    <span className={className}>{brand.name}</span>
  );
}
