import React from "react";
import { useNavigate } from "react-router-dom";
import { useDragScroll } from "../../hooks/useDragScroll";

function formatDist(km) {
  if (km === Infinity || km == null) return null;
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

export default function LojasSection({ lojas, loadingDist, locationDenied }) {
  const sliderRef = useDragScroll();
  const navigate  = useNavigate();

  return (
    <section className="lojas-proximas">
      <h3>
        Lojas Próximas
        {loadingDist && (
          <span style={{ fontSize: "0.75rem", fontWeight: 400, marginLeft: "0.5rem", opacity: 0.6 }}>
            calculando distâncias…
          </span>
        )}
        {!loadingDist && locationDenied && (
          <span style={{ fontSize: "0.75rem", fontWeight: 400, marginLeft: "0.5rem", opacity: 0.6 }}>
            (ative a localização para ver as mais próximas)
          </span>
        )}
      </h3>
      <div className="lojas-scroll" ref={sliderRef}>
        {lojas.map((loja) => {
          const id   = loja.idLoja || loja.id_loja;
          const nome = loja.nome_loja;
          const dist = formatDist(loja.distKm);

          return (
            <div
              key={id}
              className="loja-card"
              onClick={() => navigate(`/loja/${id}`)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={loja.pfp || loja.foto_loja}
                alt={nome}
                className="logo-loja"
              />
              <div className="info-loja">
                <h3>{nome}</h3>
                <p>{loja.descricao || "Confeitaria artesanal"}</p>
                {dist && (
                  <span style={{ display: "block", fontSize: "0.78rem", opacity: 0.7, marginTop: "0.25rem" }}>
                    <i className="fas fa-map-marker-alt" style={{ marginRight: "0.3rem" }} />
                    {dist} de você
                  </span>
                )}
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
