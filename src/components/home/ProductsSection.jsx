import React, { useState, useEffect, useRef } from "react";
import { fetchProdutos, fetchLojas } from "../../services/api";
import ProductModal from "../doces/ProductModal";
import CardProduto from "../doces/CardProduto";

export default function ProductsSection() {
  const [produtos,  setProdutos]  = useState([]);
  const [lojas,     setLojas]     = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [modalProd, setModalProd] = useState(null);

  const carouselRef = useRef(null);
  const dragging    = useRef(false);
  const startX      = useRef(0);
  const scrollLeft  = useRef(0);

  useEffect(() => {
    Promise.all([fetchLojas(), fetchProdutos()])
      .then(([ls, ps]) => {
        setLojas(ls);
        setProdutos(ps.slice(0, 4));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const down  = (e) => { dragging.current = true;  startX.current = e.pageX - el.offsetLeft; scrollLeft.current = el.scrollLeft; };
    const leave = ()  => { dragging.current = false; };
    const up    = ()  => { dragging.current = false; };
    const move  = (e) => { if (!dragging.current) return; e.preventDefault(); el.scrollLeft = scrollLeft.current - (e.pageX - el.offsetLeft - startX.current) * 2; };
    const tdown = (e) => { dragging.current = true;  startX.current = e.touches[0].pageX - el.offsetLeft; scrollLeft.current = el.scrollLeft; };
    const tmove = (e) => { if (!dragging.current) return; el.scrollLeft = scrollLeft.current - (e.touches[0].pageX - el.offsetLeft - startX.current) * 2; };
    el.addEventListener("mousedown",  down);
    el.addEventListener("mouseleave", leave);
    el.addEventListener("mouseup",    up);
    el.addEventListener("mousemove",  move);
    el.addEventListener("touchstart", tdown);
    el.addEventListener("touchend",   up);
    el.addEventListener("touchmove",  tmove);
    return () => {
      el.removeEventListener("mousedown",  down);
      el.removeEventListener("mouseleave", leave);
      el.removeEventListener("mouseup",    up);
      el.removeEventListener("mousemove",  move);
      el.removeEventListener("touchstart", tdown);
      el.removeEventListener("touchend",   up);
      el.removeEventListener("touchmove",  tmove);
    };
  }, []);

  const cards = loading
    ? <p className="text-center w-full py-8">Carregando produtos…</p>
    : produtos.length === 0
      ? <p className="text-center w-full py-8">Nenhum produto encontrado.</p>
      : produtos.map((p) => (
          <CardProduto key={p.id_produto} produto={p} onCardClick={setModalProd} variant="home" />
        ));

  return (
    <>
      <section className="min-h-screen py-16 bg-cosy-brown-200 relative" id="products">
        <img
          src="/assents/img/Home/chocolate-wave-2.svg"
          alt="chocolate wave"
          className="absolute top-0 w-full"
        />
        <div className="container mx-auto mt-12 px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-cosy-brown-700">
              <span className="font-nunito text-5xl md:text-6xl">Nossos doces</span>{" "}
              <br />mais populares
            </h2>
            <p className="text-xl text-cosy-brown-600 max-w-2xl mx-auto">
              Descubra os doces que estão encantando nossos clientes
            </p>
          </div>

          {/* Carrossel mobile */}
          <div className="carousel-container md:hidden" ref={carouselRef}>
            <div className="carousel-track">{cards}</div>
          </div>

          {/* Grid desktop */}
          <div className="hidden md:flex cards-wrapper-home">{cards}</div>

          <div className="text-center mt-12">
            <a
              href="/doces"
              className="inline-block px-8 py-3 bg-mellow-yellow-400 hover:bg-mellow-yellow-500 text-cosy-brown-700 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              Ver todos os doces <i className="fas fa-arrow-right ml-2"></i>
            </a>
          </div>
        </div>
      </section>

      {modalProd && (
        <ProductModal
          produto={modalProd}
          lojas={lojas}
          onClose={() => setModalProd(null)}
        />
      )}
    </>
  );
}
