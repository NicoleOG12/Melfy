export function abrirModalLogin(tipoUsuario) {
  console.log(tipoUsuario)
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
              <img src="../assents/img/Login/confeiteiraSlider1.png" data-tipo="confeiteira" alt="">
              <img src="../assents/img/Login/confeiteiraSlider2.png" data-tipo="confeiteira" alt="">
              <img src="../assents/img/Login/confeiteiraSlider3.jpg" data-tipo="confeiteira" alt="">
              <img src="../assents/img/Login/confeiteiraSlider4.jpg" data-tipo="confeiteira" alt="">
              
              <img src="../assents/img/Login/clienteSlider1.jpg" data-tipo="cliente" alt="">
              <img src="../assents/img/Login/clienteSlider2.png" data-tipo="cliente" alt="">
              <img src="../assents/img/Login/clienteSlider3.jpg" data-tipo="cliente" alt="">
              <img src="../assents/img/Login/clienteSlider4.png" data-tipo="cliente" alt="">
              
              <img src="../assents/img/Login/entregadorSlider1.png" data-tipo="entregador" alt="">
              <img src="../assents/img/Login/entregadorSlider2.jpg" data-tipo="entregador" alt="">
              <img src="../assents/img/Login/entregadorSlider3.png" data-tipo="entregador" alt="">
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
                  <button class="btn-login" id="btnLogin" data-id="${tipoUsuario}">Login</button>
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

    //lógica pra direcionar o fetch
     const btnLogin = document.getElementById("btnLogin");

     btnLogin.addEventListener("click", async () => {
       const tipoUsuario = btnLogin.dataset.id; 

       try {
         const API_URL = "https://melfy-backend-production.up.railway.app";
         var url;
         var nextPage;
         var token; 
         var info;

         if (tipoUsuario == "cliente") {
           url = API_URL + "/clientes/login";           
           nextPage = window.location.href;
           token = "tokenCliente";
           info = "infoCliente";
         } else if (tipoUsuario == "confeiteira") {
           url = API_URL + "/lojas/login";
           nextPage = `${baseURL}pages/confeiteira/home.html`;
           token = "tokenLoja";
           info = "infoLoja";
         } else if(tipoUsuario == "entregador"){
          url = API_URL + "/entregador/login";          
           nextPage = `${baseURL}pages/entregador/home.html`;           
           token = "tokenEntregador";
           info = "infoEntregador";
         }else {
           console.error("Tipo de usuário inválido:", tipoUsuario);
           
           return;
         }

      let email = document.getElementById("emailLogin").value.trim();
      let senha = document.getElementById("senhaLogin").value.trim();
         const res = await fetch(url, {
           method: "POST",
           headers: {
             "Content-Type": "application/json",
           },
           body: JSON.stringify({ 
            "email": email,
            "senha": senha
            }),
         });

         const data = await res.json();
         if(data.error == false){
            localStorage.setItem(token, data.token);
            localStorage.setItem(info, JSON.stringify(data.dados));
            alert("Login efetuado com sucesso!");
          window.location.href = nextPage;

         }else if(data.error == true){
            alert(data.mensagem)
         }
         console.log("Resposta:", data);
       } catch (error) {
         console.error("Erro no login:", error);
       }
     })



    //imagens do front
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
    }, 5000);

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
    }, 5000);
  }

  modalOverlay.style.display = 'flex';
}

function fecharModal(modalOverlay, sliderInterval, imagens, dotsContainer) {
  modalOverlay.style.display = 'none';
  clearInterval(sliderInterval);
  imagens.forEach((img, i) => img.classList.toggle('ativa', i === 0));
  dotsContainer.querySelectorAll('.dot').forEach((dot, i) => dot.classList.toggle('ativa', i === 0));
}


 