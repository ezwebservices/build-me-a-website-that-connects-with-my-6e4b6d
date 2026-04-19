import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { IronwakeMark } from "../components/IronwakeMark";

export function AboutPage() {
  const { settings, shopName } = useApp();
  const about =
    settings?.about ||
    `${shopName} started as a weekend obsession in a two-stall garage and a pile of scrap steel. Eight years later it's still one person, still two stalls, still one long bench. The machines are louder now, and the designs sit in CAD for weeks before they ever make chips — but the rule hasn't changed: if it can't be finished by hand after the last pass, it doesn't leave the shop.`;

  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-10 py-16">
      <div className="eyebrow mb-3">The atelier</div>
      <h1 className="font-display text-4xl md:text-6xl mb-10">
        One person. One garage. A lot of chips on the floor.
      </h1>
      <div className="grid md:grid-cols-[1fr_320px] gap-12 items-start">
        <div className="space-y-6 text-ink-700 leading-relaxed text-lg whitespace-pre-line">
          {about}
        </div>
        <aside className="card p-6 space-y-6">
          <div>
            <IronwakeMark className="w-10 h-10 text-clay-500 mb-4" />
            <div className="eyebrow mb-2">Studio hours</div>
            <p className="text-sm text-ink-700">
              Weekdays 8a–6p
              <br />
              Visits by appointment
            </p>
          </div>
          <div>
            <div className="eyebrow mb-2">Contact</div>
            <p className="text-sm text-ink-700">
              {settings?.email ?? "hello@ironwake.shop"}
              {settings?.phone ? (
                <>
                  <br />
                  {settings.phone}
                </>
              ) : null}
            </p>
          </div>
          <Link to="/contact" className="btn-ghost w-full">Send a message</Link>
        </aside>
      </div>

      <section className="mt-24 grid md:grid-cols-3 gap-8">
        <Panel
          eyebrow="Design"
          title="Drawn on paper, refined in CAD."
          body="Every project starts as a napkin sketch or a phone photo. Nothing goes to the machine until it's been rotated in three dimensions on a screen and proofed against the tool library."
        />
        <Panel
          eyebrow="Cut"
          title="Three machines, one operator."
          body="A 4×8 router for sheet goods and aluminum, a small-envelope mill for steel and brass, and a hand-me-down laser for engraving. The operator programs, loads, and babysits every run."
        />
        <Panel
          eyebrow="Finish"
          title="Deburred, sanded, patinated, oiled."
          body="Off the machine is only the halfway mark. Each piece is hand-finished with a mix of files, Scotch-Brite, acid patinas, and linseed oil — the reason no two are ever identical."
        />
      </section>
    </div>
  );
}

function Panel({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <div className="card p-8">
      <div className="eyebrow mb-4">{eyebrow}</div>
      <h3 className="font-display text-2xl mb-3">{title}</h3>
      <p className="text-ink-500 leading-relaxed">{body}</p>
    </div>
  );
}
