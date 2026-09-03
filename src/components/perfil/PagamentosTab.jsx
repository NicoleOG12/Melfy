import React from "react";

const iconPay = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" />
  </svg>
);
const iconTrash = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);
const iconPlus = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" x2="12" y1="5" y2="19" /><line x1="5" x2="19" y1="12" y2="12" />
  </svg>
);
const iconWallet = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" /><path d="M4 6v12c0 1.1.9 2 2 2h14v-4" /><circle cx="18" cy="12" r="2" />
  </svg>
);

const tipoEmoji = {
  credito: "💳",
  debito: "🏦",
  voucher: "🎟️",
  vale: "🍽️",
};

export default function PagamentosTab({ pagamentos, onRemoverPagamento, onAbrirModal }) {
  return (
    <section className="perfil-content" id="secao-pagamentos">
      <div className="perfil-section-header">
        <div className="perfil-section-icon">{iconPay}</div>
        <div className="perfil-section-title">
          <h2>Formas de Pagamento</h2>
          <p>Gerencie seus cartões e opções de pagamento salvas.</p>
        </div>
      </div>

      <div className="pagamentos-container">
        {pagamentos.length === 0 ? (
          <div className="perfil-empty">
            {iconWallet}
            <p>Nenhuma forma de pagamento cadastrada ainda.</p>
          </div>
        ) : (
          pagamentos.map((item) => (
            <div key={item.id} className="pay-card-item">
              <div className="pay-card-icon">
                {tipoEmoji[item.tipo] || "💳"}
              </div>
              <div className="pay-card-info">
                <h4>
                  {item.subTipo || (
                    item.tipo === "debito" ? "Débito" :
                    item.tipo === "voucher" ? "Voucher" :
                    item.tipo === "vale" ? "Vale Refeição" : "Crédito"
                  )}{" "}
                  •••• {item.ultimosDigitos}
                </h4>
                <p>{item.titular} · Validade: {item.validade}</p>
              </div>
              <button
                type="button"
                className="btn-excluir-item"
                onClick={() => onRemoverPagamento(item.id)}
              >
                {iconTrash}
                Excluir
              </button>
            </div>
          ))
        )}
      </div>

      <button className="perfil-btn-add" onClick={onAbrirModal}>
        {iconPlus}
        Adicionar forma de pagamento
      </button>
    </section>
  );
}
