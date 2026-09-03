import React from "react";

export default function Footer() {
  const ano = new Date().getFullYear();

  return (
    <footer className="melfy-footer">
      <div className="container-header-and-footer">
        <div className="footer-grid">

          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <img src="/assents/img/Logo/melfy.svg" alt="Logo" className="footer-logo-image"/>
            </div>
            <p className="footer-description">
              Conectamos você aos melhores confeiteiros da sua região. Descubra
              sabores únicos e experiências doces inesquecíveis.
            </p>
            <div className="social-links">
              <a href="#" className="social-link"><i className="fab fa-instagram"></i></a>
              <a href="#" className="social-link"><i className="fab fa-facebook"></i></a>
              <a href="#" className="social-link"><i className="fab fa-whatsapp"></i></a>
            </div>
          </div>

          {/* Navegação */}
          <div className="footer-section">
            <h3>Navegação</h3>
            <div className="footer-links">
              <a href="/"        className="footer-link">Início</a>
              <a href="/doces"   className="footer-link">Doces</a>
              <a href="/sobre"   className="footer-link">Sobre nós</a>
              <a href="/contato" className="footer-link">Contato</a>
            </div>
          </div>

          {/* Suporte */}
          <div className="footer-section">
            <h3>Suporte</h3>
            <div className="footer-links">
              <a href="/faq"        className="footer-link">FAQ</a>
              <a href="/privacidade" className="footer-link">Privacidade</a>
              <a href="/termos"     className="footer-link">Termos</a>
              <a href="/trocas"     className="footer-link">Trocas</a>
            </div>
          </div>

          {/* Contato */}
          <div className="footer-section">
            <h3>Contato</h3>
            <div className="contact-info">
              <div className="contact-item">
                <i className="fas fa-phone contact-icon"></i>
                <span>(11) 95934-3957</span>
              </div>
              <div className="contact-item">
                <i className="fas fa-envelope contact-icon"></i>
                <span>melfy@gmail.com</span>
              </div>
              <div className="contact-item">
                <i className="fas fa-map-marker-alt contact-icon"></i>
                <span>Rua das Flores, nº 255<br />Jardim Rosinha, SP</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">© {ano} Melfy. Todos os direitos reservados.</p>
            <p className="heart-text">
              <span>Feito com</span>
              <i className="fas fa-heart heart-icon"></i>
              <span>para doces momentos</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
