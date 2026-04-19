import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";

type AmplifyClient = ReturnType<typeof generateClient<Schema>>;

let client: AmplifyClient | null = null;
let configured = false;

export function markAmplifyConfigured(): void {
  configured = true;
}

export function isAmplifyConfigured(): boolean {
  return configured;
}

// Returns the Amplify Data client, or null if Amplify isn't usable.
//
// IMPORTANT: `generateClient()` returns a Proxy — it won't throw at creation
// even when Amplify.configure() wasn't called. The Proxy only throws when a
// property like `.models` or `.models.Product` is accessed. That means
// `try { generateClient<Schema>() } catch {}` is NOT sufficient to catch
// misconfig — the error bubbles up at first render-time access and white-
// screens the app (or trips the ErrorBoundary if one is mounted).
//
// To make this truly null-safe we probe a property access inside try/catch.
// If that throws, Amplify isn't configured properly and we return null so
// callers can branch on `!client`.
export function getClient(): AmplifyClient | null {
  if (!configured) return null;
  if (client) return client;
  try {
    const c = generateClient<Schema>();
    // Probe: accessing `.models` triggers the same getter path that consumer
    // code uses. If Amplify.configure wasn't called (or the config lacks a
    // GraphQL provider), this line throws here — caught synchronously — and
    // we return null. Wrapped in a typeof check so V8 can't DCE it.
    if (typeof c.models !== "object") return null;
    client = c;
    return client;
  } catch {
    return null;
  }
}

export type ProductRecord = Schema["Product"]["type"];
export type OrderRecord = Schema["Order"]["type"];
export type ShopSettingsRecord = Schema["ShopSettings"]["type"];
export type InquiryRecord = Schema["InquiryMessage"]["type"];
