function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  ...props
}) {
  return (
    <div>
      {label && <label>{label}</label>}

      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        {...props}
      />

      {error && <small style={{ color: "red" }}>{error}</small>}
    </div>
  );
}

export default Input;
