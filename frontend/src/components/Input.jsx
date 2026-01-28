import "../styles/components.css";

function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  children,
  ...props
}) {
  return (
    <div className="input-wrapper">
      {label && <label className="input-label">{label}</label>}
      <div className="password-wrapper">
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          className={`styled-input ${error ? "error" : ""}`}
          style={{ width: "100%" }}
          {...props}
        />
        {children}
      </div>
      {error && <small className="error-message">{error}</small>}
    </div>
  );
}

export default Input;
