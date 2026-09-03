import React from "react";
import { useNavigate } from "react-router-dom";
import { formatarPreco, limitarDescricao } from "../../utils/formatters";

export default function CardProduto({ produto, onCardClick, variant = "doces", hideLojaLogo = false }) {
  const isHome = variant === "home";
  const navigate = useNavigate();

  const imgSrc = produto.imagem || produto.midia?.imagens?.[0]?.path || produto.foto || "";
  const loja   = { id: produto.id_loja ?? produto.idLoja, pfp: produto.pfp || produto.logoLoja || "" };

  function irParaLoja(e) {
    e.stopPropagation();
    if (loja.id) navigate(`/loja/${loja.id}`);
  }

  return (
    <div className={isHome ? "card-home" : "card"} onClick={() => onCardClick(produto)}>
      <div className="headerNovidade">
        {!hideLojaLogo && (
          <img
            src={loja.pfp}
            alt="Logo da Loja"
            className="logoLoja"
            onClick={irParaLoja}
          />
        )}
      </div>
      <div className={isHome ? "border-card-home" : "border-card"}>
        <img src={imgSrc} alt={produto.nome} className="imagem-produto" />
        <div className={isHome ? "descricao-home" : "descricao"}>
          <h3>{produto.nome}</h3>
          <p dangerouslySetInnerHTML={{ __html: limitarDescricao(produto.descricao || produto.subtitulo || "") }} />
        </div>
        <div className="footerNovidades">
          <div className="preco">
            <span className="icone-preco">R$</span>
            <span className="valor">
              {formatarPreco(produto.valor_uni || produto.preco || 0)}
            </span>
          </div>
        </div>
        <button
          type="button"
          className="btn-carrinho add-carrinho-btn"
          onClick={(e) => {
            e.stopPropagation();
            onCardClick(produto);
          }}
        >
          <span>Adicionar ao carrinho</span>
          <i className="fas fa-shopping-bag"></i>
        </button>
      </div>
    </div>
  );
}
