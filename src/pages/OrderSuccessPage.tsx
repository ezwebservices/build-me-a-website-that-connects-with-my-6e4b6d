import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCart } from "../lib/cart";
import { IronwakeMark } from "../components/IronwakeMark";

export function OrderSuccessPage() {
  const [params] = useSearchParams();
  const { clear } = useCart();
  const sessionId = params.get("session_id");

  useEffect(() => {
    clear();
  }, [clear]);

  return (
    <div className="max-w-2xl mx-auto px-6 py-24 text-center">
      <IronwakeMark className="w-16 h-16 text-clay-500 mx-auto mb-8" />
      <div className="eyebrow mb-4">Thank you</div>
      <h1 className="font-display text-4xl md:text-5xl mb-6">Order received.</h1>
      <p className="text-ink-500 text-lg mb-10 leading-relaxed">
        A receipt is on its way to your inbox. You'll hear from the shop directly when your
        piece is packed, with a tracking number and a photo before it goes out.
      </p>
      {sessionId ? (
        <div className="font-mono text-xs text-ink-500 mb-10">
          Reference: {sessionId.slice(0, 18)}…
        </div>
      ) : null}
      <div className="flex flex-wrap gap-4 justify-center">
        <Link to="/shop" className="btn-primary">Keep browsing</Link>
        <Link to="/" className="btn-ghost">Home</Link>
      </div>
    </div>
  );
}
