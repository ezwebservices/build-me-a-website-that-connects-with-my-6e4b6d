export function ConfigWarning() {
  return (
    <div className="max-w-xl mx-auto my-10 card p-6 text-sm text-ink-700">
      <div className="eyebrow mb-2">Preview mode</div>
      <h3 className="font-display text-xl mb-2">The backend isn't connected yet</h3>
      <p className="text-ink-500 leading-relaxed">
        Deploy this project with Amplify Gen 2 so that <code className="font-mono text-clay-400">amplify_outputs.json</code> is
        generated. Until then, product data and checkout cannot be loaded live — but the site
        design is fully rendered so you can iterate on the look and feel.
      </p>
    </div>
  );
}
