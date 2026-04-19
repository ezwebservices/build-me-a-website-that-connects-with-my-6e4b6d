import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="max-w-xl mx-auto px-6 py-32 text-center">
      <div className="eyebrow mb-4">404</div>
      <h1 className="font-display text-5xl mb-6">Wrong tool-path.</h1>
      <p className="text-ink-500 mb-10">
        That page isn't on the bench. Let's get you back to the shop floor.
      </p>
      <Link to="/" className="btn-primary">Home</Link>
    </div>
  );
}
