export function ConfigWarning({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="card p-4 text-xs text-ink-700 border-clay-500/30">
        <div className="eyebrow mb-1 text-clay-400">Preview mode</div>
        <p className="text-ink-500">
          Backend not connected. Deploy with Amplify Gen 2 to load live data.{" "}
          <a
            href="https://docs.amplify.aws/react/start/quickstart/"
            target="_blank"
            rel="noreferrer"
            className="underline text-clay-400"
          >
            Docs
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto my-10 card p-8 text-sm text-ink-700">
      <div className="eyebrow mb-2 text-clay-400">Preview mode</div>
      <h3 className="font-display text-2xl mb-3">The backend isn't connected yet</h3>
      <p className="text-ink-500 leading-relaxed mb-6">
        This site is running against a placeholder{" "}
        <code className="font-mono text-clay-400">amplify_outputs.json</code>. Deploy the
        project with AWS Amplify Gen 2 to generate real credentials — product data, orders,
        and checkout will start flowing automatically.
      </p>

      <div className="mb-6">
        <div className="eyebrow mb-2">Deploy steps</div>
        <ol className="list-decimal list-inside space-y-2 text-ink-500 leading-relaxed">
          <li>
            Push this repo to GitHub, then in the{" "}
            <a
              href="https://console.aws.amazon.com/amplify/"
              target="_blank"
              rel="noreferrer"
              className="underline text-clay-400"
            >
              AWS Amplify console
            </a>{" "}
            choose <strong>Host web app</strong> → GitHub → pick the repo/branch.
          </li>
          <li>
            Set Stripe secrets locally (they'll be uploaded to SSM):
            <pre className="mt-2 p-3 bg-ink-900/5 rounded font-mono text-xs overflow-x-auto">
npx ampx sandbox secret set STRIPE_SECRET_KEY{"\n"}
npx ampx sandbox secret set STRIPE_WEBHOOK_SECRET
            </pre>
          </li>
          <li>
            Let Amplify run <code className="font-mono text-clay-400">npm ci &amp;&amp; npx ampx pipeline-deploy</code>{" "}
            — build output is <code className="font-mono text-clay-400">dist/</code>.
          </li>
          <li>
            After deploy, <code className="font-mono text-clay-400">amplify_outputs.json</code>{" "}
            is generated at repo root and this banner disappears on reload.
          </li>
        </ol>
      </div>

      <div className="mb-2">
        <div className="eyebrow mb-2">What you get once deployed</div>
        <ul className="list-disc list-inside space-y-1 text-ink-500">
          <li>Live product catalog from DynamoDB via Amplify Data.</li>
          <li>Stripe Checkout sessions + webhook-driven order records.</li>
          <li>Studio admin sign-in with Cognito (first user creates the account).</li>
          <li>S3-backed product image uploads.</li>
        </ul>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href="https://docs.amplify.aws/react/start/quickstart/"
          target="_blank"
          rel="noreferrer"
          className="btn-ghost text-xs"
        >
          Amplify Gen 2 quickstart →
        </a>
        <a
          href="https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/"
          target="_blank"
          rel="noreferrer"
          className="btn-ghost text-xs"
        >
          Fullstack deploy guide →
        </a>
      </div>
    </div>
  );
}
