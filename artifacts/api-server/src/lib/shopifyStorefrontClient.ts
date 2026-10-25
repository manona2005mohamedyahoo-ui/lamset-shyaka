// Server-only Storefront client. Never return connector settings to the browser.
type Config = { shopDomain: string; storefrontAccessToken: string };
let configCache: { value: Config; until: number } | undefined;

export async function getShopifyStorefrontConfig(force = false): Promise<Config> {
  if (!force && configCache && configCache.until > Date.now()) return configCache.value;
  const host = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const identity = process.env.REPL_IDENTITY
    ? `repl ${process.env.REPL_IDENTITY}`
    : process.env.WEB_REPL_RENEWAL ? `depl ${process.env.WEB_REPL_RENEWAL}` : null;
  if (!host || !identity) throw new Error("Shopify connector environment is unavailable");
  const url = new URL(`${host.startsWith("localhost") ? "http" : "https"}://${host}/api/v2/connection`);
  url.searchParams.set("include_secrets", "true");
  url.searchParams.set("connector_names", "shopify-store");
  url.searchParams.set("refresh_policy", "none");
  const response = await fetch(url, {
    headers: { "X_REPLIT_TOKEN": identity, Accept: "application/json" },
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`Shopify connection unavailable (${response.status})`);
  const data = await response.json() as {
    items?: { settings?: { shop_domain?: string; storefront_access_token?: string } }[];
  };
  const settings = data.items?.[0]?.settings;
  if (!settings?.shop_domain || !settings.storefront_access_token) {
    throw new Error("Shopify Storefront configuration has not been provisioned");
  }
  if (!/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/i.test(settings.shop_domain)) {
    throw new Error("Invalid Shopify shop domain");
  }
  const value = { shopDomain: settings.shop_domain, storefrontAccessToken: settings.storefront_access_token };
  configCache = { value, until: Date.now() + 60000 };
  return value;
}

export async function shopifyStorefrontRequest<T>(
  query: string, variables?: Record<string, unknown>, retry = true,
): Promise<T> {
  const config = await getShopifyStorefrontConfig();
  const response = await fetch(`https://${config.shopDomain}/api/2026-04/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Storefront-Access-Token": config.storefrontAccessToken },
    body: JSON.stringify({ query, variables }),
    signal: AbortSignal.timeout(12000),
  });
  if (retry && (response.status === 401 || response.status === 403)) {
    await getShopifyStorefrontConfig(true);
    return shopifyStorefrontRequest<T>(query, variables, false);
  }
  const json = await response.json() as { data: T; errors?: unknown[] };
  if (!response.ok || json.errors?.length || !json.data) throw new Error(`Shopify Storefront request failed (${response.status})`);
  return json.data;
}
