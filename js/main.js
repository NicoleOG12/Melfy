document.addEventListener('DOMContentLoaded', () => {
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  const headerContainer = document.getElementById('header');
  const footerContainer = document.getElementById('footer');

  if (!headerContainer) return;

  // 🔹 Base da URL (ex: http://localhost:5500/ ou https://melfy.com/)
  const baseURL = window.location.origin + "/";

  const headerNaoLogado = `
    <header>
      <div class="header-top">
        <div class="logo">
          <img src="${baseURL}assents/img/Geral/Melfy-versão final.svg" alt="Logo" />
        </div>
        <div class="menu-toggle" id="menu-toggle">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <nav>
        <a href="${baseURL}index.html">Home</a>
        <a href="${baseURL}pages/cliente/doces.html">Doces</a>
        <a href="${baseURL}sobre.html">Sobre</a>
        <a href="${baseURL}pages/login.html">Login</a>
        <div class="iconuser">
          <a href="${baseURL}pages/perfil.html" id="link-perfil"> 
            <i class="fas fa-user"></i>
          </a>
        </div>
      </nav>
      <div id="toggle-dark-mode" class="toggle-btn" aria-pressed="false">
        <div class="toggle-icon"></div>
      </div>
    </header>
  `;

  const headerLogado = `
    <header>
      <div class="header-top">
        <div class="logo">
          <img src="${baseURL}assents/img/Geral/Melfy-versão final.svg" alt="Logo" />
        </div>
        <div class="menu-toggle" id="menu-toggle">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <nav>
        <a href="${baseURL}index.html">Home</a>
        <a href="${baseURL}pages/cliente/doces.html">Doces</a>
        <a href="${baseURL}pages/cliente/pedidos.html">Meus Pedidos</a>
        <div class="iconbag" style="position: relative;">
          <a href="${baseURL}pages/cliente/carrinho.html"> 
            <i class="fas fa-shopping-bag"></i>
            <span id="contador-sacola" class="contador-sacola">0</span>
          </a>
        </div>
        <div class="iconuser">
          <a href="${baseURL}pages/cliente/perfil.html" id="link-perfil"> 
            <i class="fas fa-user"></i>
          </a>
          <p class="nomeuser">Nome</p>
        </div>
      </nav>
      <div id="toggle-dark-mode" class="toggle-btn" aria-pressed="false">
        <div class="toggle-icon"></div>
      </div>
    </header>
  `;

  headerContainer.innerHTML = usuarioLogado ? headerLogado : headerNaoLogado;

  if (footerContainer) {
    footerContainer.innerHTML = `
      <footer class="footer">
        <div class="footer-top">
          <div class="social-icons">
            <a href="#"><img src="${baseURL}assents/img/Geral/Instagram.svg" alt="Instagram" /></a>
            <a href="#"><img src="${baseURL}assents/img/Geral/Facebook.svg" alt="Facebook" /></a>
            <a href="#"><img src="${baseURL}assents/img/Geral/Linkedin.svg" alt="LinkedIn" /></a>
          </div>
          <p>Rua das Flores, nº 255, Jardim Rosinha, SP, Brasil</p>
          <p>
            <i class="fas fa-phone-alt"></i> (11) 959343957 &nbsp;
            <i class="fas fa-envelope"></i> melfy@gmail.com
          </p>
        </div>
        <div class="footer-bottom">
          <a href="#">Política de Privacidade</a>
          <span>© Copyright, 2025</span>
          <a href="#">Termos e Condições</a>
        </div>
      </footer>
    `;
  }

  if (usuarioLogado) {
    const nomeUserElem = headerContainer.querySelector('.nomeuser');
    if (nomeUserElem) nomeUserElem.textContent = usuarioLogado.nome || 'Usuário';
  }

  window.atualizarContadorSacola = function () {
    if (!usuarioLogado) return;
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

  window.addEventListener('storage', (e) => {
    if (e.key === 'Sacola') atualizarContadorSacola();
  });

  const linkPerfil = document.getElementById('link-perfil');
  if (linkPerfil) {
    linkPerfil.addEventListener('click', e => {
      e.preventDefault();
      window.location.href = usuarioLogado ? `${baseURL}pages/cliente/perfil.html` : `${baseURL}pages/login.html`;
    });
  }

  const menuToggle = document.getElementById('menu-toggle');
  const nav = headerContainer.querySelector('nav');
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      nav.classList.toggle('active');
      menuToggle.classList.toggle('open');
    });
  }

  const linksNav = headerContainer.querySelectorAll('nav a');
  linksNav.forEach(link => {
    const linkHref = link.getAttribute('href');
    const currentPage = window.location.pathname.split('/').pop();
    if (linkHref.endsWith(currentPage)) link.classList.add('ativo');
  });
});
