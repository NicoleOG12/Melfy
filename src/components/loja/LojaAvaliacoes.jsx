import React from "react";
import Estrelas from "./Estrelas";

export default function LojaAvaliacoes({ avaliacoes, mediaAvaliacao }) {
  return (
    <div className="loja-avaliacoes-secao">

      <div className="loja-aval-resumo">
        <div className="loja-aval-nota-grande">
          <span className="loja-aval-numero">{mediaAvaliacao}</span>
          <Estrelas nota={Math.round(Number(mediaAvaliacao))} size={22} />
          <small>{avaliacoes.length} avaliações</small>
        </div>

        <div className="loja-aval-barras">
          {[5, 4, 3, 2, 1].map((n) => {
            const qt  = avaliacoes.filter((a) => a.nota === n).length;
            const pct = avaliacoes.length
              ? Math.round((qt / avaliacoes.length) * 100)
              : 0;
            return (
              <div key={n} className="loja-aval-barra-row">
                <span>{n} <i className="fas fa-star" /></span>
                <div className="loja-aval-barra-bg">
                  <div className="loja-aval-barra-fill" style={{ width: `${pct}%` }} />
                </div>
                <span className="loja-aval-pct">{qt}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="loja-aval-lista">
        {avaliacoes.map((av) => (
          <div key={av.id} className="loja-aval-card">
            <div className="loja-aval-top">
              <img
                src={av.foto}
                alt={av.nome}
                className="loja-aval-avatar"
                onError={(e) => { e.currentTarget.src = "/assents/img/Geral/Perfil.png"; }}
              />
              <div className="loja-aval-meta">
                <strong>{av.nome}</strong>
                <div className="loja-aval-sub">
                  <Estrelas nota={av.nota} />
                  <span className="loja-aval-data">{av.data}</span>
                </div>
              </div>
            </div>

            <p className="loja-aval-texto">{av.texto}</p>

            {av.fotos?.length > 0 && (
              <div className="loja-aval-fotos">
                {av.fotos.map((f, i) => (
                  <img key={i} src={f} alt="foto avaliação" className="loja-aval-foto-thumb" />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
