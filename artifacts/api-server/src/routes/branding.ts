import { Router, type Request, type Response, type NextFunction } from "express";
import { clerkClient, getAuth } from "@clerk/express";
import { UpdateAdminStoreBrandingBody } from "@workspace/api-zod";
import {
  DEFAULT_BRANDING,
  hasReadableContrast,
  readBranding,
  saveBranding,
} from "../lib/branding";

const router = Router();

async function requireStoreAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401).json({ error: "سجّلي الدخول بحساب صاحبة المتجر للمتابعة." });
    return;
  }

  try {
    const user = await clerkClient.users.getUser(userId);
    if (user.publicMetadata.storeRole !== "owner") {
      res.status(403).json({ error: "هذا الحساب لا يملك صلاحية إدارة المتجر." });
      return;
    }
    next();
  } catch (error) {
    req.log.error({ err: error }, "Could not verify store administrator");
    res.status(503).json({ error: "تعذّر التحقق من صلاحية الإدارة الآن." });
  }
}

router.get("/store/branding", async (req, res): Promise<void> => {
  try {
    const branding = await readBranding();
    res.set("Cache-Control", "public, max-age=0, must-revalidate");
    res.json(branding);
  } catch (error) {
    req.log.error({ err: error }, "Could not read store branding");
    res.status(503).json({ error: "تعذّر تحميل هوية المتجر الآن." });
  }
});

router.get("/admin/store/branding", requireStoreAdmin, async (req, res): Promise<void> => {
  try {
    res.set("Cache-Control", "no-store");
    res.json(await readBranding());
  } catch (error) {
    req.log.error({ err: error }, "Could not read admin store branding");
    res.status(503).json({ error: "تعذّر تحميل إعدادات الهوية." });
  }
});

router.patch("/admin/store/branding", requireStoreAdmin, async (req, res): Promise<void> => {
  const parsed = UpdateAdminStoreBrandingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "راجعي اسم المتجر والألوان ورابط الشعار." });
    return;
  }

  const input = parsed.data;
  const name = input.name.trim();
  if (!name || name.length > 80) {
    res.status(400).json({ error: "اسم المتجر مطلوب ويجب ألا يتجاوز ٨٠ حرفًا." });
    return;
  }
  if (input.logoUrl !== null) {
    try {
      const url = new URL(input.logoUrl);
      if (url.protocol !== "https:" || url.username || url.password) throw new Error("Unsafe logo URL");
    } catch {
      res.status(400).json({ error: "رابط الشعار يجب أن يكون رابط HTTPS صالحًا." });
      return;
    }
  }
  if (
    !hasReadableContrast(input.foreground, input.background) ||
    !hasReadableContrast(input.accent, input.background)
  ) {
    res.status(400).json({ error: "اختاري ألوانًا تحقق تباينًا واضحًا للنصوص." });
    return;
  }

  try {
    const branding = await saveBranding({
      ...DEFAULT_BRANDING,
      ...input,
      name,
      logoUrl: input.logoUrl,
      background: input.background.toUpperCase(),
      foreground: input.foreground.toUpperCase(),
      primary: input.primary.toUpperCase(),
      accent: input.accent.toUpperCase(),
    });
    res.set("Cache-Control", "no-store");
    res.json(branding);
  } catch (error) {
    req.log.error({ err: error }, "Could not update store branding");
    res.status(503).json({ error: "تعذّر حفظ الهوية. حاولي مرة أخرى." });
  }
});

export default router;
