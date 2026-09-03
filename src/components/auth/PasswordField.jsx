import React, { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import Field from "./Field";

export default function PasswordField({
  id,
  label,
  value,
  onChange,
  autoComplete,
  error,
  hint,
}) {
  const [show, setShow] = useState(false);

  return (
    <Field
      id={id}
      label={label}
      icon={Lock}
      type={show ? "text" : "password"}
      placeholder={show ? "Sua senha" : "••••••••"}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      required
      error={error}
      hint={hint}
      rightSlot={
        <button
          type="button"
          className="auth-eye"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? "Ocultar senha" : "Mostrar senha"}
          aria-pressed={show}
        >
          {show ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      }
    />
  );
}
