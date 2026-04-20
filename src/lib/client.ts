import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";

// Lazy-init the data client so it doesn't crash if Amplify isn't configured
// yet. Pattern matches aws-samples/amplify-vite-react-template exactly.
let _client: ReturnType<typeof generateClient<Schema>> | null = null;
let configured = false;

export function markAmplifyConfigured(): void {
  configured = true;
}

export function isAmplifyConfigured(): boolean {
  return configured;
}

export function getClient() {
  if (!_client) {
    try {
      _client = generateClient<Schema>();
    } catch {
      return null;
    }
  }
  return _client;
}

export type ProductRecord = Schema["Product"]["type"];
export type OrderRecord = Schema["Order"]["type"];
export type ShopSettingsRecord = Schema["ShopSettings"]["type"];
export type InquiryRecord = Schema["InquiryMessage"]["type"];
