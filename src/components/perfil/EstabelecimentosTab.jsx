import React from "react";

export default function EstabelecimentosTab() {
  return (
    <section className="perfil-content">
      <div className="dados-header">
        <h1 id="title-meus-dados">Meus Estabelecimentos</h1>
        <p className="descricao-dados">
          Lojas e confeitarias artesanais parceiras.
        </p>
      </div>
      <div style={{ textAlign: "center", padding: "40px 20px" }}>
        <i
          className="fa-solid fa-store"
          style={{
            fontSize: "40px",
            color: "var(--accent-yellow-3, #e8af2c)",
            marginBottom: "15px",
          }}
        />
        <p style={{ color: "var(--brown)", fontWeight: "700" }}>
          Explore doces deliciosos e confeitarias:
        </p>
        <div className="buttons" style={{ marginTop: "15px" }}>
          <a href="/doces">
            <button style={{ cursor: "pointer" }}>Ver Lojas e Doces</button>
          </a>
        </div>
      </div>
    </section>
  );
}
