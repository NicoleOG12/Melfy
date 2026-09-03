import React from "react";
import { useNavigate } from "react-router-dom";
import { useDragScroll } from "../../hooks/useDragScroll";

export default function LojasSection({ lojas }) {
  const sliderRef = useDragScroll();
  const navigate  = useNavigate();

  return (
    <section className="lojas-proximas">
      <h3>Lojas Próximas</h3>
      <div className="lojas-scroll" ref={sliderRef}>
        {[...lojas].reverse().map((loja) => {
          const id   = loja.idLoja || loja.id_loja;
          const nome = loja.nomeLoja || loja.loja_nome || loja.nome;

          return (
            <div
              key={id}
              className="loja-card"
              onClick={() => navigate(`/loja/${id}`)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={loja.pfp || loja.fotoPerfil}
                alt={nome}
                className="logo-loja"
              />
              <div className="info-loja">
                <h3>{nome}</h3>
                <p>{loja.descricao || "Confeitaria artesanal"}</p>
                <button
                  type="button"
                  className="btn-loja"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/loja/${id}`);
                  }}
                >
                  Ver loja
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
