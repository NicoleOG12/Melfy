export function abrirModalLogin(tipoUsuario) {
  let modalOverlay = document.getElementById('loginModalOverlay');
  const baseURL = window.location.origin + "/";

  if (!document.getElementById('modalLoginCSS')) {
    const link = document.createElement('link');
    link.id = 'modalLoginCSS';
    link.rel = 'stylesheet';
    link.href = `${baseURL}css/modalLogin.css`;
    document.head.appendChild(link);
  }

  if (!modalOverlay) {
    const modalHTML = `
      <div id="loginModalOverlay" class="modal-overlay">
        <div class="login-modal">
          <section class="container-modal">
            <div class="image-slider">
              <img src="/assents/img/Login/confeiteira1.png" data-tipo="confeiteira" alt="">
              <img src="/assents/img/Login/confeiteira2.png" data-tipo="confeiteira" alt="">
              <img src="/assents/img/Login/confeiteira3.png" data-tipo="confeiteira" alt="">
              
              <img src="/assents/img/Login/cliente1.png" data-tipo="cliente" alt="">
              <img src="/assents/img/Login/cliente2.png" data-tipo="cliente" alt="">
              <img src="/assents/img/Login/cliente3.png" data-tipo="cliente" alt="">
              
              <img src="/assents/img/Login/entregador1.png" data-tipo="entregador" alt="">
              <img src="/assents/img/Login/entregador2.png" data-tipo="entregador" alt="">
              <img src="/assents/img/Login/entregador3.png" data-tipo="entregador" alt="">
              <div class="slider-indicadores"></div>
            </div>

            <div class="login">
              <h1 class="titulo-login">Faça o seu login!</h1>
              <div class="input-group">
                <div class="input-container">
                  <i class="fa-solid fa-envelope icon"></i>
                  <input type="email" placeholder="E-mail" id="emailLogin" name="email" autocomplete="off" />
                </div>
                <div class="input-container">
                  <i class="fa-solid fa-lock icon"></i>
                  <input type="password" placeholder="Senha" id="senhaLogin" class="input-pass" name="senha" autocomplete="off" />
                  <button type="button" class="visible-pass" id="togglePassword" aria-label="Mostrar senha">
                    <i class="fa-regular fa-eye"></i>
                  </button>
                </div>
                <a href="#" class="recup-senha">Esqueceu sua senha?</a>
                <div class="container-button">
                  <button class="btn-login" id="btnLogin" data-id="${tipoUsuario}">
                    Login
                  </button>
                </div>
                <a href="../../pages/cadastro.html" class="cadastro">
                  Ainda não possui uma conta? <br>
                  <strong class="cadastro-strong">Cadastre-se aqui</strong>
                </a>
              </div>
            </div>

            <button class="modal-close" id="closeLoginModal" aria-label="Fechar modal">×</button>
          </section>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    modalOverlay = document.getElementById('loginModalOverlay');
  }

  const modal = modalOverlay.querySelector('.login-modal');
  const emailInput = modal.querySelector("#emailLogin");
  const senhaInput = modal.querySelector("#senhaLogin");
  if (emailInput) emailInput.value = "";
  if (senhaInput) senhaInput.value = "";

  const imagens = modal.querySelectorAll('.image-slider img');
  const dotsContainer = modal.querySelector('.slider-indicadores');
  const imagensAtivas = Array.from(imagens).filter(img => img.dataset.tipo === tipoUsuario);

  imagens.forEach(img => img.classList.remove('ativa'));
  imagensAtivas.forEach((img, i) => img.style.display = 'none');
  imagensAtivas[0].style.display = 'block';
  imagensAtivas[0].classList.add('ativa');

  dotsContainer.innerHTML = '';
  imagensAtivas.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('ativa');
    dotsContainer.appendChild(dot);
  });

  let indexAtual = 0;
  const sliderInterval = setInterval(() => {
    imagensAtivas.forEach((img, i) => {
      if (i === indexAtual % imagensAtivas.length) {
        img.style.display = 'block';
        img.classList.add('ativa');
      } else {
        img.style.display = 'none';
        img.classList.remove('ativa');
      }
    });
    dotsContainer.querySelectorAll('.dot').forEach((dot, i) =>
      dot.classList.toggle('ativa', i === indexAtual % imagensAtivas.length)
    );
    indexAtual++;
  }, 5000);

  function fecharModal() {
    modalOverlay.style.display = 'none';
    clearInterval(sliderInterval);
    imagens.forEach((img, i) => {
      img.style.display = (i === 0 ? 'block' : 'none');
      img.classList.toggle('ativa', i === 0);
    });
    dotsContainer.querySelectorAll('.dot').forEach((dot, i) =>
      dot.classList.toggle('ativa', i === 0)
    );
  }

  modalOverlay.querySelector('#closeLoginModal').addEventListener('click', fecharModal);
  modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) fecharModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === "Escape") fecharModal(); });

  const togglePass = modal.querySelector('#togglePassword');
  togglePass.addEventListener('click', () => {
    const type = senhaInput.type === 'password' ? 'text' : 'password';
    senhaInput.type = type;
    togglePass.innerHTML =
      type === 'password'
        ? '<i class="fa-regular fa-eye"></i>'
        : '<i class="fa-regular fa-eye-slash"></i>';
  });

  const btnLogin = modal.querySelector("#btnLogin");
  btnLogin.addEventListener("click", async () => {
    if (btnLogin.disabled) return;

    const originalText = btnLogin.textContent;
    btnLogin.disabled = true;
    btnLogin.innerHTML = `
      <i class="fa-solid fa-spinner fa-spin btn-loading-icon"></i>
      <span class="btn-loading-text">Carregando...</span>
    `;

    const tipoUsuario = btnLogin.dataset.id;

    try {
      const API_URL = "https://melfy-backend-production.up.railway.app";
      let url, nextPage, token, info;

      if (tipoUsuario === "cliente") {
        url = API_URL + "/clientes/login";
        nextPage = `${baseURL}pages/cliente/doces.html`;
        token = "tokenCliente";
        info = "infoCliente";
      } else if (tipoUsuario === "confeiteira") {
        url = API_URL + "/lojas/login";
        nextPage = `${baseURL}pages/confeiteira/home.html`;
        token = "tokenLoja";
        info = "infoLoja";
      } else if (tipoUsuario === "entregador") {
        localStorage.setItem("tokenEntregador", "tokenSimulado");
        localStorage.setItem("infoEntregador", JSON.stringify({ nome: "Entregador Simulado" }));
        alert("Login efetuado com sucesso!");
        window.location.href = "https://melfy-entregador.vercel.app/";
        return;
      } else {
        return;
      }

      const email = emailInput.value.trim();
      const senha = senhaInput.value.trim();

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await res.json();

      if (data.error === false) {
        localStorage.setItem(token, data.token);
        localStorage.setItem(info, JSON.stringify(data.dados));
        alert("Login efetuado com sucesso!");
        window.location.href = nextPage;
      } else {
        alert(data.mensagem);
        btnLogin.disabled = false;
        btnLogin.textContent = originalText;
      }
    } catch (error) {
      console.error("Erro no login:", error);
      btnLogin.disabled = false;
      btnLogin.textContent = originalText;
    }
  });

  modalOverlay.style.display = 'flex';
}