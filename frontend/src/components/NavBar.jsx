import { Link, useNavigate } from "react-router-dom";
import { HeartPulse, LogOut } from "lucide-react";
import { useAuth } from "../services/authContext";

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "18px 32px",
        borderBottom: "1px solid var(--line)",
        background: "rgba(246, 243, 236, 0.82)",
        backdropFilter: "blur(10px)",
      }}
    >
      <Link
        to="/"
        style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 9 }}
      >
        <HeartPulse size={22} strokeWidth={2.2} color="var(--teal)" />
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 21,
            color: "var(--ink)",
          }}
        >
          HealthConnect
        </span>
      </Link>
      <nav style={{ display: "flex", alignItems: "center", gap: 20 }}>
        {user ? (
          <>
            <span style={{ fontSize: 14, color: "var(--ink-soft)" }}>{user.name}</span>
            <button
              className="btn-ghost"
              onClick={handleLogout}
              style={{ padding: "9px 16px", fontSize: 13.5 }}
            >
              <LogOut size={15} strokeWidth={2.2} />
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ fontSize: 14, fontWeight: 500, textDecoration: "none" }}>
              Log in
            </Link>
            <Link
              to="/register"
              className="btn-primary"
              style={{ textDecoration: "none", padding: "10px 18px", fontSize: 14 }}
            >
              Sign up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
