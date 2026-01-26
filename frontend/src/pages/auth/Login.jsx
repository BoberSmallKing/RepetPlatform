import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import Input from "../../components/Input";
import { validateField } from "../../utils/validators";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value, {
        ...form,
        [name]: value,
      }),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    Object.keys(form).forEach((field) => {
      const error = validateField(field, form[field], form);
      if (error) newErrors[field] = error;
    });

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length !== 0) return;

    try {
      setLoading(true);
      setServerError("");

      await authService.login(form);

      navigate("/");
    } catch (err) {
      setServerError("Ошибка регистрации");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Вход</h1>
      {serverError && <p style={{ color: "red" }}>{serverError}</p>}
      <Input
        label="Email"
        name="email"
        value={form.email}
        onChange={handleChange}
        error={errors.email}
      />

      <Input
        label="Пароль"
        type="password"
        name="password"
        value={form.password}
        onChange={handleChange}
        error={errors.password}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Отправка..." : "Вход"}
      </button>
    </form>
  );
}

export default Login;
