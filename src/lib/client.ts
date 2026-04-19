import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";

let client: ReturnType<typeof generateClient<Schema>> | null = null;

export function getClient(): ReturnType<typeof generateClient<Schema>> | null {
  if (client) return client;
  try {
    client = generateClient<Schema>();
    return client;
  } catch {
    return null;
  }
}

export type ProductRecord = Schema["Product"]["type"];
export type OrderRecord = Schema["Order"]["type"];
export type ShopSettingsRecord = Schema["ShopSettings"]["type"];
export type InquiryRecord = Schema["InquiryMessage"]["type"];
