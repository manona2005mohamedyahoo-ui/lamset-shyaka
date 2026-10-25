import { Router, type Request, type Response } from "express";
import { CreateMobileCheckoutBody } from "@workspace/api-zod";
import { shopifyStorefrontRequest, getShopifyStorefrontConfig } from "../lib/shopifyStorefrontClient";

const router = Router();
const fields = `
  id handle title description productType tags
  images(first: 12) { nodes { url altText } }
  variants(first: 100) { nodes {
    id title availableForSale selectedOptions { name value }
    price { amount currencyCode }
  } }
`;
type Product = {
  id: string; handle: string; title: string; description: string; productType: string; tags: string[];
  images: { nodes: { url: string; altText: string | null }[] };
  variants: { nodes: { id: string; title: string; availableForSale: boolean; selectedOptions: { name: string; value: string }[]; price: { amount: string; currencyCode: string } }[] };
};
function mapProduct(p: Product) {
  return {
    id: p.id, handle: p.handle, title: p.title, description: p.description, category: p.productType, tags: p.tags,
    images: p.images.nodes.map(i => ({ url: i.url, alt: i.altText || p.title })),
    variants: p.variants.nodes.map(v => ({
      id: v.id, title: v.title, available: v.availableForSale, options: v.selectedOptions,
      price: v.price.amount, currency: v.price.currencyCode,
    })),
  };
}
function fail(req: Request, res: Response, error: unknown) {
  // Do not log request bodies, checkout URLs, connector settings, or customer data.
  req.log.warn({ message: error instanceof Error ? error.message : "Shopify unavailable" }, "Mobile commerce unavailable");
  res.status(503).json({ error: "تعذّر الاتصال بالمتجر الآن. حاولي مجددًا، وقد يحتاج ربط Shopify إلى تحديث." });
}
let catalog: { value: ReturnType<typeof mapProduct>[]; until: number } | undefined;
let pendingCatalog: Promise<ReturnType<typeof mapProduct>[]> | undefined;
async function readCatalog() {
  if (catalog && catalog.until > Date.now()) return catalog.value;
  if (pendingCatalog) return pendingCatalog;
  pendingCatalog = (async () => {
    const products: Product[] = [];
    let cursor: string | null = null;
    let hasNext = true;
    // Paginate the complete published catalog, rather than silently dropping products.
    while (hasNext) {
      const result: { products: { nodes: Product[]; pageInfo: { hasNextPage: boolean; endCursor: string | null } } } =
        await shopifyStorefrontRequest(`query($cursor: String) {
          products(first:100, after:$cursor) { nodes { ${fields} } pageInfo {hasNextPage endCursor} }
        }`, { cursor });
      products.push(...result.products.nodes);
      hasNext = result.products.pageInfo.hasNextPage;
      cursor = result.products.pageInfo.endCursor;
      if (products.length > 5000) throw new Error("Catalog requires paged client support");
    }
    const value = products.map(mapProduct);
    catalog = { value, until: Date.now() + 60000 };
    return value;
  })().finally(() => { pendingCatalog = undefined; });
  return pendingCatalog;
}
router.get("/mobile/store", async (req, res) => {
  try {
    const config = await getShopifyStorefrontConfig();
    res.json({ name: "لمسة شياكة", managementUrl: `https://${config.shopDomain}/admin` });
  } catch (error) { fail(req, res, error); }
});
router.get("/mobile/products", async (req, res) => {
  try { res.json(await readCatalog()); } catch (error) { fail(req, res, error); }
});
router.get("/mobile/products/:handle", async (req, res) => {
  const handle = String(req.params.handle);
  if (!handle || handle.length > 255) { res.status(400).json({ error: "رابط المنتج غير صالح" }); return; }
  try {
    const data = await shopifyStorefrontRequest<{ product: Product | null }>(
      `query($handle:String!) { product(handle:$handle) { ${fields} } }`, { handle },
    );
    if (!data.product) { res.status(404).json({ error: "المنتج غير موجود أو لم يعد منشورًا" }); return; }
    res.json(mapProduct(data.product));
  } catch (error) { fail(req, res, error); }
});

// No local customer checkout or payment collection. Shopify owns inventory/pricing.
router.post("/mobile/checkout", async (req, res) => {
  const input = CreateMobileCheckoutBody.safeParse(req.body);
  if (!input.success) { res.status(400).json({ error: "السلة غير صالحة. راجعي المنتجات والكميات." }); return; }
  const ids = input.data.lines.map(l => l.merchandiseId);
  if (new Set(ids).size !== ids.length) { res.status(400).json({ error: "ادمجي الكميات المكررة في السلة" }); return; }
  try {
    type Cart = { checkoutUrl: string; totalQuantity: number; lines: { nodes: { quantity: number; merchandise: { id: string } }[] }; cost: { subtotalAmount: { amount: string; currencyCode: string } } };
    const result = await shopifyStorefrontRequest<{
      cartCreate: { cart: Cart | null; userErrors: { message: string }[]; warnings: { message: string }[] };
    }>(`mutation($input:CartInput!) { cartCreate(input:$input) {
      cart { checkoutUrl totalQuantity
        lines(first:50) { nodes { quantity merchandise { ... on ProductVariant { id } } } }
        cost { subtotalAmount { amount currencyCode } }
      }
      userErrors { message }
      warnings { message }
    } }`, { input: { lines: input.data.lines } });
    const payload = result.cartCreate;
    if (payload.userErrors.length || payload.warnings?.length || !payload.cart) {
      res.status(409).json({ error: "تغيّر توافر بعض المنتجات أو الكميات. راجعي السلة قبل المتابعة." }); return;
    }
    const cart = payload.cart;
    const unchanged = input.data.lines.every(line =>
      cart.lines.nodes.some(actual => actual.merchandise.id === line.merchandiseId && actual.quantity === line.quantity));
    if (!unchanged || cart.lines.nodes.length !== input.data.lines.length) {
      res.status(409).json({ error: "الكميات المطلوبة غير متاحة بالكامل. راجعي السلة." }); return;
    }
    const url = new URL(cart.checkoutUrl);
    if (url.protocol !== "https:") throw new Error("Invalid checkout URL");
    res.set("Cache-Control", "no-store");
    res.json({ checkoutUrl: url.toString(), subtotal: cart.cost.subtotalAmount.amount, currency: cart.cost.subtotalAmount.currencyCode });
  } catch (error) { fail(req, res, error); }
});
export default router;
