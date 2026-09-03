import React from "react";
import { AlertCircle } from "lucide-react";

export default function Field({
  id,
  label,
  icon: Icon,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
  autoComplete,
  rightSlot,
  error,
  hint,
  maxLength,
}) {
  const errorId = `${id}-err`;
  const hintId = `${id}-hint`;
  const described = [error ? errorId : null, hint ? hintId : null]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="auth-field">
      <label htmlFor={id} className="auth-label">
        <span>{label}</span>
        {required && <b aria-hidden="true">*</b>}
      </label>

      <div className={`auth-input-shell${error ? " is-error" : ""}`}>
        <span className="auth-input-icon" aria-hidden="true">
          {Icon && <Icon size={17} />}
        </span>

        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          required={required}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={described || undefined}
          maxLength={maxLength}
          className="auth-input"
        />

        {rightSlot}
      </div>

      {hint && !error && (
        <p id={hintId} className="auth-hint">
          {hint}
        </p>
      )}

      {error && (
        <p id={errorId} className="auth-error" role="alert">
          <AlertCircle size={13} aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}
