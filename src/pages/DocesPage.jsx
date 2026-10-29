import React, { useState, useEffect, useRef } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import SearchBar from "../components/home/SearchBar";
import CarrosselHex from "../components/doces/CarrosselHex";
import LojasSection from "../components/home/LojasSection";
import ProductModal from "../components/doces/ProductModal";
import CardProduto from "../components/doces/CardProduto";
import { fetchProdutos } from "../services/api";
import { useLojasMaisProximas } from "../hooks/useLojasMaisProximas";
import { DOCES_QUERIDINHOS, CATEGORIAS } from "../constants/categories";
import { normalizar } from "../utils/formatters";
import "../styles/cliente/doces.css";

function embaralhar(lista) {
  return lista
    .map((x) => ({ x, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map((o) => o.x);
}

function rearranjarSemLojasConsecutivas(produtos) {
  if (produtos.length <= 1) return produtos;

  const getStoreId = (p) => p.id_loja || p.idLoja || p.loja?.id_loja || p.loja?.id || "unknown";

  // Agrupa produtos por ID de loja
  const grupos = {};
  for (const p of produtos) {
    const sId = getStoreId(p);
    if (!grupos[sId]) {
      grupos[sId] = [];
    }
    grupos[sId].push(p);
  }

  // Lista de lojas com seus produtos
  const lojasList = Object.keys(grupos).map((sId) => ({
    id: sId,
    items: grupos[sId],
  }));

  const resultado = [];
  let ultimoLojaId = null;

  while (true) {
    // Ordena as lojas pela quantidade de produtos restantes (decrescente)
    lojasList.sort((a, b) => b.items.length - a.items.length);

    // Encontra a primeira loja com produtos que não seja a última utilizada
    let indexEscolhido = -1;
    for (let i = 0; i < lojasList.length; i++) {
      if (lojasList[i].items.length > 0 && lojasList[i].id !== ultimoLojaId) {
        indexEscolhido = i;
        break;
      }
    }

    // Se nenhuma loja for elegível (só restaram produtos da última loja utilizada)
    if (indexEscolhido === -1) {
      const restante = lojasList.find((l) => l.items.length > 0);
      if (restante) {
        resultado.push(...restante.items);
        restante.items = [];
      }
      break;
    }

    const lojaEscolhida = lojasList[indexEscolhido];
    const produto = lojaEscolhida.items.shift();
    resultado.push(produto);
    ultimoLojaId = lojaEscolhida.id;
  }

  return resultado;
}

function ordenarProdutos(lista) {
  const sorted = [...lista].sort(
    (a, b) => new Date(b.datahora) - new Date(a.datahora)
  );
  const novos = sorted.slice(0, 10);
  const restantes = embaralhar(sorted.slice(10));

  const novosRearranjados = rearranjarSemLojasConsecutivas(novos);
  const restantesRearranjados = rearranjarSemLojasConsecutivas(restantes);

  const resultado = [...novosRearranjados, ...restantesRearranjados];

  // Trata a colisão de borda entre o último doce do grupo "novos" e o primeiro do grupo "restantes"
  const getStoreId = (p) => p.id_loja || p.idLoja || p.loja?.id_loja || p.loja?.id || "unknown";

  if (novosRearranjados.length > 0 && restantesRearranjados.length > 0) {
    const idxBordaNovos = novosRearranjados.length - 1;
    const idxBordaRestantes = novosRearranjados.length;

    if (getStoreId(resultado[idxBordaNovos]) === getStoreId(resultado[idxBordaRestantes])) {
      // Procura o próximo doce subsequente de outra loja para permutar com o elemento colidido na borda
      for (let i = idxBordaRestantes + 1; i < resultado.length; i++) {
        if (getStoreId(resultado[i]) !== getStoreId(resultado[idxBordaNovos])) {
          const temp = resultado[idxBordaRestantes];
          resultado[idxBordaRestantes] = resultado[i];
          resultado[i] = temp;
          break;
        }
      }
    }
  }

  return resultado;
}

export default function DocesPage() {
  const { lojas, loading: loadingDist, locationDenied } = useLojasMaisProximas();
  const [produtosOrdenados, setProdutosOrdenados] = useState([]);
  const [produtosFiltrados, setProdutosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalProd, setModalProd] = useState(null);
  const [busca, setBusca] = useState("");
  const cardsRef = useRef(null);

  useEffect(() => {
    fetchProdutos()
      .then((ps) => {
        const ordenados = ordenarProdutos(ps);
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
    const filtrados = produtosOrdenados.filter((p) => {
      const txt = normalizar((p.nome || "") + " " + (p.descricao || ""));
      return palavras.every((w) => txt.includes(w));
    });
    return rearranjarSemLojasConsecutivas(filtrados);
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

        <LojasSection lojas={lojas} loadingDist={loadingDist} locationDenied={locationDenied} />

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
            produtosFiltrados.map((p) => (
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
        onClose={() => setModalProd(null)}
      />

      <Footer />
    </>
  );
}
