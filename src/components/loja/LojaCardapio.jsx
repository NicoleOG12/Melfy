import React, { useState } from "react";
import CardProduto from "../doces/CardProduto";

export default function LojaCardapio({ nomeLoja, produtos, loading, erro, onCardClick }) {
  const [busca, setBusca]                   = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");

  const categorias = ["Todos", ...Array.from(
    new Set(produtos.flatMap((p) => p.categorias ?? []))
  )];

  const filtrados = produtos.filter((p) => {
    const txt    = (p.nome + " " + (p.descricao ?? "")).toLowerCase();
    const matchB = !busca || txt.includes(busca.toLowerCase());
    const matchC = categoriaAtiva === "Todos" || (p.categorias ?? []).includes(categoriaAtiva);
    return matchB && matchC;
  });

  return (
    <>
      <div className="loja-busca-wrap">
        <i className="fas fa-search loja-busca-ico" />
        <input
          type="text"
          className="loja-busca-input"
          placeholder={`Buscar em ${nomeLoja}…`}
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        {busca && (
          <button type="button" className="loja-busca-clear" onClick={() => setBusca("")}>
            <i className="fas fa-times" />
          </button>
        )}
      </div>

      {categorias.length > 1 && (
        <div className="loja-cats">
          {categorias.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`loja-cat-chip${categoriaAtiva === cat ? " ativo" : ""}`}
              onClick={() => setCategoriaAtiva(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <div className="loja-section-header">
        <h2 className="loja-section-titulo">
          {categoriaAtiva === "Todos" ? "Cardápio completo" : categoriaAtiva}
        </h2>
        {!loading && (
          <span className="loja-section-badge">
            {filtrados.length} {filtrados.length === 1 ? "item" : "itens"}
          </span>
        )}
      </div>

      {loading && <p className="loja-msg">Carregando produtos…</p>}
      {!loading && erro && <p className="loja-msg loja-msg-erro">{erro}</p>}
      {!loading && !erro && filtrados.length === 0 && (
        <p className="loja-msg">Nenhum produto encontrado.</p>
      )}

      {!loading && !erro && filtrados.length > 0 && (
        <div className="cards-wrapper loja-cards-grid">
          {filtrados.map((p) => (
            <CardProduto
              key={p.id_produto ?? p.id}
              produto={p}
              onCardClick={onCardClick}
              hideLojaLogo
            />
          ))}
        </div>
      )}
    </>
  );
}
