import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import WelcomePanel from "../components/auth/WelcomePanel";
import LoginForm from "../components/auth/LoginForm";
import CadastroForm from "../components/auth/CadastroForm";
import "../styles/auth.css";

export default function AuthPage() {
  const initMode = new URLSearchParams(window.location.search).get("cadastro")
    ? "cadastro"
    : "login";
  const [mode, setMode] = useState(initMode);

  return (
    <div className={`melfy-auth auth-layout${mode === "cadastro" ? " register-mode" : ""}`}>
      <a href="/" className="auth-back">
        <ChevronLeft size={14} />
        Voltar
      </a>

      <div className="auth-form-column">
        {mode === "login" ? (
          <LoginForm onSwitchToCadastro={() => setMode("cadastro")} />
        ) : (
          <CadastroForm onSwitchToLogin={() => setMode("login")} />
        )}
      </div>

      <div className="auth-visual-column">
        <WelcomePanel
          mode={mode}
          onSwitch={() => setMode(mode === "login" ? "cadastro" : "login")}
        />
      </div>
    </div>
  );
}
