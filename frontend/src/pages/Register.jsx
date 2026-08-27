import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, AlertTriangle } from "lucide-react";
import { authAPI } from "../services/api";
import { useAuth } from "../services/authContext";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await authAPI.register(form);
      login(res.data.token, res.data.user);
      navigate("/symptom-check");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "72px auto", padding: "0 20px" }}>
      <p className="eyebrow fade-up">
        <UserPlus size={13} strokeWidth={2.4} />
        Create an account
      </p>
      <h1 className="fade-up" style={{ fontSize: 32, marginTop: 10, marginBottom: 28, animationDelay: "0.05s" }}>
        Join HealthConnect
      </h1>

      {error && (
        <div className="error-banner">
          <AlertTriangle size={16} strokeWidth={2.2} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>{error}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="card fade-up"
        style={{ padding: 28, animationDelay: "0.1s" }}
      >
        <div className="field">
          <label htmlFor="name">Full name</label>
          <input id="name" required value={form.name} onChange={update("name")} />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" required value={form.email} onChange={update("email")} />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={update("password")}
          />
        </div>
        <button className="btn-primary" style={{ width: "100%" }} disabled={loading}>
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: 20, fontSize: 14 }}>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}
