import React from "react";

export default function HistoricoTab() {
  return (
    <section className="perfil-content">
      <div className="dados-header">
        <h1 id="title-meus-dados">Histórico de Compras</h1>
        <p className="descricao-dados">
          Consulte seus pedidos anteriores e compre novamente.
        </p>
      </div>
      <div style={{ textAlign: "center", padding: "40px 20px" }}>
        <i
          className="fa-solid fa-bag-shopping"
          style={{
            fontSize: "40px",
            color: "var(--accent-yellow-3, #e8af2c)",
            marginBottom: "15px",
          }}
        />
        <p style={{ color: "var(--brown)", fontWeight: "700" }}>
          Acesse sua página completa de pedidos:
        </p>
        <div className="buttons" style={{ marginTop: "15px" }}>
          <a href="/pedidos">
            <button style={{ cursor: "pointer" }}>Ir para Meus Pedidos</button>
          </a>
        </div>
      </div>
    </section>
  );
}
