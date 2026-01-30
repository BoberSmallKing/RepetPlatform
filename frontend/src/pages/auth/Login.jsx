import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authService from "../../services/authService";
import { validateField } from "../../utils/validators";
import Input from "../../components/Input";
import EyeIcon from "../../components/EyeIcon";
import { useAuth } from "../../context/AuthContext";
import "../../styles/auth.css";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { login } = useAuth();
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    const error = validateField(name, value, { ...form, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const newErrors = {};
    Object.keys(form).forEach((field) => {
      const error = validateField(field, form[field], form);
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length !== 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const response = await authService.login(form);
      login(response.user || { loggedIn: true });

      navigate("/dashboard");
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setServerError("Неверный email или пароль");
      } else {
        setServerError("Ошибка сервера. Попробуйте позже.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <h1>С возвращением!</h1>
      <p
        className="auth-subtitle"
        style={{
          textAlign: "center",
          color: "var(--text-gray)",
          marginBottom: "20px",
        }}
      >
        Войдите в свой аккаунт репетитора или ученика
      </p>

      {serverError && (
        <div
          className="error-message"
          style={{
            textAlign: "center",
            marginBottom: "15px",
            fontWeight: "600",
          }}
        >
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="email@example.com"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
        />

        <Input
          label="Пароль"
          name="password"
          type={showPass ? "text" : "password"}
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
        >
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPass(!showPass)}
            aria-label={showPass ? "Скрыть пароль" : "Показать пароль"}
          >
            <EyeIcon open={showPass} />
          </button>
        </Input>

        <div style={{ textAlign: "right", marginBottom: "15px" }}>
          <Link
            to="/reset-password"
            className="auth-link"
            style={{ fontSize: "0.85rem" }}
          >
            Забыли пароль?
          </Link>
        </div>

        <button className="auth-button" type="submit" disabled={loading}>
          {loading ? "Входим..." : "Войти"}
        </button>
      </form>

      <div className="auth-footer">
        Нет аккаунта?{" "}
        <Link to="/register" className="auth-link">
          Зарегистрироваться
        </Link>
      </div>
    </div>
  );
}

export default Login;
