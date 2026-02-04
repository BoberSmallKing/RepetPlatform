import { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../../components/Input";
import AuthStatusMessage from "../../components/AuthStatusMessage";
import authService from "../../services/authService";
import { validateField } from "../../utils/validators";
import "../../styles/auth.css";

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    const validationError = validateField("email", value);
    setError(validationError);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalError = validateField("email", email);
    if (finalError) {
      setError(finalError);
      return;
    }

    try {
      setLoading(true);
      await authService.resetPassword(email);
      setIsSuccess(true);
    } catch {
      setError("Не удалось отправить письмо. Проверьте адрес.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      {!isSuccess ? (
        <>
          <h1>Восстановление</h1>
          <p
            className="auth-subtitle"
            style={{
              textAlign: "center",
              color: "var(--text-gray)",
              marginBottom: "20px",
            }}
          >
            Введите почту для получения ссылки на смену пароля.
          </p>

          <form onSubmit={handleSubmit}>
            <Input
              label="Ваш Email"
              name="email"
              type="email"
              placeholder="example@mail.com"
              value={email}
              onChange={handleChange}
              error={error}
            />

            <button
              className="main-button"
              type="submit"
              disabled={loading || !!error}
            >
              {loading ? "Отправка..." : "Сбросить пароль"}
            </button>

            <div className="auth-footer">
              <Link to="/login" className="auth-link">
                Вспомнили пароль? Войти
              </Link>
            </div>
          </form>
        </>
      ) : (
        <AuthStatusMessage
          title="Проверьте почту"
          message={`Инструкции по сбросу пароля отправлены на ${email}`}
          buttonText="Вернуться ко входу"
          linkTo="/login"
        />
      )}
    </div>
  );
}

export default ResetPassword;
