import React, { useEffect, useRef, useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Pedido from "../components/pedidos/Pedido";
import PedidoHistorico from "../components/pedidos/PedidoHistorico";
import { SyncBar, ErrorBanner, LoadingSpinner, SectionHeading, EmptyState } from "../components/pedidos/PedidosUI";
import { usePedidos } from "../hooks/usePedidos";
import { PAGE_SIZE } from "../utils/orderUtils";
import "../styles/cliente/pedidos.css";

export default function PedidosPage() {
  const {
    loading,
    error,
    updated,
    active,
    history,
    visible,
    setVisible,
    load,
  } = usePedidos();

  const [activeOpen, setActiveOpen] = React.useState(null);
  const [historyOpen, setHistoryOpen] = React.useState(null);
  const [scrollParaId, setScrollParaId] = useState(null);
  const pedidoAbertoRef = useRef(false);

  useEffect(() => {
    if (loading || pedidoAbertoRef.current) return;
    const idPendente = localStorage.getItem("melfy_pedido_aberto");
    if (!idPendente) return;

    const todosOrders = [...active, ...history];
    const encontrado = todosOrders.find(
      (o) => String(o.id) === idPendente || String(o.id_pedido) === idPendente
    );

    if (!encontrado) return;

    localStorage.removeItem("melfy_pedido_aberto");
    pedidoAbertoRef.current = true;

    const emAtivo = active.some(
      (o) => String(o.id) === idPendente || String(o.id_pedido) === idPendente
    );
    if (emAtivo) {
      setActiveOpen(encontrado.id);
    } else {
      setHistoryOpen(encontrado.id);
    }

    setScrollParaId(encontrado.id);
  }, [loading, active, history]);

  useEffect(() => {
    if (!scrollParaId) return;

    function tentarScroll(tentativas = 0) {
      const el = document.getElementById(`pedido-${scrollParaId}`);
      if (el) {
        const topo = el.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: topo, behavior: "smooth" });
        setScrollParaId(null);
      } else if (tentativas < 20) {
        requestAnimationFrame(() => tentarScroll(tentativas + 1));
      }
    }

    requestAnimationFrame(() => tentarScroll());
  }, [scrollParaId]);

  const shown = history.slice(0, visible);
  const hasMore = visible < history.length;

  return (
    <>
      <Header />

      <main className="m-pedidos-page">
        <SyncBar updated={updated} onRefresh={() => load(false)} />

        {error && (
          <ErrorBanner message={error} onRetry={() => load(true)} />
        )}

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <section className="m-section">
              <SectionHeading
                eyebrow="AGORA"
                title="Pedidos em andamento"
                subtitle={
                  active.length
                    ? "Tem novidade acontecendo por aqui ✨"
                    : "Você não tem pedidos em andamento"
                }
              />

              {active.length ? (
                <div className="m-active-list">
                  {active.map((o) => (
                    <Pedido
                      key={o.id}
                      o={o}
                      open={activeOpen === o.id}
                      setOpen={setActiveOpen}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  emoji="🧁"
                  title="Nenhum pedido por aqui"
                  description="Quando você fizer uma compra, ela aparecerá nesta área para você acompanhar."
                />
              )}
            </section>

            <section className="m-section m-history-section">
              <SectionHeading
                eyebrow="MEMÓRIAS DELICIOSAS"
                title="Histórico de pedidos"
                subtitle={
                  history.length
                    ? `${history.length} pedidos já feitos`
                    : "Seus pedidos anteriores"
                }
              />

              {history.length ? (
                <>
                  <div className="m-history-list">
                    {shown.map((o) => (
                      <PedidoHistorico
                        key={o.id}
                        o={o}
                        open={historyOpen === o.id}
                        setOpen={setHistoryOpen}
                      />
                    ))}
                  </div>

                  {hasMore && (
                    <button
                      className="m-more"
                      onClick={() => setVisible((v) => v + PAGE_SIZE)}
                    >
                      Ver mais pedidos{" "}
                      <i className="fa-solid fa-chevron-down" />
                    </button>
                  )}

                  {visible > PAGE_SIZE && !hasMore && (
                    <button
                      className="m-more"
                      onClick={() => setVisible(PAGE_SIZE)}
                    >
                      Mostrar menos{" "}
                      <i className="fa-solid fa-chevron-up" />
                    </button>
                  )}
                </>
              ) : (
                <EmptyState
                  emoji="🍪"
                  title="Ainda não há histórico"
                  description="Seus pedidos finalizados vão aparecer aqui."
                  small
                />
              )}
            </section>
          </>
        )}
      </main>

      <Footer />
    </>
  );
}
