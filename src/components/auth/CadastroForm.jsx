import React, { useState, useId } from "react";
import { Mail, User,ArrowRight, Loader2, Rocket } from "lucide-react";
import { API_URL } from "../../constants/api";
import MelfySwal from "../../services/melfySwal";
import Field from "./Field";
import PasswordField from "./PasswordField";
import AuthShell from "./AuthShell";

export default function CadastroForm({ onSwitchToLogin }) {
  const uid = useId();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });

  const upd = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));
  const clrErr = (field) => () =>
    setErrors((p) => ({ ...p, [field]: "" }));

  function gerarCpf() {
    const n = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
    const d = (peso, arr) => {
      const r = arr.reduce((s, v, i) => s + v * (peso - i), 0) % 11;
      return r < 2 ? 0 : 11 - r;
    };
    const d1 = d(10, n);
    const d2 = d(11, [...n, d1]);
    return [...n, d1, d2].join("");
  }

  function validateStep1() {
    const e = {};
    if (!form.nome.trim()) e.nome = "Informe seu nome completo";
    if (!form.email.trim()) e.email = "Informe seu e-mail";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "E-mail inválido";
    if (!form.senha) e.senha = "Crie uma senha";
    else if (form.senha.length < 6) e.senha = "Mínimo 6 caracteres";
    if (form.senha !== form.confirmarSenha)
      e.confirmarSenha = "Senhas não coincidem";
    setErrors(e);
    return !Object.keys(e).length;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateStep1() || loading) return;
    setLoading(true);

    try {
      const payload = {
        nome: form.nome.trim(),
        email: form.email.trim(),
        telefone: "11999999999",
        cpf: gerarCpf(),
        data_nasc: "2000-01-01",
        senha: form.senha,
      };

      const res = await fetch(`${API_URL}/clientes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.error === false) {
        await MelfySwal({
          icon: "success",
          title: "Conta criada com sucesso! 🎉",
          text: "Agora é só fazer login para começar a pedir!",
          confirmButtonText: "Fazer login",
        });
        onSwitchToLogin();
      } else {
        setLoading(false);
        await MelfySwal({
          icon: "error",
          title: "Algo deu errado",
          text: data.mensagem || "Verifique os dados e tente novamente.",
          confirmButtonText: "Corrigir",
        });
      }
    } catch {
      setLoading(false);
      await MelfySwal({
        icon: "error",
        title: "Sem conexão",
        text: "Verifique sua internet.",
        confirmButtonText: "OK",
      });
    }
  }

  return (
    <AuthShell mode="cadastro">
      <div className="auth-heading">
        <div className="auth-heading-icon dark">
          <User size={22} />
        </div>
        <div>
          <span className="auth-eyebrow">Comece sua jornada</span>
          <h1>Crie sua conta</h1>
          <p>Primeiro, vamos conhecer você.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="auth-form">
        <Field
          id={`${uid}-nome`}
          label="Nome completo"
          icon={User}
          placeholder="Seu nome"
          value={form.nome}
          onChange={(e) => { upd("nome")(e); clrErr("nome")(); }}
          required
          error={errors.nome}
        />

        <Field
          id={`${uid}-email`}
          label="E-mail"
          icon={Mail}
          type="email"
          placeholder="voce@email.com"
          value={form.email}
          onChange={(e) => { upd("email")(e); clrErr("email")(); }}
          autoComplete="email"
          required
          error={errors.email}
        />

        <div className="auth-grid-2">
          <PasswordField
            id={`${uid}-senha`}
            label="Senha"
            value={form.senha}
            onChange={(e) => { upd("senha")(e); clrErr("senha")(); }}
            autoComplete="new-password"
            error={errors.senha}
            hint="Mínimo 6 caracteres"
          />
          <PasswordField
            id={`${uid}-conf`}
            label="Confirmar senha"
            value={form.confirmarSenha}
            onChange={(e) => { upd("confirmarSenha")(e); clrErr("confirmarSenha")(); }}
            autoComplete="new-password"
            error={errors.confirmarSenha}
          />
        </div>

        <button type="submit" className="auth-primary" disabled={loading}>
          {loading ? (
            <>
              <Loader2 size={17} className="auth-spin" />
              Criando...
            </>
          ) : (
            <>
              Criar minha conta
              <Rocket size={17} />
            </>
          )}
        </button>
      </form>

      <div className="auth-divider">
        <span>ou</span>
      </div>

      <div className="auth-switch">
        <span>Já possui uma conta?</span>
        <button onClick={onSwitchToLogin} type="button">
          Fazer login <ArrowRight size={14} />
        </button>
      </div>
    </AuthShell>
  );
}
