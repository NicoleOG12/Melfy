import React from "react";

export default function LojaHero({ nomeLoja, descricao, logoLoja, aberto, mediaAvaliacao, totalProdutos, totalAvaliacoes, telefone, loading }) {
  return (
    <div className="loja-hero">
      <div className="loja-hero-bg" style={{ backgroundImage: `url(${logoLoja})` }} />
      <div className="loja-hero-overlay" />

      <div className="loja-hero-inner">
        <div className="loja-hero-card">

          <div className="loja-hero-logo-wrap">
            <img
              src={logoLoja}
              alt={nomeLoja}
              className="loja-hero-logo"
              onError={(e) => { e.currentTarget.src = "/assents/img/Geral/Perfil.png"; }}
            />
            <span className={`loja-status-dot ${aberto ? "aberto" : "fechado"}`} />
          </div>

          <div className="loja-hero-info">
            {loading
              ? <div className="loja-skel loja-skel-titulo" />
              : <h1 className="loja-hero-nome">{nomeLoja}</h1>
            }

            {!loading && (
              <>
                <p className="loja-hero-desc">{descricao}</p>

                <div className="loja-hero-badges">
                  <span className="loja-badge loja-badge-star">
                    <i className="fas fa-star" />
                    {mediaAvaliacao}
                    <small>({totalAvaliacoes})</small>
                  </span>

                  <span className="loja-badge">
                    <i className="fas fa-shopping-bag" />
                    {totalProdutos} produtos
                  </span>

                  <span className={`loja-badge ${aberto ? "loja-badge-open" : "loja-badge-closed"}`}>
                    <i className={`fas fa-${aberto ? "circle" : "moon"}`} />
                    {aberto ? "Aberto agora" : "Fechado"}
                  </span>

                  {telefone && (
                    <span className="loja-badge">
                      <i className="fas fa-phone-alt" /> {telefone}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
