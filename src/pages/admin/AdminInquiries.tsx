import { useEffect, useState } from "react";
import { getClient, type InquiryRecord } from "../../lib/client";
import { formatDateTime } from "../../lib/format";

const STATUSES = ["new", "read", "replied", "archived"] as const;

type InquiryStatus = (typeof STATUSES)[number];

export function AdminInquiries() {
  const [items, setItems] = useState<InquiryRecord[]>([]);
  const [filter, setFilter] = useState<"all" | InquiryStatus>("all");
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    const client = getClient();
    if (!client) return;
    const sub = client.models.InquiryMessage.observeQuery().subscribe({
      next: ({ items: list }: { items: InquiryRecord[] }) => setItems(list),
    });
    return () => sub.unsubscribe();
  }, []);

  const filtered = [...items]
    .filter((m) => (filter === "all" ? true : m.status === filter))
    .sort(
      (a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
    );

  const setStatus = async (m: InquiryRecord, status: InquiryStatus) => {
    const client = getClient();
    if (!client) return;
    await client.models.InquiryMessage.update({ id: m.id, status });
  };

  const remove = async (m: InquiryRecord) => {
    if (!window.confirm("Delete this message?")) return;
    const client = getClient();
    if (!client) return;
    await client.models.InquiryMessage.delete({ id: m.id });
  };

  return (
    <div>
      <div className="mb-8">
        <div className="eyebrow mb-2">Inbox</div>
        <h1 className="font-display text-3xl md:text-4xl">Inquiries</h1>
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {(["all", ...STATUSES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs uppercase tracking-widest border ${
              filter === s
                ? "border-clay-500 text-clay-400 bg-clay-500/10"
                : "border-ink-900/10/15 text-ink-700"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card p-10 text-center text-ink-500">No messages in this view.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((m) => {
            const isOpen = openId === m.id;
            return (
              <div key={m.id} className="card overflow-hidden">
                <button
                  onClick={() => {
                    setOpenId(isOpen ? null : m.id);
                    if (!isOpen && m.status === "new") setStatus(m, "read");
                  }}
                  className="w-full px-6 py-4 flex items-center justify-between text-left gap-4 hover:bg-paper-200"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      {m.status === "new" ? (
                        <span className="w-2 h-2 rounded-full bg-clay-500" />
                      ) : null}
                      <span className="font-medium">{m.name}</span>
                      <span className="text-xs text-ink-500">{m.email}</span>
                    </div>
                    <div className="text-sm text-ink-500 mt-1 truncate">
                      {m.subject || m.message.slice(0, 80)}
                    </div>
                  </div>
                  <div className="text-xs text-ink-500 whitespace-nowrap">
                    {formatDateTime(m.createdAt)}
                  </div>
                </button>
                {isOpen ? (
                  <div className="px-6 pb-6 border-t border-ink-900/10">
                    {m.subject ? (
                      <div className="font-display text-lg mt-4">{m.subject}</div>
                    ) : null}
                    <p className="mt-3 text-ink-900 whitespace-pre-line leading-relaxed">
                      {m.message}
                    </p>
                    {m.phone ? (
                      <div className="mt-3 text-xs text-ink-500">Phone: {m.phone}</div>
                    ) : null}
                    <div className="mt-6 flex flex-wrap gap-2">
                      {STATUSES.map((s) => (
                        <button
                          key={s}
                          onClick={() => setStatus(m, s)}
                          className={`px-3 py-1.5 rounded-full text-xs uppercase tracking-widest border ${
                            m.status === s
                              ? "border-clay-500 text-clay-400 bg-clay-500/10"
                              : "border-ink-900/10/15 text-ink-700"
                          }`}
                        >
                          Mark {s}
                        </button>
                      ))}
                      <a
                        href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject ?? "your inquiry")}`}
                        className="btn-ghost text-xs"
                      >
                        Reply by email
                      </a>
                      <button
                        onClick={() => remove(m)}
                        className="text-xs uppercase tracking-widest text-ink-500 hover:text-clay-500 ml-auto"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
