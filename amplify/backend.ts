import { defineBackend } from "@aws-amplify/backend";
import { FunctionUrlAuthType, HttpMethod } from "aws-cdk-lib/aws-lambda";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { storage } from "./storage/resource";
import { stripeCheckout } from "./functions/stripe-checkout/resource";
import { stripeWebhook } from "./functions/stripe-webhook/resource";

const backend = defineBackend({
  auth,
  data,
  storage,
  stripeCheckout,
  stripeWebhook,
});

const checkoutFn = backend.stripeCheckout.resources.lambda;
const checkoutUrl = checkoutFn.addFunctionUrl({
  authType: FunctionUrlAuthType.NONE,
  cors: {
    allowedOrigins: ["*"],
    allowedMethods: [HttpMethod.POST],
    allowedHeaders: ["*"],
  },
});

const webhookFn = backend.stripeWebhook.resources.lambda;
const webhookUrl = webhookFn.addFunctionUrl({
  authType: FunctionUrlAuthType.NONE,
  cors: {
    allowedOrigins: ["*"],
    allowedMethods: [HttpMethod.POST],
    allowedHeaders: ["*"],
  },
});

backend.addOutput({
  custom: {
    stripeCheckoutUrl: checkoutUrl.url,
    stripeWebhookUrl: webhookUrl.url,
  },
});
