import React from "react";

export default function AnimacaoCarrinho({ visivel, imagem, nomeProduto }) {
  if (!visivel) return null;

  return (
    <div id="carrinho-animacao" className="animacao-carrinho" style={{ display: "flex" }}>
      <div className="animacao-conteudo">
        <i className="fas fa-shopping-bag icone-sacola" />
        <img
          id="img-doce-animado"
          className="img-doce-sacola"
          src={imagem || "/assents/img/Geral/Perfil.png"}
          alt="Doce"
        />
        <p className="mensagem-sacola" id="mensagem-sacola">
          {nomeProduto} adicionado à sacola!
        </p>
      </div>
    </div>
  );
}
