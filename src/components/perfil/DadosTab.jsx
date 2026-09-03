import React from "react";
import { formatarCPF, formatarCelular } from "../../utils/masks";

/* ── ícones inline ── */
const IcoUser = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const IcoMail = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);
const IcoPhone = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.08 3.41 2 2 0 0 1 3 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16z"/>
  </svg>
);
const IcoCard = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>
  </svg>
);
const IcoCal = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
  </svg>
);
const IcoEdit = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const IcoSave = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
    <polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
  </svg>
);
const IcoCancel = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const IcoShield = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

/* ── campo individual ── */
function Field({ id, label, icon, value, onChange, type = "text", placeholder, disabled, hint }) {
  return (
    <div className={`dados-field${disabled ? "" : " dados-field--active"}`}>
      <label htmlFor={id} className="dados-field-label">
        <span className="dados-field-icon">{icon}</span>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value || ""}
        onChange={onChange}
        disabled={disabled}
        placeholder={disabled ? "—" : (placeholder || "")}
        className="dados-field-input"
        autoComplete="off"
      />
      {hint && !disabled && <span className="dados-field-hint">{hint}</span>}
    </div>
  );
}

export default function DadosTab({
  isEditing,
  nome, setNome,
  sobrenome, setSobrenome,
  cpf, setCpf,
  dataNascimento, setDataNascimento,
  email, setEmail,
  celular, setCelular,
  foto, setFoto,
  onToggleEdicao,
}) {
  const nomeCompleto = `${nome || ""} ${sobrenome || ""}`.trim() || "Usuário";
  const fotoSrc = foto || "/assents/img/Geral/Perfil.png";

  function handleFotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setFoto(ev.target.result);
    reader.readAsDataURL(file);
  }

  return (
    <section className="perfil-content dados-section" id="secao-dados">

      {/* ── Banner / Hero ── */}
      <div className="dados-hero">
        <div className="dados-hero-bg" aria-hidden="true" />

        {/* avatar com overlay de câmera no modo edição */}
        <div className="dados-hero-avatar-wrap">
          <img
            src={fotoSrc}
            alt={nomeCompleto}
            className="dados-hero-avatar-img"
            onError={e => { e.currentTarget.src = "/assents/img/Geral/Perfil.png"; }}
          />
          {isEditing && (
            <label className="dados-avatar-overlay" title="Alterar foto">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
              <span>Alterar</span>
              <input
                type="file"
                accept="image/*"
                className="dados-avatar-file"
                onChange={handleFotoChange}
              />
            </label>
          )}
        </div>

        <div className="dados-hero-info">
          <h2>{nomeCompleto}</h2>
          {email && <p className="dados-hero-email">{email}</p>}
          <span className="dados-hero-badge">
            <IcoShield />
            Conta verificada
          </span>
        </div>

        <button
          className={`dados-edit-btn${isEditing ? " dados-edit-btn--active" : ""}`}
          onClick={onToggleEdicao}
          type="button"
        >
          {isEditing ? <><IcoSave /> Salvar</> : <><IcoEdit /> Editar</>}
        </button>
      </div>

      {/* ── Faixa de modo edição ── */}
      {isEditing && (
        <div className="dados-editing-bar">
          <span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            Modo edição ativo — altere os campos e clique em Salvar.
          </span>
          <button type="button" className="dados-cancel-btn" onClick={onToggleEdicao}>
            <IcoCancel /> Cancelar
          </button>
        </div>
      )}

      {/* ── Grupo: Identidade ── */}
      <div className="dados-group">
        <div className="dados-group-header">
          <IcoUser />
          Identidade
        </div>
        <div className="dados-grid-2">
          <Field id="nome-input"      label="Nome"      icon={<IcoUser />} value={nome}      onChange={e => setNome(e.target.value)}      disabled={!isEditing} />
          <Field id="sobrenome-input" label="Sobrenome" icon={<IcoUser />} value={sobrenome} onChange={e => setSobrenome(e.target.value)} disabled={!isEditing} />
          <Field id="cpf-input"       label="CPF"       icon={<IcoCard />} value={cpf}       onChange={e => setCpf(formatarCPF(e.target.value))}    disabled={!isEditing} hint="Somente números" />
          <Field id="data-input"      label="Data de Nascimento" icon={<IcoCal />} value={dataNascimento} onChange={e => setDataNascimento(e.target.value)} disabled={!isEditing} placeholder="DD/MM/AAAA" />
        </div>
      </div>

      {/* ── Grupo: Contato ── */}
      <div className="dados-group">
        <div className="dados-group-header">
          <IcoMail />
          Contato
        </div>
        <div className="dados-grid-2">
          <Field id="email-input"  label="E-mail"  icon={<IcoMail />}  value={email}  onChange={e => setEmail(e.target.value)}                         disabled={!isEditing} type="email" />
          <Field id="celular-input" label="Celular" icon={<IcoPhone />} value={celular} onChange={e => setCelular(formatarCelular(e.target.value))} disabled={!isEditing} type="tel"   hint="Com DDD" />
        </div>
      </div>

      {/* ── Ações ── */}
      {isEditing && (
        <div className="dados-actions">
          <button className="perfil-btn-primary saving" onClick={onToggleEdicao} type="button">
            <IcoSave />
            Salvar alterações
          </button>
          <button className="perfil-btn-ghost" onClick={onToggleEdicao} type="button">
            <IcoCancel />
            Cancelar
          </button>
        </div>
      )}

    </section>
  );
}
