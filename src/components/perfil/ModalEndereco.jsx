import React from "react";
import { formatarCEP } from "../../utils/masks";

export default function ModalEndereco({
  isOpen,
  onClose,
  onSave,
  form,
  setForm,
  onBuscarCep,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="perfil-modal-overlay"
      id="modal-endereco"
      onClick={onClose}
    >
      <div className="modal-endereco" onClick={(e) => e.stopPropagation()}>
        <h2>Novo endereço</h2>

        <div className="dados-grid">
          <div className="dados-card">
            <label>CEP</label>
            <input
              type="text"
              id="cep-input"
              placeholder="00000-000"
              value={form.cep}
              onChange={(e) => {
                const val = formatarCEP(e.target.value);
                setForm((prev) => ({ ...prev, cep: val }));
                if (val.replace(/\D/g, "").length === 8) {
                  onBuscarCep(val);
                }
              }}
              onBlur={(e) => onBuscarCep(e.target.value)}
            />
          </div>

          <div className="dados-card">
            <label>Rua / Logradouro</label>
            <input
              type="text"
              id="rua-input"
              value={form.rua}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, rua: e.target.value }))
              }
            />
          </div>

          <div className="dados-card">
            <label>Número</label>
            <input
              type="text"
              id="numero-input"
              value={form.numero}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, numero: e.target.value }))
              }
            />
          </div>

          <div className="dados-card">
            <label>Complemento</label>
            <input
              type="text"
              id="complemento-input"
              value={form.complemento}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, complemento: e.target.value }))
              }
            />
          </div>

          <div className="dados-card">
            <label>Bairro</label>
            <input
              type="text"
              id="bairro-input"
              value={form.bairro}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, bairro: e.target.value }))
              }
            />
          </div>

          <div className="dados-card">
            <label>Cidade / Estado</label>
            <input
              type="text"
              id="cidade-input"
              value={form.cidade}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, cidade: e.target.value }))
              }
            />
          </div>
        </div>

        <div className="modal-buttons">
          <button id="fechar-modal" type="button" onClick={onClose}>
            Cancelar
          </button>
          <button id="salvar-endereco" type="button" onClick={onSave}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
