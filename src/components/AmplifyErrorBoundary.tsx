import { Component } from "react";
import type { ReactNode, ErrorInfo } from "react";

interface Props { children: ReactNode; }
interface State { error: Error | null; }

// Catches the "Client could not be generated" class of runtime errors thrown
// by the Amplify Data client when backend config is partial / missing.
// Render-time throws from proxy getters can't be caught by try/catch —
// React error boundaries are the only way to keep the app from white-screening.
export class AmplifyErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("[AmplifyErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    const msg = this.state.error.message || String(this.state.error);
    const isAmplifyConfig =
      msg.includes("Client could not be generated") ||
      msg.includes("Amplify.configure") ||
      msg.includes("GraphQL provider configuration");
    return (
      <div className="max-w-3xl mx-auto my-10 card p-8 text-sm text-ink-700">
        <div className="eyebrow mb-2 text-clay-400">Preview mode</div>
        <h3 className="font-display text-2xl mb-3">The backend isn't connected yet</h3>
        <p className="text-ink-500 leading-relaxed mb-4">
          {isAmplifyConfig
            ? "The Amplify Data client couldn't be generated — usually because amplify_outputs.json is a placeholder or the backend deploy hasn't finished. Push to GitHub, let Amplify deploy, then reload."
            : "Something went wrong while rendering."}
        </p>
        <pre className="text-[10px] font-mono bg-white/30 p-3 rounded overflow-x-auto text-ink-500">
          {msg}
        </pre>
        <button
          onClick={() => { this.setState({ error: null }); location.reload(); }}
          className="mt-4 px-3 py-1.5 rounded bg-clay-500 text-white text-xs"
        >
          Reload
        </button>
      </div>
    );
  }
}
