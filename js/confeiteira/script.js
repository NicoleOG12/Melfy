document.addEventListener('DOMContentLoaded', async () => {
  const baseURL = window.location.origin + "/";
  const hamburger = document.getElementById('hamburger');
  const sidebar = document.querySelector('.sidebar');

  if (hamburger && sidebar) {
    hamburger.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      hamburger.classList.toggle('open');
    });
  }

  const navItems = document.querySelectorAll('.nav-menu .nav-item');
  const sections = document.querySelectorAll('main > section');

  function showSection(targetId) {
    sections.forEach(sec => {
      sec.style.display = sec.id === targetId ? 'block' : 'none';
    });

    navItems.forEach(item =>
      item.classList.toggle(
        'active',
        item.getAttribute('href') === `#${targetId}`
      )
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

  lucide.createIcons();

  const tipsPopup = document.getElementById('tipsPopup');
  const tipsOverlay = document.getElementById('tipsOverlay');
  const closeBtn = document.getElementById('closePopup');

  document.addEventListener('click', (e) => {
    if (e.target.closest('.help-icon')) {
      if (tipsPopup && tipsOverlay) {
        tipsPopup.style.display = 'flex';
        tipsOverlay.style.display = 'block';
      }
    }
  });

  if (tipsOverlay) {
    tipsOverlay.addEventListener('click', () => {
      if (tipsPopup) tipsPopup.style.display = 'none';
      tipsOverlay.style.display = 'none';
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      if (tipsPopup) tipsPopup.style.display = 'none';
      if (tipsOverlay) tipsOverlay.style.display = 'none';
    });
  }

  function setFaviconAndTitle(faviconUrl, titleText) {
    let link = document.querySelector("link[rel~='icon']");

    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }

    link.href = faviconUrl;
    document.title = titleText;
  }

  setFaviconAndTitle(
    `${baseURL}assents/favicon/favicon-16x16.png`,
    `Melfy | Minha Loja`
  );

  const lojaNome = document.getElementById("lojaNome");
  const lojaPFP = document.getElementById("lojaPFP");

  const dados = JSON.parse(localStorage.getItem("infoLoja"));

  if (dados && dados[0]) {
    if (lojaNome) lojaNome.textContent = dados[0].nome;
    if (lojaPFP) lojaPFP.src = dados[0].pfp;
  }

  const API_URL = "https://melfy-backend-production.up.railway.app";

  try {
    const res = await fetch(`${API_URL}/pedidos`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("tokenLoja")}`,
      },
    });

    if (res.ok) {
      const text = await res.text();

      if (text.trim() !== "") {
        const data = JSON.parse(text);

        if (data?.result?.length > 0) {
          localStorage.setItem("pedidos", JSON.stringify(data.result));
        }
      }
    }
  } catch (error) {}

  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", (event) => {
      event.preventDefault();

      alert("Você será deslogado. Até mais!");

      localStorage.removeItem("tokenLoja");
      localStorage.removeItem("infoLoja");

      window.location.href = `${baseURL}`;
    });
  }
});