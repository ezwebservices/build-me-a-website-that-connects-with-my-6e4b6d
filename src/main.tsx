import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Amplify } from "aws-amplify";
import App from "./App";
import { markAmplifyConfigured } from "./lib/client";
import "./index.css";

let amplifyConfigured = false;
let stripeCheckoutUrl = "";

try {
  const mod = await import("../amplify_outputs.json");
  const rawOutputs = (mod.default ?? mod) as Record<string, unknown> & {
    custom?: { stripeCheckoutUrl?: string };
    __placeholder?: boolean;
  };
  const hasData =
    !rawOutputs.__placeholder &&
    typeof rawOutputs === "object" &&
    rawOutputs !== null &&
    "data" in rawOutputs;
  if (hasData) {
    Amplify.configure(rawOutputs as Parameters<typeof Amplify.configure>[0]);
    stripeCheckoutUrl = rawOutputs.custom?.stripeCheckoutUrl ?? "";
    amplifyConfigured = true;
    markAmplifyConfigured();
  }
} catch {
  amplifyConfigured = false;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App amplifyConfigured={amplifyConfigured} stripeCheckoutUrl={stripeCheckoutUrl} />
    </BrowserRouter>
  </React.StrictMode>
);
