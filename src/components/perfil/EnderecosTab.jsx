import React from "react";

const iconPin = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
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

export default function EnderecosTab({
  enderecos,
  onRemoverEndereco,
  onAbrirModal,
}) {
  return (
    <section className="perfil-content" id="secao-enderecos">
      <div className="perfil-section-header">
        <div className="perfil-section-icon">{iconPin}</div>
        <div className="perfil-section-title">
          <h2>Meus Endereços</h2>
          <p>Gerencie seus endereços de entrega.</p>
        </div>
      </div>

      <div id="lista-enderecos" className="pagamentos-container">
        {enderecos.length === 0 ? (
          <div className="perfil-empty">
            {iconPin}
            <p>Você ainda não possui endereços cadastrados.</p>
          </div>
        ) : (
          enderecos.map((item) => (
            <div key={item.id} className="pay-card-item">
              <div className="pay-card-icon">📍</div>
              <div className="pay-card-info">
                <h4>
                  {item.rua}, {item.numero}{" "}
                  {item.complemento ? `(${item.complemento})` : ""}
                </h4>
                <p>
                  {item.bairro} - {item.cidade} • CEP: {item.cep}
                </p>
              </div>
              <button
                type="button"
                className="btn-excluir-item"
                onClick={() => onRemoverEndereco(item.id)}
              >
                {iconTrash}
                Excluir
              </button>
            </div>
          ))
        )}
      </div>

      <button
        type="button"
        id="btn-adicionar-endereco"
        className="perfil-btn-add"
        onClick={onAbrirModal}
      >
        {iconPlus}
        Adicionar endereço
      </button>
    </section>
  );
}
