import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adicionarAoCarrinho } from "../../services/api";
import { formatarPreco } from "../../utils/formatters";
import MelfySwal from "../../services/melfySwal";

export default function ProductModal({ produto, lojas = [], onClose }) {
  const navigate = useNavigate();
  const [qtd, setQtd] = useState(1);
  const [animando, setAnimando] = useState(false);

  useEffect(() => {
    setQtd(1);
    setAnimando(false);
  }, [produto]);

  if (!produto) return null;

  const idLojaProduto = parseInt(produto.id_loja ?? produto.idLoja);
  const lojaEncontrada = lojas.find(
    (l) => parseInt(l.id_loja ?? l.idLoja) === idLojaProduto
  );
  const loja = lojaEncontrada || {
    id_loja: idLojaProduto,
    idLoja: idLojaProduto,
    nomeLoja: produto.loja_nome || produto.nomeLoja || "Loja Desconhecida",
    pfp:
      produto.pfp ||
      produto.logoLoja ||
      produto.logo_loja ||
      "/assents/img/Geral/Perfil.png",
  };

  const lojaId = loja.id_loja ?? loja.idLoja;
  const lojaNome = loja.nomeLoja || loja.loja_nome || loja.nome || "Loja";
  const lojaLogo = loja.pfp || loja.fotoPerfil || "/assents/img/Geral/Perfil.png";

  const preco = parseFloat(produto.valor_uni ?? produto.preco ?? produto.valor ?? 0);
  const imgSrc = produto.imagem || produto.midia?.imagens?.[0]?.path || produto.foto || "";

  const handleLojaClick = (e) => {
    e.stopPropagation();
    if (lojaId) navigate(`/loja/${lojaId}`);
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
            src={imgSrc}
            alt={produto.nome || ""}
            className="modal-img"
            onError={(e) => {
              e.currentTarget.src = "/assents/img/Geral/Perfil.png";
            }}
          />

          <div className="modal-info">
            <div className="modal-header">
              <div
                className="modal-loja"
                style={{ cursor: "pointer" }}
                onClick={handleLojaClick}
              >
                <img
                  src={lojaLogo}
                  alt="Logo da loja"
                  className="modal-logo"
                  onError={(e) => {
                    e.currentTarget.src = "/assents/img/Geral/Perfil.png";
                  }}
                />
                <span className="modal-nome-loja">{lojaNome}</span>
                <span className="modal-avaliacoes">★ 4.8</span>
              </div>
            </div>

            <h2 className="modal-title">{produto.nome}</h2>
            <p className="modal-subtitulo">{produto.subtitulo || ""}</p>
            <p className="modal-description">{produto.descricao || ""}</p>
            {produto.peso && <p className="modal-peso">{produto.peso}</p>}
            <p className="modal-price">R$ {formatarPreco(preco)}</p>
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
              src={imgSrc || "/assents/img/Geral/Perfil.png"}
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
