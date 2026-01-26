import { useState } from "react";
import Input from "../../components/Input";
import authService from "../../services/authService";

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Введите email");
      return;
    }

    try {
      setLoading(true);
      await authService.resetPassword(email);
      setMessage("Письмо для сброса пароля отправлено");
    } catch (err) {
      setError("Ошибка при отправке письма");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Сброс пароля</h1>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <Input label="Email" name="email" value={email} onChange={handleChange} />

      <button type="submit" disabled={loading}>
        {loading ? "Отправка..." : "Отправить письмо"}
      </button>
    </form>
  );
}

export default ResetPassword;
