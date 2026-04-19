import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Amplify } from "aws-amplify";
import App from "./App";
import { markAmplifyConfigured } from "./lib/client";
import { AmplifyErrorBoundary } from "./components/AmplifyErrorBoundary";
import "./index.css";

let amplifyConfigured = false;
let stripeCheckoutUrl = "";

try {
  const mod = await import("../amplify_outputs.json");
  const rawOutputs = (mod.default ?? mod) as Record<string, unknown> & {
    custom?: { stripeCheckoutUrl?: string };
    __placeholder?: boolean;
    data?: { url?: string };
  };
  // A valid Amplify Gen 2 outputs file must have:
  //   - no __placeholder flag
  //   - a `data` object with a real GraphQL `url`
  // Checking only `"data" in rawOutputs` is NOT enough — pipeline-deploy can
  // partially succeed and produce `data: {}`, which Amplify.configure accepts
  // silently but generateClient()'s proxy then throws on first model access
  // ("Client could not be generated...").
  const hasRealData =
    !rawOutputs.__placeholder &&
    typeof rawOutputs === "object" &&
    rawOutputs !== null &&
    rawOutputs.data != null &&
    typeof rawOutputs.data === "object" &&
    typeof rawOutputs.data.url === "string" &&
    rawOutputs.data.url.length > 0;
  if (hasRealData) {
    Amplify.configure(rawOutputs as Parameters<typeof Amplify.configure>[0]);
    stripeCheckoutUrl = rawOutputs.custom?.stripeCheckoutUrl ?? "";
    amplifyConfigured = true;
    markAmplifyConfigured();
  } else {
    // Keep a single-line breadcrumb so the "Client could not be generated"
    // white-screen can never recur without a clear local explanation.
    console.warn("[amplify] skipping Amplify.configure — outputs lack data.url (placeholder or partial deploy)");
  }
} catch (e) {
  console.warn("[amplify] could not load amplify_outputs.json:", e);
  amplifyConfigured = false;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AmplifyErrorBoundary>
      <BrowserRouter>
        <App amplifyConfigured={amplifyConfigured} stripeCheckoutUrl={stripeCheckoutUrl} />
      </BrowserRouter>
    </AmplifyErrorBoundary>
  </React.StrictMode>
);
