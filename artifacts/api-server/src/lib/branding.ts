import { and, eq } from "drizzle-orm";
import { db, storeBrandingTable, type StoreBrandingRecord } from "@workspace/db";

export const DEFAULT_BRANDING = {
  name: "لمسة شياكة",
  logoUrl: null,
  background: "#F6F2E9",
  foreground: "#1A1714",
  primary: "#1A1714",
  accent: "#81652E",
} as const;

export type Branding = {
  name: string;
  logoUrl: string | null;
  background: string;
  foreground: string;
  primary: string;
  accent: string;
};

export function toPublicBranding(record?: StoreBrandingRecord | null): Branding {
  if (!record) return DEFAULT_BRANDING;
  return {
    name: record.name,
    logoUrl: record.logoUrl,
    background: record.background,
    foreground: record.foreground,
    primary: record.primary,
    accent: record.accent,
  };
}

export async function readBranding(): Promise<Branding> {
  const [record] = await db
    .select()
    .from(storeBrandingTable)
    .where(eq(storeBrandingTable.id, "main"))
    .limit(1);
  return toPublicBranding(record);
}

export async function saveBranding(value: Branding): Promise<Branding> {
  const [record] = await db
    .insert(storeBrandingTable)
    .values({ id: "main", ...value })
    .onConflictDoUpdate({
      target: storeBrandingTable.id,
      set: { ...value, updatedAt: new Date() },
    })
    .returning();
  return toPublicBranding(record);
}

function luminance(hex: string): number {
  const channels = hex.slice(1).match(/.{2}/g)!.map((part) => parseInt(part, 16) / 255);
  const linear = channels.map((channel) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  );
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}

export function hasReadableContrast(foreground: string, background: string): boolean {
  const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05) >= 4.5;
}
