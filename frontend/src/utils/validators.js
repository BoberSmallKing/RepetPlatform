// utils/validator.js

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateField(name, value, form = {}) {
  switch (name) {
    case "first_name":
      if (!value || !value.trim()) return "Имя обязательно";
      if (value.length < 2) return "Минимум 2 символа";
      return "";

    case "last_name":
      if (!value || !value.trim()) return "Фамилия обязательна";
      if (value.length < 2) return "Минимум 2 символа";
      return "";

    case "email":
      if (!value || !value.trim()) return "Email обязателен";
      if (!EMAIL_REGEX.test(value)) return "Некорректный email";
      return "";

    case "password":
      if (!value) return "Пароль обязателен";
      if (value.length < 8) return "Минимум 8 символов";
      return "";

    case "password_confirm":
      if (!value) return "Подтвердите пароль";
      if (value !== form.password) return "Пароли не совпадают";
      return "";

    case "bio":
      if (value && value.length > 500) return "Максимум 500 символов";
      return "";

    default:
      return "";
  }
}
