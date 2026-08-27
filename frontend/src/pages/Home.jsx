import { Link } from "react-router-dom";
import { Stethoscope, ShieldCheck, CalendarClock, ArrowRight } from "lucide-react";
import { useAuth } from "../services/authContext";
import PulseLine from "../components/PulseLine";

const FEATURES = [
  {
    icon: Stethoscope,
    title: "AI symptom triage",
    body: "Describe what you're feeling and get a preliminary, urgency-ranked read in seconds — trained on real clinical patterns.",
  },
  {
    icon: CalendarClock,
    title: "Book the right specialist",
    body: "Your assessment routes you straight to a relevant doctor with real-time availability — no blind booking.",
  },
  {
    icon: ShieldCheck,
    title: "Records that follow you",
    body: "Every visit, prescription, and note lives in one place — accessible to you and whoever treats you next.",
  },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div>
      <section style={{ maxWidth: 780, margin: "0 auto", padding: "88px 24px 40px", textAlign: "center" }}>
        <p className="eyebrow fade-up" style={{ justifyContent: "center" }}>
          <Stethoscope size={13} strokeWidth={2.4} />
          AI-based triage &amp; care
        </p>
        <h1
          className="fade-up"
          style={{ fontSize: "clamp(36px, 5.5vw, 58px)", marginTop: 16, lineHeight: 1.08, animationDelay: "0.05s" }}
        >
          Know what to do next,
          <br />
          before you see a doctor.
        </h1>
        <p
          className="fade-up"
          style={{ marginTop: 22, fontSize: 18, maxWidth: 520, marginInline: "auto", animationDelay: "0.1s" }}
        >
          Describe your symptoms and get a preliminary read on urgency —
          then book the right specialist in one place.
        </p>

        <div
          className="fade-up"
          style={{ marginTop: 36, display: "flex", gap: 14, justifyContent: "center", animationDelay: "0.15s" }}
        >
          <Link
            to={user ? "/symptom-check" : "/register"}
            className="btn-primary"
            style={{ textDecoration: "none" }}
          >
            {user ? "Check my symptoms" : "Get started"}
            <ArrowRight size={17} strokeWidth={2.4} />
          </Link>
          {!user && (
            <Link to="/login" className="btn-ghost" style={{ textDecoration: "none" }}>
              Log in
            </Link>
          )}
        </div>

        <div className="fade-up" style={{ marginTop: 48, animationDelay: "0.2s" }}>
          <PulseLine />
        </div>
      </section>

      <section style={{ maxWidth: 1040, margin: "0 auto", padding: "24px 24px 100px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 20,
          }}
        >
          {FEATURES.map(({ icon: Icon, title, body }, i) => (
            <div
              key={title}
              className="card card-hover fade-up"
              style={{ padding: 28, animationDelay: `${0.25 + i * 0.06}s` }}
            >
              <div className="icon-tile" style={{ background: "var(--teal-pale)" }}>
                <Icon size={21} strokeWidth={2} color="var(--teal-dark)" />
              </div>
              <h3 style={{ fontSize: 19, marginTop: 18 }}>{title}</h3>
              <p style={{ marginTop: 8, fontSize: 14.5 }}>{body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
