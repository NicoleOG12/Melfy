import React from "react";

export default function AuthShell({ children, mode }) {
  return (
    <section
      className={`auth-form-area${mode === "cadastro" ? " cadastro-area" : ""}`}
    >
      <div className="auth-decoration auth-decoration-one" aria-hidden="true">
        ✦
      </div>
      <div className="auth-decoration auth-decoration-two" aria-hidden="true">
        ♡
      </div>
      <div
        className="auth-decoration auth-decoration-three"
        aria-hidden="true"
      >
        ✧
      </div>
      <div className="auth-form-card">{children}</div>
    </section>
  );
}
