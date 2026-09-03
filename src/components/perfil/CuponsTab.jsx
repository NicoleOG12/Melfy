import React from "react";

const iconCopy = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="14" height="14" x="8" y="8" rx="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);
const iconTag = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2H2v10l9.29 9.29a1 1 0 0 0 1.41 0l7.29-7.29a1 1 0 0 0 0-1.41z" /><circle cx="7" cy="7" r="1.5" fill="currentColor" />
  </svg>
);

const cupons = [
  {
    codigo: "MELFY10",
    descricao: "10% OFF no seu primeiro pedido.",
    tipo: "Desconto",
    validade: "31/12/2025",
  },
  {
    codigo: "DOCESEMCASA",
    descricao: "Frete grátis em compras acima de R$ 60.",
    tipo: "Frete",
    validade: "30/06/2025",
  },
];

export default function CuponsTab({ onCopiarCupom }) {
  return (
    <section className="perfil-content">
      <div className="perfil-section-header">
        <div className="perfil-section-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
            <path d="M13 5v2" /><path d="M13 17v2" /><path d="M13 11v2" />
          </svg>
        </div>
        <div className="perfil-section-title">
          <h2>Meus Cupons</h2>
          <p>Cupons disponíveis para suas próximas encomendas.</p>
        </div>
      </div>

      <div className="cupons-grid">
        {cupons.map(({ codigo, descricao, tipo, validade }) => (
          <div key={codigo} className="cupom-card">
            <div className="cupom-top">
              <span className="cupom-badge">
                {iconTag}
                {tipo}
              </span>
              <span style={{ fontSize: "11px", color: "var(--muted)", fontWeight: 600 }}>
                Válido até {validade}
              </span>
            </div>

            <div className="cupom-code">{codigo}</div>
            <p className="cupom-desc">{descricao}</p>

            <button className="cupom-btn" onClick={() => onCopiarCupom(codigo)}>
              {iconCopy}
              Copiar código
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
