import React from "react";
import { formatarCartao, formatarValidade } from "../../utils/masks";

export default function ModalPagamento({
  isOpen,
  onClose,
  onSave,
  tipoPagamento,
  setTipoPagamento,
  subBadge,
  setSubBadge,
  numCartao,
  setNumCartao,
  valCartao,
  setValCartao,
  cvvCartao,
  setCvvCartao,
  titularCartao,
  setTitularCartao,
}) {
  if (!isOpen) return null;

  return (
    <div
      id="modal-pagamento"
      className="pay-modal-overlay"
      style={{ display: "flex" }}
      onClick={onClose}
    >
      <div className="pay-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="pay-modal-header">
          <div>
            <h2>Nova Forma de Pagamento</h2>
            <p className="pay-modal-subtitle">
              Escolha como você prefere pagar suas encomendas
            </p>
          </div>
          <button className="pay-fechar-modal" type="button" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="pay-modal-body">
          <label className="pay-modal-label">
            Selecione o formato principal:
          </label>
          <div
            className="pay-type-grid"
            style={{ gridTemplateColumns: "repeat(2, 1fr)" }}
          >
            <div
              className={`pay-option ${
                tipoPagamento === "credito" ? "active" : ""
              }`}
              onClick={() => setTipoPagamento("credito")}
            >
              <i className="fa-regular fa-credit-card"></i>
              <span>Crédito</span>
            </div>
            <div
              className={`pay-option ${
                tipoPagamento === "debito" ? "active" : ""
              }`}
              onClick={() => setTipoPagamento("debito")}
            >
              <i className="fa-solid fa-money-check-dollar"></i>
              <span>Débito</span>
            </div>
            <div
              className={`pay-option ${
                tipoPagamento === "voucher" ? "active" : ""
              }`}
              onClick={() => setTipoPagamento("voucher")}
            >
              <i className="fa-solid fa-gift"></i>
              <span>Voucher</span>
            </div>
            <div
              className={`pay-option ${
                tipoPagamento === "vale" ? "active" : ""
              }`}
              onClick={() => setTipoPagamento("vale")}
            >
              <i className="fa-solid fa-utensils"></i>
              <span>Vale Refeição</span>
            </div>
          </div>

          {tipoPagamento === "voucher" && (
            <div
              id="sub-opcoes-voucher"
              className="pay-animation-wrapper"
              style={{ marginBottom: "20px" }}
            >
              <label className="pay-modal-label">Selecione o seu Voucher:</label>
              <div className="pay-sub-badges">
                {["Caju", "Flash", "Swile", "Outro"].map((b) => (
                  <span
                    key={b}
                    className={`pay-sub-badge ${
                      subBadge === b ? "active" : ""
                    }`}
                    onClick={() => setSubBadge(b)}
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          )}

          {tipoPagamento === "vale" && (
            <div
              id="sub-opcoes-vale"
              className="pay-animation-wrapper"
              style={{ marginBottom: "20px" }}
            >
              <label className="pay-modal-label">
                Selecione a Operadora do Benefício:
              </label>
              <div className="pay-sub-badges">
                {["Pluxee", "Alelo", "Sodexo", "Ticket", "VR"].map((b) => (
                  <span
                    key={b}
                    className={`pay-sub-badge ${
                      subBadge === b ? "active" : ""
                    }`}
                    onClick={() => setSubBadge(b)}
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="pay-divider"></div>

          <div id="campos-gerais-cartao" className="pay-animation-wrapper">
            <div className="pay-dados-card">
              <label>Número do Cartão ou Benefício</label>
              <div className="pay-input-icon">
                <i className="fa-regular fa-credit-card"></i>
                <input
                  type="text"
                  id="numero-cartao-modal"
                  placeholder="0000 0000 0000 0000"
                  value={numCartao}
                  onChange={(e) =>
                    setNumCartao(formatarCartao(e.target.value))
                  }
                />
              </div>
            </div>
            <div className="pay-grid-2-col">
              <div className="pay-dados-card">
                <label>Validade</label>
                <input
                  type="text"
                  id="validade-cartao-modal"
                  placeholder="MM/AA"
                  value={valCartao}
                  onChange={(e) =>
                    setValCartao(formatarValidade(e.target.value))
                  }
                />
              </div>
              <div className="pay-dados-card">
                <label>CVV</label>
                <input
                  type="text"
                  id="cvv-cartao-modal"
                  placeholder="123"
                  value={cvvCartao}
                  onChange={(e) =>
                    setCvvCartao(
                      e.target.value.replace(/\D/g, "").substring(0, 4)
                    )
                  }
                />
              </div>
            </div>
            <div className="pay-dados-card">
              <label>Nome Impresso (Titular)</label>
              <div className="pay-input-icon">
                <i className="fa-regular fa-user"></i>
                <input
                  type="text"
                  id="titular-cartao-modal"
                  placeholder="Nome como no cartão"
                  value={titularCartao}
                  onChange={(e) => setTitularCartao(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pay-modal-footer">
          <button className="pay-btn-cancelar" type="button" onClick={onClose}>
            Cancelar
          </button>
          <button className="pay-btn-salvar" type="button" onClick={onSave}>
            Adicionar Forma
          </button>
        </div>
      </div>
    </div>
  );
}
