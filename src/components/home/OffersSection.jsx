import React, { useState, useEffect } from "react";
import { fetchProdutos } from "../../services/api";
import { getPrecoProduto } from "../../utils/formatters";
import ProductModal from "../doces/ProductModal";
import CardProduto from "../doces/CardProduto";

export default function OffersSection() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalProd, setModalProd] = useState(null);

  useEffect(() => {
    fetchProdutos()
      .then((ps) => setProdutos(ps.filter((p) => getPrecoProduto(p).temOferta)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (!loading && produtos.length === 0) return null;

  const cards = loading ? (
    <p className="text-center w-full py-8">Carregando ofertas…</p>
  ) : (
    produtos.map((p) => (
      <CardProduto key={p.id_produto} produto={p} onCardClick={setModalProd} variant="home" />
    ))
  );

  return (
    <>
      <section className="pb-16 pt-16 bg-mellow-yellow-100" id="ofertas">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-cosy-brown-700">
              <span className="font-nunito text-5xl md:text-6xl">Ofertas</span>{" "}
              <br />imperdíveis
            </h2>
            <p className="text-xl text-cosy-brown-600 max-w-2xl mx-auto">
              Aproveite os doces com preço especial
            </p>
          </div>

          {/* Carrossel mobile */}
          <div className="carousel-container md:hidden">
            <div className="carousel-track">{cards}</div>
          </div>

          {/* Grid desktop */}
          <div className="hidden md:flex cards-wrapper-home">{cards}</div>
        </div>
      </section>

      {modalProd && (
        <ProductModal produto={modalProd} onClose={() => setModalProd(null)} />
      )}
    </>
  );
}
