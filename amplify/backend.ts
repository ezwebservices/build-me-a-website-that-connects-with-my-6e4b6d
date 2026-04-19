import { defineBackend } from "@aws-amplify/backend";
import { FunctionUrlAuthType, HttpMethod } from "aws-cdk-lib/aws-lambda";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { storage } from "./storage/resource";
import { stripeCheckout } from "./functions/stripe-checkout/resource";

const backend = defineBackend({
  auth,
  data,
  storage,
  stripeCheckout,
});

const checkoutFn = backend.stripeCheckout.resources.lambda;
const url = checkoutFn.addFunctionUrl({
  authType: FunctionUrlAuthType.NONE,
  cors: {
    allowedOrigins: ["*"],
    allowedMethods: [HttpMethod.POST, HttpMethod.OPTIONS],
    allowedHeaders: ["*"],
  },
});

backend.addOutput({
  custom: {
    stripeCheckoutUrl: url.url,
  },
});
