export function abrirModalLogin(tipoUsuario = 'cliente') {
  let modalOverlay = document.getElementById('loginModalOverlay');

  if (!modalOverlay) {
    const modalHTML = `
      <div id="loginModalOverlay" class="modal-overlay">
        <div class="login-modal">
          <section class="container-modal">
            <div class="image-slider">
              <img src="../assents/img/Geral/confeiteira1.png" data-tipo="confeiteira" alt="">
              <img src="../assents/img/Geral/confeiteira2.png" data-tipo="confeiteira" alt="">
              <img src="../assents/img/Geral/confeiteira3.png" data-tipo="confeiteira" alt="">
              
              <img src="../assents/img/Geral/cliente1.png" data-tipo="cliente" alt="">
              <img src="../assents/img/Geral/cliente2.png" data-tipo="cliente" alt="">
              <img src="../assents/img/Geral/cliente3.png" data-tipo="cliente" alt="">
              
              <img src="../assents/img/Geral/entregador1.png" data-tipo="entregador" alt="">
              <img src="../assents/img/Geral/entregador2.png" data-tipo="entregador" alt="">
              <img src="../assents/img/Geral/entregador3.png" data-tipo="entregador" alt="">
              <div class="slider-indicadores"></div>
            </div>

            <div class="login">
              <h1 class="titulo-login">Faça o seu login!</h1>
              <div class="input-group">
                <div class="input-container">
                  <i class="fa-solid fa-envelope icon"></i>
                  <input type="email" placeholder="E-mail" id="emailLogin" name="email" />
                </div>
                <div class="input-container">
                  <i class="fa-solid fa-lock icon"></i>
                  <input type="password" placeholder="Senha" id="senhaLogin" class="input-pass" name="senha" />
                  <button type="button" class="visible-pass" id="togglePassword" aria-label="Mostrar senha">
                    <i class="fa-regular fa-eye"></i>
                  </button>
                </div>
                <a href="#" class="recup-senha">Esqueceu sua senha?</a>
                <div class="container-button">
                  <button class="btn-login" id="btnLogin">Login</button>
                </div>
                <p class="cadastro">
                  Ainda não possui uma conta? <br>
                  <strong class="cadastro-strong">Cadastre-se aqui</strong>
                </p>
              </div>
            </div>

            <button class="modal-close" id="closeLoginModal" aria-label="Fechar modal">×</button>
          </section>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    modalOverlay = document.getElementById('loginModalOverlay');

    const modal = modalOverlay.querySelector('.login-modal');
    const imagens = modal.querySelectorAll('.image-slider img');
    const dotsContainer = modal.querySelector('.slider-indicadores');

    const imagensAtivas = Array.from(imagens).filter(img => img.dataset.tipo === tipoUsuario);
    dotsContainer.innerHTML = '';

    imagensAtivas.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (i === 0) dot.classList.add('ativa');
      dotsContainer.appendChild(dot);
    });

    let indexAtual = 0;
    const sliderInterval = setInterval(() => {
      imagensAtivas.forEach((img, i) => img.classList.toggle('ativa', i === indexAtual % imagensAtivas.length));
      dotsContainer.querySelectorAll('.dot').forEach((dot, i) => dot.classList.toggle('ativa', i === indexAtual % imagensAtivas.length));
      indexAtual++;
    }, 3000);

    const closeBtn = modalOverlay.querySelector('#closeLoginModal');
    closeBtn.addEventListener('click', () => fecharModal(modalOverlay, sliderInterval, imagens, dotsContainer));

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) fecharModal(modalOverlay, sliderInterval, imagens, dotsContainer);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === "Escape") fecharModal(modalOverlay, sliderInterval, imagens, dotsContainer);
    });

    const togglePass = modal.querySelector('#togglePassword');
    const senhaInput = modal.querySelector('#senhaLogin');
    togglePass.addEventListener('click', () => {
      const type = senhaInput.type === 'password' ? 'text' : 'password';
      senhaInput.type = type;
      togglePass.innerHTML = type === 'password'
        ? '<i class="fa-regular fa-eye"></i>'
        : '<i class="fa-regular fa-eye-slash"></i>';
    });
  } else {
    const imagens = modalOverlay.querySelectorAll('.image-slider img');
    const dotsContainer = modalOverlay.querySelector('.slider-indicadores');

    const imagensAtivas = Array.from(imagens).filter(img => img.dataset.tipo === tipoUsuario);
    imagens.forEach(img => img.classList.remove('ativa'));
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
      imagensAtivas.forEach((img, i) => img.classList.toggle('ativa', i === indexAtual % imagensAtivas.length));
      dotsContainer.querySelectorAll('.dot').forEach((dot, i) => dot.classList.toggle('ativa', i === indexAtual % imagensAtivas.length));
      indexAtual++;
    }, 3000);
  }

  modalOverlay.style.display = 'flex';
}

function fecharModal(modalOverlay, sliderInterval, imagens, dotsContainer) {
  modalOverlay.style.display = 'none';
  clearInterval(sliderInterval);
  imagens.forEach((img, i) => img.classList.toggle('ativa', i === 0));
  dotsContainer.querySelectorAll('.dot').forEach((dot, i) => dot.classList.toggle('ativa', i === 0));
}
