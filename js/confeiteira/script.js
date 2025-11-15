document.addEventListener('DOMContentLoaded', () => {





  const hamburger = document.getElementById('hamburger');
  const sidebar = document.querySelector('.sidebar');
  

  hamburger.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    hamburger.classList.toggle('open');
  });

  const navItems = document.querySelectorAll('.nav-menu .nav-item');
  const sections = document.querySelectorAll('main > section');
  let activeSection = null;

  function showSection(targetId) {
    sections.forEach(sec => {
      sec.style.display = sec.id === targetId ? 'block' : 'none';
      if (sec.id === targetId) activeSection = sec;
    });
    navItems.forEach(item =>
      item.classList.toggle('active', item.getAttribute('href') === `#${targetId}`)
    );
  }

  navItems.forEach(item => {
    const href = item.getAttribute('href');
    if (href && href.startsWith('#')) {
      item.addEventListener('click', e => {
        e.preventDefault();
        showSection(href.substring(1));
      });
    }
  });

  if (sections.length) showSection(sections[0].id);

  const tipsOverlay = document.createElement('div');
  tipsOverlay.classList.add('tips-overlay');
  tipsOverlay.style.display = 'none';
  document.body.appendChild(tipsOverlay);

  const tipsPopup = document.createElement('div');
  tipsPopup.classList.add('tips-popup');
  tipsPopup.style.display = 'none';
  tipsPopup.innerHTML = `
    <button class="tips-close">&times;</button>
    <div class="tips-left">
      <h3 class="tips-title">Dicas rápidas</h3>
      <ul>
        <li>Abra o mapa antes de aceitar se precisar conferir rota</li>
        <li>Mantenha o app atualizado para garantir pagamento</li>
        <li>Priorize entregas com alta avaliação do cliente</li>
      </ul>
    </div>
    <div class="tips-right">
      <img src="./img/Abelha Motoqueira.png" alt="Dicas" />
    </div>
  `;
  document.body.appendChild(tipsPopup);

  tipsOverlay.addEventListener('click', () => {
    tipsPopup.style.display = 'none';
    tipsOverlay.style.display = 'none';
  });

  const closeBtn = tipsPopup.querySelector('.tips-close');
  closeBtn.addEventListener('click', e => {
    e.stopPropagation();
    tipsPopup.style.display = 'none';
    tipsOverlay.style.display = 'none';
  });

  const helpIcon = document.createElement('i');
  helpIcon.setAttribute('data-lucide', 'help-circle');
  helpIcon.classList.add('help-icon');
  document.body.appendChild(helpIcon);

  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }

  const realIcon = document.querySelector('.help-icon');
  realIcon.addEventListener('click', () => {
    const rect = realIcon.getBoundingClientRect();

    tipsOverlay.style.display = 'block';
    tipsPopup.style.display = 'flex';
    tipsPopup.style.visibility = 'hidden';
    tipsPopup.style.position = 'fixed';
    tipsPopup.style.zIndex = '999999';

    requestAnimationFrame(() => {
      const popupWidth = tipsPopup.offsetWidth;
      const popupHeight = tipsPopup.offsetHeight;

      let left = rect.left - popupWidth - 12;
      if (left < 8) left = 8;

      let top = rect.top + rect.height / 2 - popupHeight / 2;
      if (top < 8) top = 8;

      tipsPopup.style.left = `${left}px`;
      tipsPopup.style.top = `${top}px`;
      tipsPopup.style.visibility = 'visible';
    });
  });
  

});









document.addEventListener("DOMContentLoaded", async () => {
  const baseURL = window.location.origin + "/";
  const lojaNome = document.getElementById("lojaNome");
  const lojaPFP = document.getElementById("lojaPFP");
  const API_URL = "https://melfy-backend-production.up.railway.app";

  var dados = JSON.parse(localStorage.getItem("infoLoja"));
  lojaNome.textContent = "";
  lojaNome.textContent = dados[0].nome;
  lojaPFP.src = dados[0].pfp;

  const res = await fetch(`${API_URL}/pedidos`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("tokenLoja")}`,
    },
  });

  let data = null;

  if (res.ok) {
    const text = await res.text();

    if (text.trim() !== "") {
      data = JSON.parse(text);
    } else {
      data = null;
    }
  } else {
    console.error("Erro na API:", res.status);
    data = null;
  }

  if (Array.isArray(pedidos) && pedidos.length > 0) {
    localStorage.setItem("pedidos", JSON.stringify(pedidos));
  }

  const logoutBtn = document.getElementById("logoutBtn");

  logoutBtn.addEventListener("click", (event) => {
    event.preventDefault();
    alert("Você será deslogado. Até mais!");
    localStorage.removeItem("tokenLoja");
    localStorage.removeItem("infoLoja");
    window.location.href = `${baseURL}`;
  });
});
















