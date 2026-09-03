import React, { useMemo } from "react";
import CardProduto from "../doces/CardProduto";

export default function RecommendationCards({ produtos, lojas, onOpenProduct }) {
  const limite = window.innerWidth < 1367 ? 4 : 5;

  const recomendados = useMemo(
    () => produtos.slice().sort(() => 0.5 - Math.random()).slice(0, limite),
    [produtos, limite]
  );

  return (
    <div className="cards-wrapper">
      {recomendados.map((produto) => (
        <CardProduto
          key={produto.id_produto ?? produto.nome}
          produto={produto}
          onCardClick={onOpenProduct}
        />
      ))}
    </div>
  );
}
