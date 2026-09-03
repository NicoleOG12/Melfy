import React from "react";

export default function NotificacoesTab() {
  const items = [
    {
      id: "pedidos",
      title: "Avisos de Pedidos",
      desc: "Receba atualizações quando seu pedido estiver em preparo e em rota.",
      on: true,
    },
    {
      id: "promo",
      title: "Promoções e Cupons",
      desc: "Receba ofertas exclusivas e cupons relâmpago das confeiteiras.",
      on: true,
    },
    {
      id: "novidades",
      title: "Novidades Melfy",
      desc: "Fique por dentro de novas confeiteiras e doces adicionados.",
      on: false,
    },
  ];

  return (
    <section className="perfil-content">
      <div className="perfil-section-header">
        <div className="perfil-section-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
        </div>
        <div className="perfil-section-title">
          <h2>Notificações</h2>
          <p>Gerencie suas preferências de comunicação e avisos.</p>
        </div>
      </div>

      <div className="notif-list">
        {items.map(({ id, title, desc, on }) => (
          <div key={id} className="notif-item">
            <div className="notif-info">
              <h4>{title}</h4>
              <p>{desc}</p>
            </div>
            <span className={`notif-badge ${on ? "on" : "off"}`}>
              {on ? (
                <>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Ativo
                </>
              ) : "Inativo"}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
