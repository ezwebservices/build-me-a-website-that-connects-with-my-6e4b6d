import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import App from "./App";
import "./index.css";

const rawOutputs = outputs as Record<string, unknown> & {
  custom?: { stripeCheckoutUrl?: string };
  __placeholder?: boolean;
};

let amplifyConfigured = false;
let stripeCheckoutUrl = "";

if (!rawOutputs.__placeholder) {
  try {
    Amplify.configure(rawOutputs as Parameters<typeof Amplify.configure>[0]);
    stripeCheckoutUrl = rawOutputs.custom?.stripeCheckoutUrl ?? "";
    amplifyConfigured = true;
  } catch {
    amplifyConfigured = false;
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App amplifyConfigured={amplifyConfigured} stripeCheckoutUrl={stripeCheckoutUrl} />
    </BrowserRouter>
  </React.StrictMode>
);
