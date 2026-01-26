import { useState } from "react";
import authService from "../../services/authService";
import { validateField } from "../../utils/validators";
import Input from "../../components/Input";

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

      await authService.register(form);

      // здесь обычно redirect на login
      console.log("Регистрация успешна");
    } catch (err) {
      setServerError("Ошибка регистрации");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Регистрация</h1>

      {serverError && <p style={{ color: "red" }}>{serverError}</p>}

      <Input
        label="Имя"
        name="first_name"
        value={form.first_name}
        onChange={handleChange}
        error={errors.first_name}
      />

      <Input
        label="Фамилия"
        name="last_name"
        value={form.last_name}
        onChange={handleChange}
        error={errors.last_name}
      />

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

      <Input
        label="Подтвердите пароль"
        type="password"
        name="password_confirm"
        value={form.password_confirm}
        onChange={handleChange}
        error={errors.password_confirm}
      />

      <select name="role" value={form.role} onChange={handleChange}>
        <option value="tutor">Репетитор</option>
        <option value="student">Ученик</option>
      </select>

      <button type="submit" disabled={loading}>
        {loading ? "Отправка..." : "Зарегистрироваться"}
      </button>
    </form>
  );
}

export default Register;
