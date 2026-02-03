import { useState } from "react";
import { useParams } from "react-router-dom";
import Input from "../../components/Input";
import EyeIcon from "../../components/EyeIcon";
import AuthStatusMessage from "../../components/AuthStatusMessage";
import authService from "../../services/authService";
import { validateField } from "../../utils/validators";
import "../../styles/auth.css";

function ResetPasswordActivate() {
  const { uid, token } = useParams();

  const [form, setForm] = useState({
    new_password: "",
    new_password_confirm: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
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

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      await authService.resetPasswordConfirm(uid, token, form);
      setIsSuccess(true);
    } catch {
      setServerError(
        "Ссылка недействительна или её срок истек. Попробуйте запросить восстановление снова."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      {isSuccess ? (
        <AuthStatusMessage
          icon="🛡️"
          title="Пароль обновлен!"
          message="Ваш новый пароль успешно сохранен. Теперь вы можете войти в систему, используя новые данные."
          buttonText="Войти в аккаунт"
          linkTo="/login"
        />
      ) : (
        <>
          <h1>Новый пароль</h1>
          <p
            className="auth-subtitle"
            style={{
              textAlign: "center",
              color: "var(--text-gray)",
              marginBottom: "20px",
            }}
          >
            Придумайте надежный пароль (минимум 8 символов)
          </p>

          <form onSubmit={handleSubmit}>
            {serverError && (
              <p
                className="error-message"
                style={{ textAlign: "center", marginBottom: "15px" }}
              >
                {serverError}
              </p>
            )}

            <Input
              label="Новый пароль"
              name="new_password"
              type={showPass ? "text" : "password"}
              placeholder="••••••••"
              value={form.new_password}
              onChange={handleChange}
              error={errors.new_password}
            >
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPass(!showPass)}
                aria-label={showPass ? "Скрыть" : "Показать"}
              >
                <EyeIcon open={showPass} />
              </button>
            </Input>

            <Input
              label="Повторите пароль"
              name="new_password_confirm"
              type={showPass ? "text" : "password"}
              placeholder="••••••••"
              value={form.new_password_confirm}
              onChange={handleChange}
              error={errors.new_password_confirm}
            />

            <button className="auth-button" type="submit" disabled={loading}>
              {loading ? "Сохранение..." : "Обновить пароль"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default ResetPasswordActivate;
