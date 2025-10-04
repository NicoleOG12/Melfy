document.addEventListener('DOMContentLoaded', () => {
  const usuarioLogado = localStorage.getItem('usuarioLogado');
  const headerContainer = document.getElementById('header');

  if (!headerContainer) return;

  const headerNaoLogado = `
    <header>
      <div class="logo">
        <img src="img/Melfy-versão final.svg" alt="Logo" />
      </div>
      <nav>
        <a href="../index.html">Home</a>
        <a href="../confeitarias.html">Produtos</a>
        <a href="../sobre.html">Sobre</a>
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
      <div class="logo">
        <img src="img/Melfy-versão final.svg" alt="Logo" />
      </div>
      <nav>
        <a href="adicionarProdutos.html">Criar Produto</a>
        <a href="meusProdutos.html">Editar Produtos</a>
        <a href="pedidos.html">Pedidos</a>
        <a href="painelADM.html">Painel Administrativo</a>
        
        <div class="iconuser">
          <a href="./perfil.html" id="link-perfil"> 
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
});
