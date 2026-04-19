import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Amplify } from "aws-amplify";
// STATIC import — guaranteed to complete before this module evaluates, so
// Amplify.configure below runs BEFORE any component renders. Using a dynamic
// import with top-level await here let child modules start rendering before
// the await resolved, which is what caused the "Client could not be
// generated" error on the live site.
import outputs from "../amplify_outputs.json";
import App from "./App";
import { markAmplifyConfigured } from "./lib/client";
import { AmplifyErrorBoundary } from "./components/AmplifyErrorBoundary";
import "./index.css";

// The CI guard in amplify.yml's frontend preBuild already refuses to publish
// a bundle built against a placeholder, so in production `outputs` is real.
// Locally, it may be a placeholder, but that's fine — Amplify will just warn
// and the dev page will show the ErrorBoundary's Preview-mode banner.
Amplify.configure(outputs as Parameters<typeof Amplify.configure>[0]);
markAmplifyConfigured();

const outputsAny = outputs as Record<string, unknown> & {
  custom?: { stripeCheckoutUrl?: string };
  __placeholder?: boolean;
  data?: { url?: string };
};
const stripeCheckoutUrl = outputsAny.custom?.stripeCheckoutUrl ?? "";
const amplifyConfigured = !outputsAny.__placeholder && typeof outputsAny.data?.url === "string";

console.log("[amplify] configured:", {
  dataUrl: outputsAny.data?.url,
  amplifyConfigured,
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AmplifyErrorBoundary>
      <BrowserRouter>
        <App amplifyConfigured={amplifyConfigured} stripeCheckoutUrl={stripeCheckoutUrl} />
      </BrowserRouter>
    </AmplifyErrorBoundary>
  </React.StrictMode>
);
