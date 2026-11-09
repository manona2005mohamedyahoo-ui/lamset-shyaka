import React, { createContext, useContext } from "react";
import { useGetStoreBranding, type StoreBranding } from "@workspace/api-client-react";

export const DEFAULT_BRANDING: StoreBranding = {
  name: "لمسة شياكة",
  logoUrl: null,
  background: "#F6F2E9",
  foreground: "#1A1714",
  primary: "#1A1714",
  accent: "#81652E",
};

const Context = createContext<StoreBranding>(DEFAULT_BRANDING);

export function BrandingProvider({ children }: { children: React.ReactNode }) {
  const query = useGetStoreBranding({
    query: { staleTime: 0, refetchInterval: 60_000, refetchOnReconnect: true, retry: 1 },
  });
  return <Context.Provider value={query.data ?? DEFAULT_BRANDING}>{children}</Context.Provider>;
}

export function useBranding() {
  return useContext(Context);
}
