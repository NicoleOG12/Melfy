import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { fetchPedidoDetalhesAPI } from "../../services/api";
import MelfySwal from "../../services/melfySwal";
import { money } from "../../utils/orderUtils";

function imagemQrCode(base64) {
  if (!base64) return "";
  return base64.startsWith("data:")
    ? base64
    : `data:image/png;base64,${base64}`;
}

export default function PagamentoPedidoModal({ pedido, onClose }) {
  const [detalhes, setDetalhes] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [qrCodeGerado, setQrCodeGerado] = useState("");
  const [erroQrCode, setErroQrCode] = useState("");

  useEffect(() => {
    if (!pedido) return undefined;

    const controller = new AbortController();
    let ativo = true;
    setDetalhes(null);
    setErro("");
    setCarregando(true);

    async function carregarDetalhes() {
      try {
        const response = await fetchPedidoDetalhesAPI(
          pedido.id,
          controller.signal,
        );
        if (response?.error) {
          throw new Error(response.message || "Não foi possível consultar o pedido.");
        }

        const pedidoCompleto = response?.data ?? response;
        if (!pedidoCompleto?.pagamento) {
          throw new Error("Este pedido não possui dados de pagamento disponíveis.");
        }

        if (ativo) setDetalhes(pedidoCompleto);
      } catch (error) {
        if (ativo && error?.name !== "AbortError") {
          setErro(error.message || "Não foi possível consultar o pagamento.");
        }
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregarDetalhes();
    return () => {
      ativo = false;
      controller.abort();
    };
  }, [pedido]);

  const pagamento = detalhes?.pagamento;
  const codigoPix = pagamento?.qr_code;
  const imagemSalva = pagamento?.qr_code_base64;
  const statusPagamento = String(pagamento?.status_pagamento ?? "").toLowerCase();
  const pagamentoPendente =
    !statusPagamento ||
    statusPagamento.includes("pend") ||
    statusPagamento === "in_process";

  useEffect(() => {
    let ativo = true;
    setQrCodeGerado("");
    setErroQrCode("");

    if (!codigoPix || imagemSalva) return undefined;

    QRCode.toDataURL(codigoPix, {
      errorCorrectionLevel: "M",
      margin: 1,
      width: 260,
    })
      .then((dataUrl) => {
        if (ativo) setQrCodeGerado(dataUrl);
      })
      .catch((error) => {
        console.error("Erro ao gerar QR Code do pagamento:", error);
        if (ativo) {
          setErroQrCode(
            "Não foi possível gerar a imagem. Use o código Pix para copiar e colar.",
          );
        }
      });

    return () => {
      ativo = false;
    };
  }, [codigoPix, imagemSalva]);

  if (!pedido) return null;

  async function copiarCodigoPix() {
    try {
      await navigator.clipboard.writeText(codigoPix);
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
  }

  return (
    <div
      className="pix-checkout-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="pix-checkout-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pedido-pagamento-title"
      >
        <button
          type="button"
          className="pix-checkout-close"
          aria-label="Fechar pagamento"
          onClick={onClose}
        >
          ×
        </button>
        <h2 id="pedido-pagamento-title">Pagamento do pedido #{pedido.code}</h2>

        {carregando && <p role="status">Buscando os dados do pagamento...</p>}
        {erro && <p className="pix-checkout-error" role="alert">{erro}</p>}

        {detalhes && (
          <>
            <p>
              Total: <strong>{money(detalhes.valor_total)}</strong>
            </p>
            {!pagamentoPendente ? (
              <p role="status">
                Este pagamento não está mais pendente
                {pagamento?.status_pagamento
                  ? ` (${pagamento.status_pagamento})`
                  : ""}.
              </p>
            ) : (
              <>
                {codigoPix && (
                  <>
                    {(imagemSalva || qrCodeGerado) && (
                      <img
                        className="pix-checkout-qr"
                        src={imagemQrCode(imagemSalva) || qrCodeGerado}
                        alt="QR Code para pagamento Pix"
                      />
                    )}
                    {erroQrCode && (
                      <p className="pix-checkout-error" role="alert">
                        {erroQrCode}
                      </p>
                    )}
                    <p>Copie o código Pix e pague pelo aplicativo do seu banco:</p>
                    <textarea
                      className="pix-checkout-code"
                      value={codigoPix}
                      readOnly
                      aria-label="Código Pix"
                    />
                    <button
                      type="button"
                      className="btn-compra"
                      onClick={copiarCodigoPix}
                    >
                      Copiar código Pix
                    </button>
                  </>
                )}
                {pagamento?.link_pagamento && (
                  <a
                    className="btn-compra pix-checkout-link"
                    href={pagamento.link_pagamento}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Abrir pagamento
                  </a>
                )}
                {!codigoPix && !pagamento?.link_pagamento && (
                  <p className="pix-checkout-error" role="alert">
                    O backend não retornou um QR Code nem um link de pagamento.
                  </p>
                )}
              </>
            )}
          </>
        )}
      </section>
    </div>
  );
}
