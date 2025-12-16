"use client";

import { Eye, EyeOff } from "lucide-react";

export const validatePasswordComplexity = (password) => {
  const errors = [];

  if (password.length < 6) errors.push("Mínimo de 6 caracteres");
  if (!/[A-Z]/.test(password)) errors.push("1 letra maiúscula");
  if (!/[a-z]/.test(password)) errors.push("1 letra minúscula");
  if (!/[0-9]/.test(password)) errors.push("1 número");
  if (!/[@!#$%^&*_]/.test(password)) errors.push("1 caractere especial");

  return errors;
};

export default function PasswordInput({
  label,
  id,
  value,
  onChange,
  showPassword,
  toggleVisibility,
  onInvalidPassword,
  required = true,
}) {
  const handleBlur = () => {
    if (id === "senha") {
      const errors = validatePasswordComplexity(value);
      if (errors.length > 0) {
        onInvalidPassword(
          "Senha fraca. Use maiúscula, minúscula, número e símbolo."
        );
      }
    }
  };

  return (
    <div className="form-group">
      <label htmlFor={id} className="label-com-asterisco">
        {label}
      </label>

      <div className="input-icon-container">
        <input
          type={showPassword ? "text" : "password"}
          id={id}
          className="input-field"
          value={value}
          onChange={onChange}
          onBlur={handleBlur}
          required={required}
        />

        <span className="input-icon" onClick={toggleVisibility}>
          {showPassword ? <EyeOff size={25} /> : <Eye size={25} />}
        </span>
      </div>
    </div>
  );
}
