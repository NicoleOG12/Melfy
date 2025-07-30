document.addEventListener('DOMContentLoaded', () => {
  const usuarioLogado = localStorage.getItem('usuarioLogado');
  const headerContainer = document.getElementById('header');

  if (!headerContainer) return;

  const headerNaoLogado = `
    <header>
      <div class="header-top">
        <div class="logo">
          <img src="img/Melfy-versão final.svg" alt="Logo" />
        </div>
        <div class="menu-toggle" id="menu-toggle">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <nav>
        <a href="index.html">Home</a>
        <a href="confeitarias.html">Produtos</a>
        <a href="sobre.html">Sobre</a>
        <a href="login.html">Login</a>
        <div class="iconuser">
          <a href="login.html" id="link-perfil"><img src="./img/Perfil.svg" alt="Perfil" /></a>
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
          <img src="img/Melfy-versão final.svg" alt="Logo" />
        </div>
        <div class="menu-toggle" id="menu-toggle">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <nav>
        <a href="home.html">Home</a>
        <a href="confeitarias.html">Produtos</a>
        <a href="pedidos.html">Meus Pedidos</a>
        <div class="iconbag">
          <a href="carrinho.html"> 
            <i class="fas fa-shopping-bag"></i>
          </a>
        </div>
        <div class="iconuser">
          <a href="perfil.html" id="link-perfil"> 
            <img src="./img/Perfil.svg" alt="Perfil" />
          </a>
        </div>
      </nav>
      <div id="toggle-dark-mode" class="toggle-btn" aria-pressed="false">
        <div class="toggle-icon"></div>
      </div>
    </header>
  `;

  headerContainer.innerHTML = usuarioLogado ? headerLogado : headerNaoLogado;

  const linkPerfil = document.getElementById('link-perfil');
  if (linkPerfil) {
    linkPerfil.addEventListener('click', (e) => {
      e.preventDefault();
      if (usuarioLogado) {
        window.location.href = 'perfil.html';
      } else {
        window.location.href = 'login.html';
      }
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
});
