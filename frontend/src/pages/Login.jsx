import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogIn, AlertTriangle } from "lucide-react";
import { authAPI } from "../services/api";
import { useAuth } from "../services/authContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
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
      const res = await authAPI.login(form);
      login(res.data.token, res.data.user);
      navigate("/symptom-check");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "72px auto", padding: "0 20px" }}>
      <p className="eyebrow fade-up">
        <LogIn size={13} strokeWidth={2.4} />
        Welcome back
      </p>
      <h1 className="fade-up" style={{ fontSize: 32, marginTop: 10, marginBottom: 28, animationDelay: "0.05s" }}>
        Log in
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
          <label htmlFor="email">Email</label>
          <input id="email" type="email" required value={form.email} onChange={update("email")} />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            required
            value={form.password}
            onChange={update("password")}
          />
        </div>
        <button className="btn-primary" style={{ width: "100%" }} disabled={loading}>
          {loading ? "Logging in…" : "Log in"}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: 20, fontSize: 14 }}>
        New here? <Link to="/register">Create an account</Link>
      </p>
    </div>
  );
}
