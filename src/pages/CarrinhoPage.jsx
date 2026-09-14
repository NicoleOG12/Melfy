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
import { fetchCarrinho, fetchProdutos, fetchLojas, adicionarAoCarrinho, removerDoCarrinho, criarPedido, atualizarQuantidadeCarrinho } from "../services/api";
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
      // 1. Carrega do localStorage imediatamente para renderização instantânea
      const salvo = localStorage.getItem("Sacola");
      if (salvo) {
        try {
          const dadosSalvos = JSON.parse(salvo);
          if (Array.isArray(dadosSalvos) && dadosSalvos.length > 0) {
            setSacola(dadosSalvos);
            setSelecionados(new Set(dadosSalvos.map((_, index) => index)));
          }
        } catch { }
      }

      // 2. Busca catálogo (produtos e lojas) utilizando o cache inteligente
      try {
        const [ps, ls] = await Promise.all([
          fetchProdutos(),
          fetchLojas(),
        ]);
        if (!ativo) return;
        setProdutos(ps);
        setLojas(ls);
      } catch (err) {
        console.error("Erro ao carregar catálogo:", err);
      }

      // 3. Sincroniza carrinho via API em segundo plano caso o usuário esteja autenticado
      const token = localStorage.getItem("tokenCliente");
      if (token) {
        try {
          const carrinho = await fetchCarrinho(token);
          if (!ativo) return;
          const dados = Array.isArray(carrinho) ? carrinho : [];
          const dadosValidos = dados.filter((item) => {
            const qtd = Number.parseInt(item.quantidade ?? item.qtd ?? 0, 10);
            return qtd > 0;
          });
          setSacola(dadosValidos);
          localStorage.setItem("Sacola", JSON.stringify(dadosValidos));
          setSelecionados(new Set(dadosValidos.map((_, index) => index)));
        } catch (err) {
          console.error("Erro ao carregar carrinho via API:", err);
        }
      }
    }

    carregar();
    return () => { ativo = false; };
  }, []);

  const subtotal = useMemo(
    () =>
      sacola.reduce((sum, item, index) => {
        if (!selecionados.has(index)) return sum;
        const valor = Number.parseFloat(item.valor_uni ?? item.valorUnitario ?? item.preco_unitario ?? 0);
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

    const idItem = item.id_item_carrinho;
    const novaQuantidade = item.quantidade + Number(delta);

    if (!idItem) return;

    try {
      if (novaQuantidade <= 0) {
        await removerDoCarrinho(idItem);

        const novaSacola = sacola.filter((_, i) => i !== index);
        atualizarSacola(novaSacola);

      } else {
        await atualizarQuantidadeCarrinho(idItem, novaQuantidade);

        const novaSacola = [...sacola];
        novaSacola[index] = {
          ...item,
          quantidade: novaQuantidade
        };

        atualizarSacola(novaSacola);
      }
    } catch (err) {
      console.error(err);

      MelfySwal({
        icon: "error",
        title: "Erro ao atualizar",
        text: err.message || "Não foi possível atualizar a quantidade."
      });
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
    if (!result.isConfirmed) return;
    try {
      await removerDoCarrinho(item.id_item_carrinho);
      atualizarSacola(
        sacola.filter((_, i) => i !== index)
      );

      setSelecionados((atual) => {
        const novo = new Set();

        atual.forEach((i) => {
          if (i < index) novo.add(i);
          if (i > index) novo.add(i - 1);
        });

        return novo;
      });
    } catch (err) {
      console.error(err);
      MelfySwal({ icon: "error", title: "Erro ao remover", text: err.message || "Não foi possível remover o item do carrinho.", });
    }
  }

  async function finalizarCompra(dadosCheckout = {}) {
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
      const itens = itensEscolhidos.map((p) => ({
        id_produto: Number(p.id_produto ?? p.idProduto ?? p.id),
        quantidade: Number(p.quantidade ?? p.qtd ?? 1),
      }));

      const pedidoCriado = await criarPedido({
        id_endereco_entrega: dadosCheckout?.id_endereco_entrega || 1,
        tipo_pagamento: dadosCheckout?.tipo_pagamento || "PIX",
        methods: dadosCheckout?.methods || ["PIX"],
        itens,
      });

      //console.log("PEDIDO CRIADO", pedidoCriado)
      const checkoutUrl =
        pedidoCriado?.data?.pagamento?.checkout_url ??
        null;

      const idPedidoNovo =
        pedidoCriado?.data?.id_pedido ??
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

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        navigate("/pedidos");
      }
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
