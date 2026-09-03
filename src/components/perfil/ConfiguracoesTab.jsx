import React, { useState } from "react";
import MelfySwal from "../../services/melfySwal";

export default function ConfiguracoesTab() {
  const [configs, setConfigs] = useState([
    {
      id: "notif-email",
      title: "Notificações por E-mail",
      desc: "Receber e-mails sobre pedidos, promoções e novidades.",
      on: true,
    },
    {
      id: "notif-sms",
      title: "Notificações por SMS",
      desc: "Receber SMS com status do pedido e alertas importantes.",
      on: false,
    },
    {
      id: "notif-push",
      title: "Notificações Push",
      desc: "Alertas em tempo real sobre pedidos e cupons relâmpago.",
      on: true,
    },
  ]);

  function toggle(id) {
    setConfigs((prev) =>
      prev.map((c) => (c.id === id ? { ...c, on: !c.on } : c))
    );
  }

  function salvar() {
    MelfySwal({
      icon: "success",
      title: "Configurações salvas!",
      text: "Suas preferências foram atualizadas.",
      confirmButtonText: "OK",
    });
  }

  return (
    <section className="perfil-content">
      <div className="perfil-section-header">
        <div className="perfil-section-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>
        <div className="perfil-section-title">
          <h2>Configurações</h2>
          <p>Gerencie suas preferências de conta e notificações.</p>
        </div>
      </div>

      <div className="config-list">
        {configs.map(({ id, title, desc, on }) => (
          <div key={id} className="config-item">
            <div className="config-info">
              <h4>{title}</h4>
              <p>{desc}</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={on}
                onChange={() => toggle(id)}
              />
              <span className="toggle-track" />
            </label>
          </div>
        ))}
      </div>

      <div className="perfil-actions">
        <button className="perfil-btn-primary" onClick={salvar}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
          </svg>
          Salvar configurações
        </button>
      </div>
    </section>
  );
}
