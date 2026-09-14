import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adicionarAoCarrinho } from "../../services/api";
import { formatarPreco, getPrecoProduto } from "../../utils/formatters";
import MelfySwal from "../../services/melfySwal";

export default function ProductModal({ produto, onClose }) {
  const navigate = useNavigate();
  const [qtd, setQtd] = useState(1);
  const [animando, setAnimando] = useState(false);

  //console.log(produto)
  const loja = produto?.loja ?? null;

  // imagem pode vir como array ou como string direta
  const imagemSrc = Array.isArray(produto?.imagem)
    ? produto.imagem[0]
    : produto?.imagem ?? "/assents/img/Geral/Perfil.png";

  useEffect(() => {
    setQtd(1);
    setAnimando(false);
  }, [produto]);

  if (!produto) return null;

  const { temOferta, precoBase, precoOferta } = getPrecoProduto(produto);
  const preco = precoOferta;

  const handleLojaClick = (e) => {
    e.stopPropagation();
    if (loja.id_loja) navigate(`/loja/${loja.id_loja}`);
  };

  const handleAdicionar = async () => {
    try {
      const prodId = produto.id_produto ?? produto.idProduto ?? produto.id;
      await adicionarAoCarrinho(prodId, qtd);
      setAnimando(true);
      setTimeout(() => {
        setAnimando(false);
        onClose();
      }, 2000);
    } catch (err) {
      if (err.message === "não autenticado") {
        MelfySwal({
          icon: "warning",
          title: "Atenção",
          text: "Você precisa estar logado para adicionar produtos à cesta.",
        });
      } else {
        MelfySwal({
          icon: "error",
          title: "Erro",
          text: err.message || "Erro ao adicionar ao carrinho.",
        });
      }
    }
  };

  return (
    <>
      <section
        className="modal-overlay"
        style={{ display: "flex", backgroundColor: "rgba(0,0,0,0.5)" }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button type="button" className="modal-close" onClick={onClose}>
            ×
          </button>

          <img
            src={imagemSrc}
            alt={produto.nome || ""}
            className="modal-img"
            onError={(e) => {
              e.currentTarget.src = "/assents/img/Geral/Perfil.png";
            }}
          />

          <div className="modal-info">
            <div className="modal-header">
              {loja && (
                <div
                  className="modal-loja"
                  style={{ cursor: "pointer" }}
                  onClick={handleLojaClick}
                >
                  <img
                    src={loja.foto_loja ?? "/assents/img/Geral/Perfil.png"}
                    alt="Logo da loja"
                    className="modal-logo"
                    onError={(e) => {
                      e.currentTarget.src = "/assents/img/Geral/Perfil.png";
                    }}
                  />
                  <span className="modal-nome-loja">{loja.nome_loja}</span>
                  <span className="modal-avaliacoes">★ 4.8</span>
                </div>
              )}
            </div>

            <h2 className="modal-title">{produto.nome}</h2>
            <p className="modal-subtitulo">{produto.subtitulo || ""}</p>
            <p className="modal-description">{produto.descricao || ""}</p>
            {produto.peso && <p className="modal-peso">{produto.peso}</p>}
            {temOferta && <span className="modal-badge-oferta">Oferta</span>}
            <p className={`modal-price ${temOferta ? "modal-price--promo" : ""}`}>
              R$ {formatarPreco(preco)}
            </p>
            {temOferta && (
              <p className="modal-price-old">R$ {formatarPreco(precoBase)}</p>
            )}
            <p className="modal-total">
              Total: R$ <span id="total-price">{formatarPreco(preco * qtd)}</span>
            </p>

            <div className="modal-actions">
              <div className="modal-quantity">
                <button
                  type="button"
                  className="qtd-btn"
                  onClick={() => setQtd((v) => Math.max(1, v - 1))}
                >
                  -
                </button>
                <span id="qtd-value">{qtd}</span>
                <button
                  type="button"
                  className="qtd-btn"
                  onClick={() => setQtd((v) => v + 1)}
                >
                  +
                </button>
              </div>

              <button type="button" className="btn-add" onClick={handleAdicionar}>
                <span>Adicionar ao carrinho</span>
                <i className="fas fa-shopping-bag" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {animando && (
        <div className="animacao-carrinho" style={{ display: "flex" }}>
          <div className="animacao-conteudo">
            <i className="fas fa-shopping-bag icone-sacola" />
            <img
              className="img-doce-sacola"
              src={imagemSrc || "/assents/img/Geral/Perfil.png"}
              alt={produto.nome || "Doce"}
            />
            <p className="mensagem-sacola">
              {produto.nome} foi adicionado à sacola com sucesso!
            </p>
          </div>
        </div>
      )}
    </>
  );
}
