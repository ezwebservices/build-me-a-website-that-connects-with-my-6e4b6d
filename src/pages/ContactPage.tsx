import { useState } from "react";
import { getClient } from "../lib/client";
import { useApp } from "../context/AppContext";
import { ConfigWarning } from "../components/ConfigWarning";

export function ContactPage() {
  const { amplifyConfigured, settings } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("Commission inquiry");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setError("");
    if (!amplifyConfigured) {
      setError("Backend not connected. Deploy to accept messages.");
      setStatus("error");
      return;
    }
    const client = getClient();
    if (!client) {
      setError("Backend not reachable.");
      setStatus("error");
      return;
    }
    try {
      await client.models.InquiryMessage.create({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || null,
        subject: subject.trim() || null,
        message: message.trim(),
        status: "new",
      });
      setStatus("sent");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send message.");
      setStatus("error");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-10 py-16">
      <div className="eyebrow mb-3">Commission &amp; contact</div>
      <h1 className="font-display text-4xl md:text-6xl mb-10">
        Bring me a drawing. Or a problem.
      </h1>

      {!amplifyConfigured ? <ConfigWarning /> : null}

      <div className="grid md:grid-cols-[1fr_320px] gap-12">
        <form onSubmit={onSubmit} className="card p-8 space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="name" className="label">Name</label>
              <input
                id="name"
                required
                className="field"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email" className="label">Email</label>
              <input
                id="email"
                type="email"
                required
                className="field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="phone" className="label">Phone (optional)</label>
              <input
                id="phone"
                className="field"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="subject" className="label">Subject</label>
              <input
                id="subject"
                className="field"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label htmlFor="message" className="label">Tell me about the piece</label>
            <textarea
              id="message"
              required
              rows={8}
              className="field resize-y"
              placeholder="Materials, dimensions, who it's for, when you need it. Photos welcome as a reply."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          {error ? (
            <div className="text-sm text-clay-400 bg-clay-500/10 border border-clay-500/30 rounded-lg p-3">
              {error}
            </div>
          ) : null}
          {status === "sent" ? (
            <div className="text-sm text-patina-300 bg-patina-500/10 border border-patina-500/30 rounded-lg p-3">
              Message received. Expect a reply within two business days.
            </div>
          ) : null}
          <button
            type="submit"
            disabled={status === "sending"}
            className="btn-primary disabled:opacity-60"
          >
            {status === "sending" ? "Sending…" : "Send message"}
          </button>
        </form>

        <aside className="card p-6 space-y-6 h-fit">
          <div>
            <div className="eyebrow mb-2">Reach the studio</div>
            <p className="text-sm text-ink-700 leading-relaxed">
              {settings?.email || "hello@ironwake.shop"}
              {settings?.phone ? (
                <>
                  <br />
                  {settings.phone}
                </>
              ) : null}
            </p>
          </div>
          <div>
            <div className="eyebrow mb-2">Visit</div>
            <p className="text-sm text-ink-700 whitespace-pre-line leading-relaxed">
              {settings?.address || "Garage 19B\nPortland, OR\nBy appointment"}
            </p>
          </div>
          {settings?.instagramUrl ? (
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost w-full"
            >
              Follow on Instagram
            </a>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
