import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ProductModal from "../components/doces/ProductModal";
import AnimacaoCarrinho from "../components/carrinho/AnimacaoCarrinho";
import CartTable from "../components/carrinho/CartTable";
import CartSummary from "../components/carrinho/CartSummary";
import CheckoutModal from "../components/carrinho/CheckoutModal";
import RecommendationCards from "../components/carrinho/RecommendationCards";
import { fetchCarrinho, fetchProdutos, fetchLojas, adicionarAoCarrinho, removerDoCarrinho, criarPedido } from "../services/api";
import MelfySwal from "../services/melfySwal";
import "../styles/carrinho.css";
import "../styles/cliente/modal.css";

export default function CarrinhoPage() {
  const navigate = useNavigate();
  const [sacola, setSacola] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [lojas, setLojas] = useState([]);
  const [selecionados, setSelecionados] = useState(new Set());
  const [checkoutAberto, setCheckoutAberto] = useState(false);
  const [produtoModal, setProdutoModal] = useState(null);
  const [animacaoSacola, setAnimacaoSacola] = useState(null);
  const [animacaoVisivel, setAnimacaoVisivel] = useState(false);

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      const token = localStorage.getItem("tokenCliente");
      if (!token) return;

      try {
        const [carrinho, ps, ls] = await Promise.all([
          fetchCarrinho(token),
          fetchProdutos(),
          fetchLojas(),
        ]);

        if (!ativo) return;

        const dados = Array.isArray(carrinho) ? carrinho : [];
        const dadosValidos = dados.filter((item) => {
          const qtd = Number.parseInt(item.quantidade ?? item.qtd ?? 0, 10);
          return qtd > 0;
        });
        setSacola(dadosValidos);
        localStorage.setItem("Sacola", JSON.stringify(dadosValidos));
        setSelecionados(new Set(dadosValidos.map((_, index) => index)));
        setProdutos(ps);
        setLojas(ls);
      } catch (err) {
        console.error("Erro ao carregar carrinho:", err);
      }
    }

    carregar();
    return () => { ativo = false; };
  }, []);

  const subtotal = useMemo(
    () =>
      sacola.reduce((sum, item, index) => {
        if (!selecionados.has(index)) return sum;
        const valor = Number.parseFloat(item.valor_uni ?? item.valorUnitario ?? item.preco ?? 0);
        const quantidade = Number.parseInt(item.quantidade ?? item.qtd ?? 1, 10);
        return sum + valor * quantidade;
      }, 0),
    [sacola, selecionados]
  );

  function atualizarSacola(dados) {
    setSacola(dados);
    localStorage.setItem("Sacola", JSON.stringify(dados));
    window.dispatchEvent(new Event("carrinhoAtualizado"));
  }

  function toggleProduto(index) {
    setSelecionados((atual) => {
      const novo = new Set(atual);
      if (novo.has(index)) novo.delete(index);
      else novo.add(index);
      return novo;
    });
  }

  async function alterarQuantidade(index, delta) {
    const item = sacola[index];
    if (!item) return;

    const idProd = item.id_produto ?? item.idProduto ?? item.id;
    if (!idProd) return;

    try {
      if (delta > 0) {
        await adicionarAoCarrinho(idProd, delta);
      } else {
        await removerDoCarrinho(idProd, Math.abs(delta));
      }

      const qtdAtual = Number.parseInt(item.quantidade ?? item.qtd ?? 1, 10);
      const nova = [...sacola];

      if (delta < 0 && qtdAtual + delta <= 0) {
        nova.splice(index, 1);
        setSelecionados((atual) => {
          const novo = new Set();
          atual.forEach((i) => {
            if (i < index) novo.add(i);
            if (i > index) novo.add(i - 1);
          });
          return novo;
        });
      } else {
        nova[index] = { ...item, quantidade: qtdAtual + delta };
      }

      atualizarSacola(nova);
      await carregarSacolaNovamente();
    } catch (err) {
      console.error(err);
      MelfySwal({
        icon: "error",
        title: "Erro ao atualizar",
        text: err.message || "Não foi possível atualizar a quantidade no servidor.",
      });
      carregarSacolaNovamente();
    }
  }

  async function carregarSacolaNovamente() {
    try {
      const token = localStorage.getItem("tokenCliente");
      if (!token) return;
      const dados = await fetchCarrinho(token);
      const lista = Array.isArray(dados) ? dados : [];
      const listaValida = lista.filter((item) => {
        const qtd = Number.parseInt(item.quantidade ?? item.qtd ?? 0, 10);
        return qtd > 0;
      });
      atualizarSacola(listaValida);
      setSelecionados(new Set(listaValida.map((_, index) => index)));
    } catch (err) {
      console.error(err);
    }
  }

  async function removerItem(index) {
    const item = sacola[index];
    if (!item) return;

    const result = await MelfySwal({
      icon: "warning",
      title: "Remover item?",
      text: "Tem certeza que deseja remover este item da sacola?",
      showCancelButton: true,
      confirmButtonText: "Sim, remover",
      cancelButtonText: "Não, manter",
    });

    if (!result.isConfirmed) {
      return;
    }

    const idProd = item.id_produto ?? item.idProduto ?? item.id;
    const qtdAtual = Number.parseInt(item.quantidade ?? item.qtd ?? 1, 10);

    try {
      await removerDoCarrinho(idProd, qtdAtual);

      const nova = sacola.filter((_, i) => i !== index);
      atualizarSacola(nova);
      setSelecionados((atual) => {
        const novo = new Set();
        atual.forEach((i) => {
          if (i < index) novo.add(i);
          if (i > index) novo.add(i - 1);
        });
        return novo;
      });
      await carregarSacolaNovamente();
    } catch (err) {
      console.error(err);
      MelfySwal({
        icon: "error",
        title: "Erro ao remover",
        text: err.message || "Não foi possível remover o item do carrinho.",
      });
      carregarSacolaNovamente();
    }
  }

  async function finalizarCompra() {
    const token = localStorage.getItem("tokenCliente");
    if (!token) {
      MelfySwal({
        icon: "warning",
        title: "Atenção",
        text: "Você precisa estar logado para finalizar a compra.",
      });
      return;
    }

    const itensEscolhidos = sacola.filter((_, index) => selecionados.has(index));

    if (!itensEscolhidos.length) {
      MelfySwal({
        icon: "warning",
        title: "Sacola vazia",
        text: "Selecione pelo menos um item da sua sacola para continuar.",
      });
      return;
    }

    try {
      const itens = {};
      itensEscolhidos.forEach((p, i) => {
        itens[`item${i + 1}`] = {
          id_produto: p.id_produto ?? p.idProduto ?? p.id,
          valor_uni: Number.parseFloat(p.valor_uni ?? p.valorUnitario ?? p.preco ?? 0),
          qtd: Number.parseInt(p.quantidade ?? p.qtd ?? 1, 10),
        };
      });

      const pedidoCriado = await criarPedido({
        itens,
        id_pagamento: 1,
        id_entrega: 1,
        id_status: 1,
      });

      const idPedidoNovo =
        pedidoCriado?.id_pedido ??
        pedidoCriado?.idPedido ??
        pedidoCriado?.id ??
        pedidoCriado?.result?.id_pedido ??
        pedidoCriado?.result?.id ??
        null;
      if (idPedidoNovo) {
        localStorage.setItem("melfy_pedido_aberto", String(idPedidoNovo));
      }

      for (const item of itensEscolhidos) {
        const idProd = item.id_produto ?? item.idProduto ?? item.id;
        const qtdItem = Number.parseInt(item.quantidade ?? item.qtd ?? 1, 10);
        try {
          await removerDoCarrinho(idProd, qtdItem);
        } catch (e) {
          console.warn("Erro ao limpar item comprado:", e);
        }
      }

      const itensRestantes = sacola.filter((_, index) => !selecionados.has(index));
      atualizarSacola(itensRestantes);
      setSelecionados(new Set(itensRestantes.map((_, i) => i)));
      setCheckoutAberto(false);
      navigate("/pedidos");
    } catch (err) {
      console.error(err);
      MelfySwal({
        icon: "error",
        title: "Erro ao finalizar",
        text: err.message || "Erro inesperado ao finalizar compra.",
      });
    }
  }

  return (
    <>
      <Header />

      <div className="header-bg"></div>

      <main className="carrinho-page">
        <div className="carrinho">
          <div className="content">
            <div className="container">
              <section>
                <CartTable
                  sacola={sacola}
                  selecionados={selecionados}
                  onToggle={toggleProduto}
                  onQuantidade={alterarQuantidade}
                  onRemover={removerItem}
                />
              </section>
            </div>

            <CartSummary subtotal={subtotal} onCheckout={() => setCheckoutAberto(true)} />
          </div>
        </div>

        <h3 className="h3Novidades">Peça também</h3>

        <RecommendationCards
          produtos={produtos}
          lojas={lojas}
          onOpenProduct={setProdutoModal}
        />

        <ProductModal
          produto={produtoModal}
          lojas={lojas}
          onClose={() => setProdutoModal(null)}
        />

        <AnimacaoCarrinho
          visivel={animacaoVisivel}
          imagem={animacaoSacola?.imagem}
          nomeProduto={animacaoSacola?.nome}
        />

        <CheckoutModal
          open={checkoutAberto}
          onClose={() => setCheckoutAberto(false)}
          subtotal={subtotal}
          onFinish={finalizarCompra}
        />
      </main>

      <Footer />
    </>
  );
}
