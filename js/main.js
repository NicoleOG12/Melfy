import { carregarTodosOsDados } from './dicionario.js';

document.addEventListener('DOMContentLoaded', () => {
  const baseURL = window.location.origin + "/";

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

  carregarTodosOsDados();
});

document.addEventListener('DOMContentLoaded', () => {
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  const confeiteiraLogada = JSON.parse(localStorage.getItem('confeiteiraLogada'));
  const headerContainer = document.getElementById('header');
  const footerContainer = document.getElementById('footer');

  if (!headerContainer) return;

  const baseURL = window.location.origin + "/";

  const headerNaoLogado = `
    <header>
      <div class="header-top">
        <div class="logo">
          <img src="${baseURL}assents/img/Geral/Melfy-versão final.svg" alt="Logo" />
        </div>
        <div class="menu-toggle" id="menu-toggle">
          <span></span><span></span><span></span>
        </div>
      </div>
      <nav>
        <a href="${baseURL}index.html">Home</a>
        <a href="${baseURL}pages/cliente/doces.html">Doces</a>
        <a href="${baseURL}pages/sobre.html">Sobre</a>
        <a href="${baseURL}pages/login.html">Login</a>
      </nav>
    </header>
  `;

  const headerLogado = `
    <header>
      <div class="header-top">
        <div class="logo">
          <img src="${baseURL}assents/img/Geral/Melfy-versão final.svg" alt="Logo" />
        </div>
        <div class="menu-toggle" id="menu-toggle">
          <span></span><span></span><span></span>
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
    </header>
  `;

      // <div id="toggle-dark-mode" class="toggle-btn" aria-pressed="false">
      //   <div class="toggle-icon"></div>
      // </div>

  const headerConfeiteira = `
    <header>
      <div class="header-top">
        <div class="logo">
          <img src="${baseURL}assents/img/Geral/Melfy-versão final.svg" alt="Logo" />
        </div>
        <div class="menu-toggle" id="menu-toggle">
          <span></span><span></span><span></span>
        </div>
      </div>
      <nav>
        <a href="${baseURL}pages/confeiteira/adicionarProdutos.html">Criar Produto</a>
        <a href="${baseURL}pages/confeiteira/meusProdutos.html">Editar Produtos</a>
        <a href="${baseURL}pages/confeiteira/pedidos.html">Pedidos</a>
        <a href="${baseURL}pages/confeiteira/painelADM.html">Painel Administrativo</a>
        <div class="iconuser">
          <a href="${baseURL}pages/cliente/perfil.html" id="link-perfil"> 
            <i class="fas fa-user"></i>
          </a>
          <p class="nomeuser">Nome</p>
        </div>
      </nav>
    </header>
  `;

  if (confeiteiraLogada) {
    headerContainer.innerHTML = headerConfeiteira;
    const nomeElem = headerContainer.querySelector('.nomeuser');
    if (nomeElem) nomeElem.textContent = confeiteiraLogada.nome || 'Confeiteira';
  } else {
    headerContainer.innerHTML = usuarioLogado ? headerLogado : headerNaoLogado;
    if (usuarioLogado) {
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
      window.addEventListener('storage', (e) => {
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
                <a href="#" class="social-link">
                  <i class="fab fa-instagram"></i>
                </a>
                <a href="#" class="social-link">
                  <i class="fab fa-facebook"></i>
                </a>
                <a href="#" class="social-link">
                  <i class="fab fa-whatsapp"></i>
                </a>
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
                <div class="contact-item">
                  <i class="fas fa-phone contact-icon"></i>
                  <span>(11) 95934-3957</span>
                </div>
                <div class="contact-item">
                  <i class="fas fa-envelope contact-icon"></i>
                  <span>melfy@gmail.com</span>
                </div>
                <div class="contact-item">
                  <i class="fas fa-map-marker-alt contact-icon"></i>
                  <span>Rua das Flores, nº 255<br>Jardim Rosinha, SP</span>
                </div>
              </div>
            </div>
          </div>
  
          <div class="footer-bottom">
            <div class="footer-bottom-content">
              <p class="copyright">
                © ${new Date().getFullYear()} Melfy. Todos os direitos reservados.
              </p>
              <p class="heart-text">
                <span>Feito com</span>
                <i class="fas fa-heart heart-icon"></i>
                <span>para doces momentos</span>
              </p>
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

  const linksNav = headerContainer.querySelectorAll('nav a');
  linksNav.forEach(link => {
    const linkHref = link.getAttribute('href');
    const currentPage = window.location.pathname.split('/').pop();
    if (linkHref.endsWith(currentPage)) link.classList.add('ativo');
  });
});

