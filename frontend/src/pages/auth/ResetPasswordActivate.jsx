import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import authService from "../../services/authService";

function ResetPasswordActivate() {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    new_password: "",
    new_password_confirm: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (form.new_password.length < 8) {
      setError("Минимум 8 символов");
      return;
    }

    if (form.new_password !== form.new_password_confirm) {
      setError("Пароли не совпадают");
      return;
    }

    try {
      setLoading(true);

      await authService.resetPasswordConfirm(uid, token, form);

      setMessage("Пароль успешно изменён");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError("Ссылка недействительна или устарела");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Новый пароль</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      <Input
        label="Новый пароль"
        type="password"
        name="new_password"
        value={form.new_password}
        onChange={handleChange}
      />

      <Input
        label="Повторите пароль"
        type="password"
        name="new_password_confirm"
        value={form.new_password_confirm}
        onChange={handleChange}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Сохранение..." : "Сменить пароль"}
      </button>
    </form>
  );
}

export default ResetPasswordActivate;
