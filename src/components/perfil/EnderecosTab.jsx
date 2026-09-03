import React from "react";

export default function EnderecosTab({
  enderecos,
  onRemoverEndereco,
  onAbrirModal,
}) {
  return (
    <section className="perfil-content" id="secao-enderecos">
      <div className="dados-header">
        <h1 id="title-meus-dados">Meus Endereços</h1>
        <p className="descricao-dados">Gerencie seus endereços de entrega.</p>
      </div>

      <div id="lista-enderecos" className="lista-enderecos">
        {enderecos.length === 0 ? (
          <div className="empty-state-pagamento">
            <i className="fa-solid fa-location-dot"></i>
            <p>Você ainda não possui endereços cadastrados.</p>
          </div>
        ) : (
          enderecos.map((item) => (
            <div key={item.id} className="endereco-card-item">
              <div>
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
                Excluir
              </button>
            </div>
          ))
        )}
      </div>

      <div className="buttons" style={{ textAlign: "center", marginTop: "30px" }}>
        <button id="btn-adicionar-endereco" onClick={onAbrirModal}>
          + Adicionar endereço
        </button>
      </div>
    </section>
  );
}
