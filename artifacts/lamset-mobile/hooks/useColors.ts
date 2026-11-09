import { useColorScheme } from 'react-native';
import colors from '@/constants/colors';
import { useBranding } from '@/context/branding';

function relativeLuminance(hex: string) {
  const channels = hex.slice(1).match(/.{2}/g)!.map(value => parseInt(value, 16) / 255);
  const linear = channels.map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}

function contrastingText(hex: string) {
  const light = '#FBFAF7';
  const dark = '#1A1714';
  const l = relativeLuminance(hex);
  const lightContrast = (Math.max(l, relativeLuminance(light)) + 0.05) / (Math.min(l, relativeLuminance(light)) + 0.05);
  const darkContrast = (Math.max(l, relativeLuminance(dark)) + 0.05) / (Math.min(l, relativeLuminance(dark)) + 0.05);
  return lightContrast >= darkContrast ? light : dark;
}

/**
 * Returns the design tokens for the current color scheme.
 *
 * The returned object contains all color tokens for the active palette
 * plus scheme-independent values like `radius`.
 *
 * Falls back to the light palette when no dark key is defined in
 * constants/colors.ts (the scaffold ships light-only by default).
 * When a sibling web artifact's dark tokens are synced into a `dark`
 * key, this hook will automatically switch palettes based on the
 * device's appearance setting.
 */
export function useColors() {
  const scheme = useColorScheme();
  const branding = useBranding();
  const palette =
    scheme === 'dark' && 'dark' in colors
      ? (colors as Record<string, typeof colors.light>).dark
      : colors.light;
  return {
    ...palette,
    text: branding.foreground,
    background: branding.background,
    card: branding.background,
    secondary: branding.background,
    secondaryForeground: branding.foreground,
    muted: branding.background,
    mutedForeground: branding.foreground,
    foreground: branding.foreground,
    primary: branding.primary,
    primaryForeground: contrastingText(branding.primary),
    accent: branding.accent,
    tint: branding.accent,
    cardForeground: branding.foreground,
    radius: colors.radius,
  };
}
