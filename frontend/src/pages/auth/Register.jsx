import { useState } from "react";
import { Link } from "react-router-dom";
import authService from "../../services/authService";
import { validateField } from "../../utils/validators";
import Input from "../../components/Input";
import AuthStatusMessage from "../../components/AuthStatusMessage";
import EyeIcon from "../../components/EyeIcon"; // Наш новый компонент
import "../../styles/auth.css";

function Register() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password_confirm: "",
    role: "tutor",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      await authService.register(form);
      setIsSuccess(true);
    } catch (err) {
      if (err.response && err.response.data) {
        setErrors(err.response.data);
        setServerError("Проверьте введенные данные");
      } else {
        setServerError("Ошибка соединения с сервером");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      {isSuccess ? (
        <AuthStatusMessage
          title="Проверьте почту!"
          message={`На Ваш ${form.email} отправлено письмо! Подтвердите свой email для активации аккаунта.`}
          buttonText="Перейти к главной"
          linkTo="/"
        />
      ) : (
        <>
          <h1>Создать аккаунт</h1>

          <div className="role-selector">
            <div
              className={`role-slider ${
                form.role === "student" ? "student" : ""
              }`}
            />
            <div
              className={`role-option ${form.role === "tutor" ? "active" : ""}`}
              onClick={() => setForm({ ...form, role: "tutor" })}
            >
              Репетитор
            </div>
            <div
              className={`role-option ${
                form.role === "student" ? "active" : ""
              }`}
              onClick={() => setForm({ ...form, role: "student" })}
            >
              Ученик
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {serverError && (
              <p className="error-message" style={{ textAlign: "center" }}>
                {serverError}
              </p>
            )}

            <div className="input-row">
              <Input
                label="Имя"
                name="first_name"
                placeholder="Иван"
                value={form.first_name}
                onChange={handleChange}
                error={errors.first_name}
              />
              <Input
                label="Фамилия"
                name="last_name"
                placeholder="Иванов"
                value={form.last_name}
                onChange={handleChange}
                error={errors.last_name}
              />
            </div>

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

            <Input
              label="Подтверждение"
              name="password_confirm"
              type={showPass ? "text" : "password"}
              placeholder="••••••••"
              value={form.password_confirm}
              onChange={handleChange}
              error={errors.password_confirm}
            />

            <button className="main-button" type="submit" disabled={loading}>
              {loading ? "Создание профиля..." : "Зарегистрироваться"}
            </button>
          </form>

          <div className="auth-footer">
            Уже есть аккаунт?{" "}
            <Link to="/login" className="auth-link">
              Войти
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default Register;
