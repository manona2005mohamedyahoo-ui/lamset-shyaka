import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const storeBrandingTable = pgTable("store_branding", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  logoUrl: text("logo_url"),
  background: text("background").notNull(),
  foreground: text("foreground").notNull(),
  primary: text("primary").notNull(),
  accent: text("accent").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type StoreBrandingRecord = typeof storeBrandingTable.$inferSelect;
