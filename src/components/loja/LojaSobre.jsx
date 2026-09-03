import React from "react";

export default function LojaSobre({ descricao, endereco, telefone, email, horarios, aberto }) {
  const diaAtual = ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"][new Date().getDay()];

  return (
    <div className="loja-sobre">

      <div className="loja-sobre-card">
        <div className="loja-sobre-card-header">
          <i className="fas fa-store" />
          <h3>Sobre a loja</h3>
        </div>
        <p className="loja-sobre-texto">{descricao}</p>
      </div>

      <div className="loja-sobre-card">
        <div className="loja-sobre-card-header">
          <i className="fas fa-map-marker-alt" />
          <h3>Localização</h3>
        </div>
        <p className="loja-sobre-endereco">
          <i className="fas fa-location-dot" />
          {endereco}
        </p>
        <div className="loja-mapa-placeholder">
          <i className="fas fa-map" />
          <span>Mapa disponível em breve</span>
        </div>
      </div>

      {(telefone || email) && (
        <div className="loja-sobre-card">
          <div className="loja-sobre-card-header">
            <i className="fas fa-address-book" />
            <h3>Contato</h3>
          </div>
          <div className="loja-contato-lista">
            {telefone && (
              <a
                href={`https://wa.me/${telefone.replace(/\D/g, "")}`}
                className="loja-contato-item"
                target="_blank"
                rel="noreferrer"
              >
                <span className="loja-contato-ico whatsapp"><i className="fab fa-whatsapp" /></span>
                <div>
                  <strong>WhatsApp / Telefone</strong>
                  <span>{telefone}</span>
                </div>
                <i className="fas fa-arrow-right loja-contato-arrow" />
              </a>
            )}
            {email && (
              <a href={`mailto:${email}`} className="loja-contato-item">
                <span className="loja-contato-ico email"><i className="fas fa-envelope" /></span>
                <div>
                  <strong>E-mail</strong>
                  <span>{email}</span>
                </div>
                <i className="fas fa-arrow-right loja-contato-arrow" />
              </a>
            )}
          </div>
        </div>
      )}

      <div className="loja-sobre-card">
        <div className="loja-sobre-card-header">
          <i className="fas fa-clock" />
          <h3>Horário de funcionamento</h3>
          <span className={`loja-status-pill ${aberto ? "aberto" : "fechado"}`}>
            {aberto ? "Aberto agora" : "Fechado agora"}
          </span>
        </div>
        <div className="loja-horarios-lista">
          {horarios.map((h) => (
            <div key={h.dia} className={`loja-horario-row${h.dia === diaAtual ? " hoje" : ""}`}>
              <span className="loja-horario-dia">{h.dia}</span>
              {h.aberto
                ? <span className="loja-horario-hrs">{h.abre} – {h.fecha}</span>
                : <span className="loja-horario-fechado">Fechado</span>
              }
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
