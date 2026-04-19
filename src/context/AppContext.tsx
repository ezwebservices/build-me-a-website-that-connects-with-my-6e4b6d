import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { getClient, type ShopSettingsRecord } from "../lib/client";
import { seedShopIfNeeded } from "../lib/seed";

interface AppContextValue {
  amplifyConfigured: boolean;
  stripeCheckoutUrl: string;
  settings: ShopSettingsRecord | null;
  setSettings: (s: ShopSettingsRecord | null) => void;
  shopName: string;
  tagline: string;
}

const AppContext = createContext<AppContextValue>({
  amplifyConfigured: false,
  stripeCheckoutUrl: "",
  settings: null,
  setSettings: () => {},
  shopName: "Hearth & Grain",
  tagline: "Bespoke Millwork Atelier",
});

export function AppContextProvider({
  amplifyConfigured,
  stripeCheckoutUrl,
  children,
}: {
  amplifyConfigured: boolean;
  stripeCheckoutUrl: string;
  children: ReactNode;
}) {
  const [settings, setSettings] = useState<ShopSettingsRecord | null>(null);

  useEffect(() => {
    if (!amplifyConfigured) return;
    const client = getClient();
    if (!client) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await client.models.ShopSettings.list({ limit: 1 });
        if (!cancelled && res.data && res.data.length > 0) {
          setSettings(res.data[0]);
        }
      } catch {
        /* ignore */
      }
      if (!cancelled) {
        void seedShopIfNeeded();
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [amplifyConfigured]);

  const value = useMemo<AppContextValue>(
    () => ({
      amplifyConfigured,
      stripeCheckoutUrl,
      settings,
      setSettings,
      shopName: settings?.businessName || "Hearth & Grain",
      tagline: settings?.tagline || "Bespoke Millwork Atelier",
    }),
    [amplifyConfigured, stripeCheckoutUrl, settings]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  return useContext(AppContext);
}
