import { useState } from "react";
import { Plus, Search, AlertTriangle, Activity, ShieldAlert, ShieldCheck } from "lucide-react";
import { symptomAPI } from "../services/api";
import PulseLine from "../components/PulseLine";

const COMMON_SYMPTOMS = [
  "itching",
  "skin_rash",
  "continuous_sneezing",
  "shivering",
  "stomach_pain",
  "acidity",
  "vomiting",
  "fatigue",
  "weight_loss",
  "cough",
  "high_fever",
  "headache",
  "chest_pain",
  "dizziness",
  "nausea",
  "joint_pain",
];

const URGENCY_META = {
  low: { icon: ShieldCheck, label: "Low urgency" },
  moderate: { icon: ShieldAlert, label: "Moderate urgency" },
  high: { icon: AlertTriangle, label: "High urgency" },
};

export default function SymptomChecker() {
  const [selected, setSelected] = useState([]);
  const [customSymptom, setCustomSymptom] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  function toggleSymptom(symptom) {
    setSelected((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  }

  function addCustomSymptom(e) {
    e.preventDefault();
    const cleaned = customSymptom.trim().toLowerCase().replace(/\s+/g, "_");
    if (cleaned && !selected.includes(cleaned)) {
      setSelected((prev) => [...prev, cleaned]);
    }
    setCustomSymptom("");
  }

  async function handleCheck() {
    if (selected.length === 0) return;
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const res = await symptomAPI.check(selected);
      setResult(res.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Couldn't complete the check. Make sure the ML service is running."
      );
    } finally {
      setLoading(false);
    }
  }

  const UrgencyIcon = result ? URGENCY_META[result.urgencyLevel]?.icon ?? Activity : Activity;

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 20px 90px" }}>
      <p className="eyebrow fade-up">
        <Activity size={13} strokeWidth={2.4} />
        Preliminary assessment
      </p>
      <h1 className="fade-up" style={{ fontSize: 34, marginTop: 10, animationDelay: "0.05s" }}>
        What are you feeling?
      </h1>
      <p className="fade-up" style={{ marginTop: 10, maxWidth: 520, animationDelay: "0.08s" }}>
        Select what applies, or add your own. This gives a preliminary read only —
        it isn't a diagnosis, and a doctor should confirm anything urgent.
      </p>

      <div className="card fade-up" style={{ padding: 28, marginTop: 28, animationDelay: "0.12s" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 22 }}>
          {COMMON_SYMPTOMS.map((symptom) => {
            const active = selected.includes(symptom);
            return (
              <button
                key={symptom}
                type="button"
                onClick={() => toggleSymptom(symptom)}
                className={`chip ${active ? "active" : ""}`}
              >
                {symptom.replace(/_/g, " ")}
              </button>
            );
          })}
        </div>

        <form onSubmit={addCustomSymptom} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search
              size={16}
              strokeWidth={2}
              color="var(--ink-faint)"
              style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}
            />
            <input
              placeholder="Add another symptom…"
              value={customSymptom}
              onChange={(e) => setCustomSymptom(e.target.value)}
              style={{
                width: "100%",
                border: "1px solid var(--line)",
                borderRadius: 11,
                padding: "11px 14px 11px 40px",
                fontSize: 14,
              }}
            />
          </div>
          <button type="submit" className="btn-ghost" style={{ padding: "11px 18px" }}>
            <Plus size={16} strokeWidth={2.4} />
            Add
          </button>
        </form>

        {selected.length > 0 && (
          <p style={{ fontSize: 13, marginTop: 4 }}>
            Selected: {selected.map((s) => s.replace(/_/g, " ")).join(", ")}
          </p>
        )}

        <button
          className="btn-primary"
          style={{ marginTop: 22, width: "100%" }}
          disabled={selected.length === 0 || loading}
          onClick={handleCheck}
        >
          {loading ? "Checking…" : "Check my symptoms"}
        </button>
      </div>

      {loading && (
        <div style={{ marginTop: 24 }}>
          <PulseLine />
        </div>
      )}

      {error && (
        <div className="error-banner" style={{ marginTop: 24 }}>
          <AlertTriangle size={17} strokeWidth={2.2} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>{error}</span>
        </div>
      )}

      {result && (
        <div className="card fade-up" style={{ padding: 28, marginTop: 24 }}>
          <p className="eyebrow">
            <Activity size={13} strokeWidth={2.4} />
            Preliminary result
          </p>
          <h2 style={{ fontSize: 27, marginTop: 10 }}>{result.predictedCondition}</h2>
          <div style={{ marginTop: 14, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <span className={`badge urgency-${result.urgencyLevel}`}>
              <UrgencyIcon size={13} strokeWidth={2.4} />
              {URGENCY_META[result.urgencyLevel]?.label ?? result.urgencyLevel}
            </span>
            {result.confidence != null && (
              <span style={{ fontSize: 13, color: "var(--ink-soft)" }}>
                {Math.round(result.confidence * 100)}% confidence
              </span>
            )}
          </div>
          <p style={{ marginTop: 18, fontSize: 14 }}>
            This is a preliminary read, not a diagnosis. Book a consultation with a
            specialist to confirm and get treated.
          </p>
        </div>
      )}
    </div>
  );
}
