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
    // OPTIONS is NOT a valid value for Lambda Function URL allowedMethods —
    // Function URLs auto-handle CORS preflight. Only real methods belong here.
    allowedMethods: [HttpMethod.POST],
    allowedHeaders: ["*"],
  },
});

backend.addOutput({
  custom: {
    stripeCheckoutUrl: url.url,
  },
});
