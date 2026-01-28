import { Link } from "react-router-dom";
import "../styles/auth.css";

function AuthStatusMessage({
  title,
  message,
  buttonText,
  linkTo,
  icon = "📩",
}) {
  return (
    <div style={{ textAlign: "center", animation: "fadeIn 0.5s" }}>
      <div style={{ fontSize: "3.5rem", marginBottom: "15px" }}>{icon}</div>
      <h2 style={{ marginBottom: "10px", color: "var(--text-dark)" }}>
        {title}
      </h2>
      <p
        style={{
          color: "var(--text-gray)",
          fontWeight: "500",
          marginBottom: "25px",
          lineHeight: "1.5",
        }}
      >
        {message}
      </p>
      <Link
        to={linkTo}
        className="auth-button"
        style={{ display: "block", textDecoration: "none" }}
      >
        {buttonText}
      </Link>
    </div>
  );
}

export default AuthStatusMessage;
