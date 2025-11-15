import { carregarTodosOsDados } from './dicionario.js';
import { abrirModalLogin } from './modalLogin.js';

document.addEventListener('DOMContentLoaded', () => {
  const baseURL = window.location.origin + "/";
  const confeiteiraLogada = JSON.parse(
    localStorage.getItem("infoLoja") || "null"
  );

  const clienteData = JSON.parse(localStorage.getItem("infoCliente") || "null");
  const usuarioLogado = Array.isArray(clienteData) ? clienteData[0] : null;

  const logoutBTN = document.getElementById("logoutBtn");


  if (!confeiteiraLogada) {
    const cssFiles = [
      `${baseURL}css/components.css`,
      `${baseURL}css/layout.css`,
      `${baseURL}css/base.css`
    ];
    cssFiles.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    });
  }

  carregarTodosOsDados();

  const headerContainer = document.getElementById('header');
  const footerContainer = document.getElementById('footer');

  const headerNaoLogado = `
    <header class="melfy-header">
      <div class="container-header-and-footer">
        <div class="header-content">
          <a href="${baseURL}index.html" class="header-logo">
            <img src="${baseURL}assents/img/Logo/logo-melfy-dark.svg" alt="Melfy" class="logo-image">
          </a>
          <nav class="nav-desktop">
            <a href="${baseURL}index.html" class="nav-link">Início</a>
            <a href="${baseURL}pages/cliente/doces.html" class="nav-link">Doces</a>
            <a href="${baseURL}pages/sobre.html" class="nav-link">Sobre</a>
          </nav>
          <div class="header-actions">
            <div class="user-dropdown-container">
              <button class="header-icon user-dropdown-toggle" id="userDropdownToggle" type="button">
                <i class="fas fa-user"></i>
              </button>
              <div class="user-dropdown-menu" id="userDropdownMenu">
                <a href="#" class="user-dropdown-item">Sou confeiteira</a>
                <a href="#" class="user-dropdown-item">Sou cliente</a>
                <a href="#" class="user-dropdown-item">Sou entregador</a>
              </div>
            </div>
            <button class="mobile-menu-toggle" id="mobileMenuToggle">
              <i class="fas fa-bars"></i>
            </button>
          </div>
        </div>
        <div class="mobile-menu" id="mobileMenu">
          <nav class="mobile-nav">
            <a href="${baseURL}index.html" class="mobile-nav-link">Início</a>
            <a href="${baseURL}pages/cliente/doces.html" class="mobile-nav-link">Doces</a>
            <a href="${baseURL}pages/sobre.html" class="mobile-nav-link">Sobre</a>
          </nav>
        </div>
      </div>
    </header>
  `;

  const headerLogado = `
    <header class="melfy-header">
      <div class="container-header-and-footer">
        <div class="header-content">
          <a href="${baseURL}index.html" class="header-logo">
            <img src="${baseURL}assents/img/Logo/logo-melfy-dark.svg" alt="Melfy" class="logo-image">
          </a>
          <nav class="nav-desktop">
            <a href="${baseURL}index.html" class="nav-link">Início</a>
            <a href="${baseURL}pages/cliente/doces.html" class="nav-link">Doces</a>
            <a href="${baseURL}pages/sobre.html" class="nav-link">Sobre</a>
          </nav>
          <div class="header-actions">
            <a href="${baseURL}pages/cliente/carrinho.html" class="header-icon">
              <i class="fas fa-shopping-bag"></i>
              <span class="cart-count" id="cartCount"></span>
            </a>
            <a href="${baseURL}pages/cliente/perfil.html" class="user-profile">
              <div class="user-avatar">
                <i class="fas fa-user"></i>
              </div>
              <span class="user-name">${usuarioLogado?.nome || 'Usuário'}</span>
            </a>
            <button class="mobile-menu-toggle" id="mobileMenuToggle">
              <i class="fas fa-bars"></i>
            </button>
          </div>
        </div>
        <div class="mobile-menu" id="mobileMenu">
          <nav class="mobile-nav">
            <a href="index.html" class="mobile-nav-link">Início</a>
            <a href="doces.html" class="mobile-nav-link">Doces</a>
            <a href="sobre.html" class="mobile-nav-link">Sobre</a>
          </nav>
        </div>
      </div>
    </header>
  `;

  if (!confeiteiraLogada || confeiteiraLogada == "") {
    if (headerContainer) headerContainer.innerHTML = usuarioLogado ? headerLogado : headerNaoLogado;

    if (
      (!usuarioLogado && headerContainer) ||
      (usuarioLogado == "" && headerContainer)
    ) {
      const dropdownToggle = headerContainer.querySelector(
        "#userDropdownToggle"
      );
      const dropdownMenu = headerContainer.querySelector("#userDropdownMenu");

      if (dropdownToggle && dropdownMenu) {
        dropdownToggle.addEventListener("click", (e) => {
          e.stopPropagation();
          dropdownMenu.classList.toggle("active");
        });

        document.addEventListener("click", (e) => {
          if (
            !dropdownToggle.contains(e.target) &&
            !dropdownMenu.contains(e.target)
          ) {
            dropdownMenu.classList.remove("active");
          }
        });

        const dropdownLinks = dropdownMenu.querySelectorAll(
          ".user-dropdown-item"
        );
        dropdownLinks.forEach((link) => {
          link.addEventListener("click", (e) => {
            e.preventDefault();
            dropdownMenu.classList.remove("active");
            let tipoUsuario = "";
            if (link.textContent.includes("confeiteira"))
              tipoUsuario = "confeiteira";
            else if (link.textContent.includes("cliente"))
              tipoUsuario = "cliente";
            else if (link.textContent.includes("entregador"))
              tipoUsuario = "entregador";
            abrirModalLogin(tipoUsuario);
          });
        });
      }
    }

    if (usuarioLogado && headerContainer) {
      const nomeElem = headerContainer.querySelector('.nomeuser');
      if (nomeElem) nomeElem.textContent = usuarioLogado.nome || 'Usuário';
      window.atualizarContadorSacola = function () {
        const sacola = JSON.parse(localStorage.getItem('Sacola')) || [];
        const totalItens = sacola.filter(item => item.idUsuario === usuarioLogado.id)
          .reduce((acc, item) => acc + item.quantidade, 0);
        const contador = document.getElementById('contador-sacola');
        if (!contador) return;
        if (totalItens > 0) {
          contador.textContent = totalItens;
          contador.style.display = 'inline-block';
        } else {
          contador.style.display = 'none';
        }
      };
      atualizarContadorSacola();
      window.addEventListener('storage', e => {
        if (e.key === 'Sacola') atualizarContadorSacola();
      });
    }
  }

  if (footerContainer) {
    footerContainer.innerHTML = `
      <footer class="melfy-footer">
        <div class="container-header-and-footer">
          <div class="footer-grid">
            <div class="footer-brand">
              <div class="footer-logo">
                <img src="${baseURL}assents/img/Geral/Melfy-versão final.svg" alt="Logo" class="footer-logo-image" />
              </div>
              <p class="footer-description">
                Conectamos você aos melhores confeiteiros da sua região. Descubra sabores únicos e experiências doces inesquecíveis.
              </p>
              <div class="social-links">
                <a href="#" class="social-link"><i class="fab fa-instagram"></i></a>
                <a href="#" class="social-link"><i class="fab fa-facebook"></i></a>
                <a href="#" class="social-link"><i class="fab fa-whatsapp"></i></a>
              </div>
            </div>
            <div class="footer-section">
              <h3>Navegação</h3>
              <div class="footer-links">
                <a href="${baseURL}index.html" class="footer-link">Início</a>
                <a href="${baseURL}pages/cliente/doces.html" class="footer-link">Doces</a>
                <a href="${baseURL}pages/sobre.html" class="footer-link">Sobre nós</a>
                <a href="${baseURL}pages/cliente/contato.html" class="footer-link">Contato</a>
              </div>
            </div>
            <div class="footer-section">
              <h3>Suporte</h3>
              <div class="footer-links">
                <a href="${baseURL}pages/cliente/faq.html" class="footer-link">FAQ</a>
                <a href="${baseURL}pages/cliente/privacidade.html" class="footer-link">Privacidade</a>
                <a href="${baseURL}pages/cliente/termos.html" class="footer-link">Termos</a>
                <a href="${baseURL}pages/cliente/trocas.html" class="footer-link">Trocas</a>
              </div>
            </div>
            <div class="footer-section">
              <h3>Contato</h3>
              <div class="contact-info">
                <div class="contact-item"><i class="fas fa-phone contact-icon"></i><span>(11) 95934-3957</span></div>
                <div class="contact-item"><i class="fas fa-envelope contact-icon"></i><span>melfy@gmail.com</span></div>
                <div class="contact-item"><i class="fas fa-map-marker-alt contact-icon"></i><span>Rua das Flores, nº 255<br>Jardim Rosinha, SP</span></div>
              </div>
            </div>
          </div>
          <div class="footer-bottom">
            <div class="footer-bottom-content">
              <p class="copyright">© ${new Date().getFullYear()} Melfy. Todos os direitos reservados.</p>
              <p class="heart-text"><span>Feito com</span><i class="fas fa-heart heart-icon"></i><span>para doces momentos</span></p>
            </div>
          </div>
        </div>
      </footer>
    `;
  }

  const linkPerfil = document.getElementById('link-perfil');
  if (linkPerfil) {
    linkPerfil.addEventListener('click', e => {
      e.preventDefault();
      if (confeiteiraLogada) {
        window.location.href = `${baseURL}pages/cliente/perfil.html`;
      } else {
        window.location.href = usuarioLogado ? `${baseURL}pages/cliente/perfil.html` : `${baseURL}pages/login.html`;
      }
    });
  }

  if (headerContainer) {
    const linksNav = headerContainer.querySelectorAll('nav a');
    linksNav.forEach(link => {
      const linkHref = link.getAttribute('href');
      const currentPage = window.location.pathname.split('/').pop();
      if (linkHref && linkHref.endsWith(currentPage)) link.classList.add('ativo');
    });
  }

  if (confeiteiraLogada) {
    const trySetName = () => {
      const el = document.querySelector('.user-info .user-name');
      if (el) {
        el.textContent = confeiteiraLogada.nome || 'Confeiteira';
        return true;
      }
      return false;
    };

    if (!trySetName()) {
      let attempts = 0;
      const maxAttempts = 50;
      const interval = setInterval(() => {
        attempts++;
        if (trySetName() || attempts >= maxAttempts) {
          clearInterval(interval);
        }
      }, 100);

      const observer = new MutationObserver((mutations, obs) => {
        if (trySetName()) {
          obs.disconnect();
          clearInterval(interval);
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }
});
