import React, { useState, useId } from "react";
import { Mail, ArrowRight, Loader2, ShoppingCart } from "lucide-react";
import { API_URL } from "../../constants/api";
import MelfySwal from "../../services/melfySwal";
import { useAuth } from "../../context/AuthContext";
import Field from "./Field";
import PasswordField from "./PasswordField";
import AuthShell from "./AuthShell";

export default function LoginForm({ onSwitchToCadastro }) {
  const uid = useId();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!email.trim()) e.email = "Informe seu e-mail";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "E-mail inválido";
    if (!senha) e.senha = "Informe sua senha";
    setErrors(e);
    return !Object.keys(e).length;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    if (!validate() || loading) return;
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/clientes/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), senha }),
      });
      const data = await res.json();

      if (data.error === false) {
        const dados = Array.isArray(data.dados) ? data.dados[0] : data.dados;
        const nome = dados?.nome || "Cliente";

        login(data.token, dados);

        await MelfySwal({
          icon: "success",
          title: `Bem-vindo(a) de volta, ${nome}! 🍰`,
          text: "Redirecionando...",
          confirmButtonText: "Continuar",
        });

        window.location.href = "/doces";
      } else {
        setLoading(false);
        await MelfySwal({
          icon: "error",
          title: "Dados incorretos",
          text: data.mensagem || "E-mail ou senha inválidos. Tente novamente.",
          confirmButtonText: "Tentar novamente",
        });
      }
    } catch {
      setLoading(false);
      await MelfySwal({
        icon: "error",
        title: "Sem conexão",
        text: "Verifique sua internet e tente novamente.",
        confirmButtonText: "OK",
      });
    }
  }

  return (
    <AuthShell mode="login">
      <div className="auth-heading">
        <div className="auth-heading-icon">
          <ShoppingCart size={22} />
        </div>
        <div>
          <span className="auth-eyebrow">Área do cliente</span>
          <h1>Bem-vindo(a) ao Melfy</h1>
          <p>Entre para descobrir e pedir doces artesanais.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="auth-form">
        <Field
          id={`${uid}-email`}
          label="E-mail"
          icon={Mail}
          type="email"
          placeholder="voce@email.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((p) => ({ ...p, email: "" }));
          }}
          autoComplete="username"
          required
          error={errors.email}
        />

        <PasswordField
          id={`${uid}-senha`}
          label="Senha"
          value={senha}
          onChange={(e) => {
            setSenha(e.target.value);
            setErrors((p) => ({ ...p, senha: "" }));
          }}
          autoComplete="current-password"
          error={errors.senha}
        />

        <div className="auth-under-field">
          <span>Pronto para encomendar?</span>
          <a href="#recuperar">Esqueci minha senha</a>
        </div>

        <button
          type="submit"
          className="auth-primary"
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? (
            <>
              <Loader2 size={17} className="auth-spin" />
              Entrando...
            </>
          ) : (
            <>
              Entrar na minha conta
              <ArrowRight size={17} />
            </>
          )}
        </button>
      </form>

      <div className="auth-divider">
        <span>ou</span>
      </div>

      <div className="auth-switch">
        <span>Ainda não tem conta?</span>
        <button onClick={onSwitchToCadastro} type="button">
          Criar minha conta <ArrowRight size={14} />
        </button>
      </div>
    </AuthShell>
  );
}
