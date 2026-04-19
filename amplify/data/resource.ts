import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Product: a
    .model({
      name: a.string().required(),
      slug: a.string().required(),
      description: a.string(),
      story: a.string(),
      priceCents: a.integer().required(),
      currency: a.string().default("usd"),
      images: a.string().array(),
      category: a.string(),
      materials: a.string(),
      dimensions: a.string(),
      weightOz: a.float(),
      leadTimeDays: a.integer(),
      inventory: a.integer().default(0),
      shippingFlatCents: a.integer().default(0),
      freeShippingThresholdCents: a.integer(),
      active: a.boolean().default(true),
      featured: a.boolean().default(false),
      stripeProductId: a.string(),
      stripePriceId: a.string(),
    })
    .authorization((allow) => [
      allow.publicApiKey().to(["read"]),
      allow.authenticated().to(["create", "read", "update", "delete"]),
    ]),

  Order: a
    .model({
      stripeSessionId: a.string(),
      stripePaymentIntentId: a.string(),
      customerEmail: a.string(),
      customerName: a.string(),
      items: a.json(),
      subtotalCents: a.integer(),
      shippingCents: a.integer(),
      taxCents: a.integer(),
      totalCents: a.integer(),
      currency: a.string().default("usd"),
      status: a.enum(["pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"]),
      shippingName: a.string(),
      shippingLine1: a.string(),
      shippingLine2: a.string(),
      shippingCity: a.string(),
      shippingState: a.string(),
      shippingPostal: a.string(),
      shippingCountry: a.string(),
      trackingCarrier: a.string(),
      trackingNumber: a.string(),
      notes: a.string(),
    })
    .authorization((allow) => [
      allow.publicApiKey().to(["create", "read", "update"]),
      allow.authenticated().to(["create", "read", "update", "delete"]),
    ]),

  ShopSettings: a
    .model({
      businessName: a.string(),
      tagline: a.string(),
      about: a.string(),
      email: a.string(),
      phone: a.string(),
      address: a.string(),
      instagramUrl: a.string(),
      heroHeadline: a.string(),
      heroSubheadline: a.string(),
    })
    .authorization((allow) => [
      allow.publicApiKey().to(["read"]),
      allow.authenticated().to(["create", "read", "update", "delete"]),
    ]),

  SeedFlag: a
    .model({
      key: a.string().required(),
      value: a.string(),
    })
    .authorization((allow) => [
      allow.publicApiKey().to(["create", "read", "update"]),
      allow.authenticated().to(["create", "read", "update", "delete"]),
    ]),

  InquiryMessage: a
    .model({
      name: a.string().required(),
      email: a.string().required(),
      phone: a.string(),
      subject: a.string(),
      message: a.string().required(),
      status: a.enum(["new", "read", "replied", "archived"]),
    })
    .authorization((allow) => [
      allow.publicApiKey().to(["create"]),
      allow.authenticated().to(["create", "read", "update", "delete"]),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
