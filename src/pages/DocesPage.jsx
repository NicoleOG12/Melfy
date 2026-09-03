import React, { useState, useEffect, useRef } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import SearchBar from "../components/home/SearchBar";
import CarrosselHex from "../components/doces/CarrosselHex";
import LojasSection from "../components/home/LojasSection";
import ProductModal from "../components/doces/ProductModal";
import CardProduto from "../components/doces/CardProduto";
import { fetchProdutos, fetchLojas } from "../services/api";
import { DOCES_QUERIDINHOS, CATEGORIAS } from "../constants/categories";
import { normalizar } from "../utils/formatters";
import "../styles/cliente/doces.css";

function embaralhar(lista) {
  return lista
    .map((x) => ({ x, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map((o) => o.x);
}

function ordenarProdutos(lista) {
  const sorted = [...lista].sort(
    (a, b) => new Date(a.datahora) - new Date(b.datahora)
  );
  const antigos = sorted.slice(0, 45);
  const novos = sorted.slice(45).sort(
    (a, b) => new Date(b.datahora) - new Date(a.datahora)
  );
  return [...embaralhar(antigos), ...novos];
}

export default function DocesPage() {
  const [lojas, setLojas] = useState([]);
  const [produtosOrdenados, setProdutosOrdenados] = useState([]);
  const [produtosFiltrados, setProdutosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalProd, setModalProd] = useState(null);
  const [busca, setBusca] = useState("");
  const cardsRef = useRef(null);

  useEffect(() => {
    Promise.all([fetchProdutos(), fetchLojas()])
      .then(([ps, ls]) => {
        const ordenados = ordenarProdutos(ps);
        setLojas(ls);
        setProdutosOrdenados(ordenados);
        setProdutosFiltrados(ordenados);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  function filtrar(termo) {
    const t = normalizar(termo).trim();
    if (!t) return produtosOrdenados;
    const palavras = t.split(" ");
    return produtosOrdenados.filter((p) => {
      const txt = normalizar((p.nome || "") + " " + (p.descricao || ""));
      return palavras.every((w) => txt.includes(w));
    });
  }

  function scrollSuave() {
    const el = cardsRef.current;
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.pageYOffset - 120;
    window.scrollTo({ top: y, behavior: "smooth" });
  }

  function executarBusca(termo = busca) {
    setProdutosFiltrados(filtrar(termo));
    scrollSuave();
  }

  function handleCategoria(nome) {
    setBusca(nome);
    executarBusca(nome);
  }

  return (
    <>
      <Header />

      <main style={{ paddingTop: "80px" }}>
        <SearchBar
          value={busca}
          onChange={setBusca}
          onSearch={() => executarBusca()}
        />

        <CarrosselHex
          titulo="Doces Queridinhos"
          itens={DOCES_QUERIDINHOS}
          isCategoria={false}
          onItemClick={handleCategoria}
        />

        <CarrosselHex
          titulo="Categoria"
          itens={CATEGORIAS}
          isCategoria={true}
          onItemClick={handleCategoria}
        />

        <LojasSection lojas={lojas} />

        <button
          type="button"
          className="btn-ver-todos"
          onClick={() => {
            setBusca("");
            setProdutosFiltrados(produtosOrdenados);
            scrollSuave();
          }}
        >
          <span>Ver todos</span>
          <i className="fas fa-list" />
        </button>

        <section className="cards-wrapper" ref={cardsRef}>
          {loading && (
            <p className="text-center w-full py-8">Carregando produtos…</p>
          )}
          {!loading && produtosFiltrados.length === 0 && (
            <p className="text-center w-full py-8">Nenhum produto encontrado.</p>
          )}
          {!loading &&
            [...produtosFiltrados].reverse().map((p) => (
              <CardProduto
                key={p.id_produto}
                produto={p}
                onCardClick={setModalProd}
              />
            ))}
        </section>
      </main>

      <ProductModal
        produto={modalProd}
        lojas={lojas}
        onClose={() => setModalProd(null)}
      />

      <Footer />
    </>
  );
}
