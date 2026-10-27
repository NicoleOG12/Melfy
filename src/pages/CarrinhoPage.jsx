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
import { fetchCarrinho, fetchProdutos, fetchLojas, adicionarAoCarrinho, removerDoCarrinho, checkoutPedidoAPI, fetchStatusPagamento, atualizarQuantidadeCarrinho } from "../services/api";
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
  const [carregandoSacola, setCarregandoSacola] = useState(true);
  const [operacaoCarrinho, setOperacaoCarrinho] = useState(null);
  const [finalizandoCompra, setFinalizandoCompra] = useState(false);
  const [pixCheckout, setPixCheckout] = useState(null);
  const [erroConsultaPagamento, setErroConsultaPagamento] = useState("");

  useEffect(() => {
    if (!pixCheckout?.statusId) return;

    let ativo = true;
    let timer;
    const controller = new AbortController();

    async function verificarPagamento() {
      try {
        const response = await fetchStatusPagamento(
          pixCheckout.statusId,
          controller.signal,
        );
        if (!ativo) return;

        const statusGateway = String(
          response?.data?.mercado_pago?.status ??
            response?.mercado_pago?.status ??
            "",
        ).toLowerCase();
        if (statusGateway === "approved") {
          setPixCheckout(null);
          navigate("/pedidos?status=approved");
          return;
        }

        setErroConsultaPagamento("");
      } catch (error) {
        if (ativo && error?.name !== "AbortError") {
          setErroConsultaPagamento(
            "Não foi possível consultar o pagamento. Vamos tentar novamente.",
          );
          console.error("Erro ao consultar status do pagamento:", error);
        }
      } finally {
        if (ativo) timer = setTimeout(verificarPagamento, 30_000);
      }
    }

    setErroConsultaPagamento("");
    verificarPagamento();

    return () => {
      ativo = false;
      clearTimeout(timer);
      controller.abort();
    };
  }, [pixCheckout?.statusId, navigate]);

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
      setCarregandoSacola(false);
    }

    carregar();
    return () => { ativo = false; };
  }, []);

  useEffect(() => {
    const atualizarComEvento = () => carregarSacolaNovamente();
    window.addEventListener("carrinhoAtualizado", atualizarComEvento);
    return () => window.removeEventListener("carrinhoAtualizado", atualizarComEvento);
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
    const quantidadeAtual = Number.parseInt(item.quantidade ?? item.qtd ?? 0, 10);
    const novaQuantidade = quantidadeAtual + Number(delta);

    if (!idItem) return;

    setOperacaoCarrinho(`quantidade-${index}`);
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
    } finally {
      setOperacaoCarrinho(null);
    }
  }

  async function carregarSacolaNovamente() {
    try {
      const token = localStorage.getItem("tokenCliente");
      if (!token) return;
      setCarregandoSacola(true);
      const dados = await fetchCarrinho(token);
      const lista = Array.isArray(dados) ? dados : [];
      const listaValida = lista.filter((item) => {
        const qtd = Number.parseInt(item.quantidade ?? item.qtd ?? 0, 10);
        return qtd > 0;
      });
      setSacola(listaValida);
      localStorage.setItem("Sacola", JSON.stringify(listaValida));
      setSelecionados(new Set(listaValida.map((_, index) => index)));
    } catch (err) {
      console.error(err);
    } finally {
      setCarregandoSacola(false);
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
    setOperacaoCarrinho(`remover-${index}`);
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
    } finally {
      setOperacaoCarrinho(null);
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

    setFinalizandoCompra(true);
    try {
      const itens = itensEscolhidos.map((p) => ({
        id_produto: Number(p.id_produto ?? p.idProduto ?? p.id),
        quantidade: Number(p.quantidade ?? p.qtd ?? 1),
      }));

      const pedidoCriado = await checkoutPedidoAPI({
        id_endereco_entrega: dadosCheckout?.id_endereco_entrega,
        metodo: dadosCheckout?.metodo || "PIX",
        payment: dadosCheckout?.payment,
        itens,
      });

      const pedido = pedidoCriado?.data ?? pedidoCriado;
      const pagamento = pedido?.pagamento ?? {};
      const checkoutUrl = pagamento.checkout_url ?? null;

      const idPedidoNovo =
        pedido?.id_pedido ??
        null;
      if (idPedidoNovo) {
        localStorage.setItem("melfy_pedido_aberto", String(idPedidoNovo));
      }

      for (const item of itensEscolhidos) {
        const idItemCarrinho = item.id_item_carrinho ?? item.idItemCarrinho;
        if (!idItemCarrinho) continue;
        try {
          await removerDoCarrinho(idItemCarrinho);
        } catch (e) {
          console.warn("Erro ao limpar item comprado:", e);
        }
      }

      const itensRestantes = sacola.filter((_, index) => !selecionados.has(index));
      atualizarSacola(itensRestantes);
      setSelecionados(new Set(itensRestantes.map((_, i) => i)));
      setCheckoutAberto(false);

      if (
        dadosCheckout?.metodo === "PIX" &&
        (pagamento.qr_code || pagamento.qr_code_base64)
      ) {
        const statusId =
          idPedidoNovo ??
          pagamento.id_cobranca_gateway ??
          pagamento.gateway_id ??
          pagamento.id_pagamento_pedido;
        setPixCheckout({
          qrCode: pagamento.qr_code,
          qrCodeBase64: pagamento.qr_code_base64,
          checkoutUrl,
          idPedido: idPedidoNovo,
          statusId,
        });
      } else if (checkoutUrl) {
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
    } finally {
      setFinalizandoCompra(false);
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
                  carregando={carregandoSacola}
                  operacao={operacaoCarrinho}
                  onToggle={toggleProduto}
                  onQuantidade={alterarQuantidade}
                  onRemover={removerItem}
                />
              </section>
            </div>

            <CartSummary
              subtotal={subtotal}
              onCheckout={() => setCheckoutAberto(true)}
              disabled={finalizandoCompra || carregandoSacola}
            />
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

        {pixCheckout && (
          <div className="pix-checkout-overlay" role="presentation">
            <section
              className="pix-checkout-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="pix-checkout-title"
            >
              <button
                type="button"
                className="pix-checkout-close"
                aria-label="Fechar pagamento Pix"
                onClick={() => {
                  setPixCheckout(null);
                  navigate("/pedidos");
                }}
              >
                ×
              </button>
              <h2 id="pix-checkout-title">Finalize com Pix</h2>
              <p role="status">
                Aguardando confirmação do pagamento. O status é verificado a cada 30 segundos.
              </p>
              {erroConsultaPagamento && (
                <p className="pix-checkout-error" role="alert">
                  {erroConsultaPagamento}
                </p>
              )}
              {pixCheckout.qrCodeBase64 && (
                <img
                  className="pix-checkout-qr"
                  src={
                    pixCheckout.qrCodeBase64.startsWith("data:")
                      ? pixCheckout.qrCodeBase64
                      : `data:image/png;base64,${pixCheckout.qrCodeBase64}`
                  }
                  alt="QR Code para pagamento Pix"
                />
              )}
              {pixCheckout.qrCode && (
                <>
                  <p>Copie o código Pix e pague pelo aplicativo do seu banco:</p>
                  <textarea
                    className="pix-checkout-code"
                    value={pixCheckout.qrCode}
                    readOnly
                    aria-label="Código Pix"
                  />
                  <button
                    type="button"
                    className="btn-compra"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(pixCheckout.qrCode);
                        MelfySwal({
                          icon: "success",
                          title: "Código Pix copiado",
                          text: "Cole o código no aplicativo do seu banco.",
                        });
                      } catch {
                        MelfySwal({
                          icon: "error",
                          title: "Não foi possível copiar",
                          text: "Selecione e copie o código Pix manualmente.",
                        });
                      }
                    }}
                  >
                    Copiar código Pix
                  </button>
                </>
              )}
              {pixCheckout.checkoutUrl && (
                <a
                  className="pix-checkout-link"
                  href={pixCheckout.checkoutUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Abrir checkout do Mercado Pago
                </a>
              )}
              {pixCheckout.idPedido && <p>Pedido #{pixCheckout.idPedido}</p>}
            </section>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
