// ==========================
//MODAL de PRODUTO
// ==========================
function isMobile() {
  return window.matchMedia("(max-width: 768px)").matches;
}

let mobileApplied = false;

function aplicarLayoutMobile() {
  if (!isMobile() || mobileApplied) return;

  const modalContent = document.querySelector(".modal-content");
  const modalInfo = document.querySelector(".modal-info");
  const img = document.querySelector(".modal-img");
  const actions = document.querySelector(".modal-actions");

  if (!modalContent || !modalInfo || !img || !actions) return;

  const body = document.createElement("div");
  body.classList.add("modal-body");

  const textWrapper = document.createElement("div");
  textWrapper.classList.add("modal-text");

  const bottomRow = document.createElement("div");
  bottomRow.classList.add("modal-bottom-row");

  body.appendChild(img);
  body.appendChild(modalInfo);

  modalContent.appendChild(body);

  const textos = [
    ".modal-title",
    ".modal-subtitulo",
    ".modal-description",
    ".modal-peso"
  ];

  textos.forEach(selector => {
    const el = document.querySelector(selector);
    if (el) textWrapper.appendChild(el);
  });

  modalInfo.appendChild(textWrapper);

  const price = document.querySelector(".modal-price");
  const total = document.querySelector(".modal-total");
  const qtd = document.querySelector(".modal-quantity");

  if (price) bottomRow.appendChild(price);
  if (total) bottomRow.appendChild(total);
  if (qtd) bottomRow.appendChild(qtd);

  modalInfo.appendChild(bottomRow);
  modalInfo.appendChild(actions);

  mobileApplied = true;
}

function aplicarLayoutDesktop() {
  if (isMobile() || !mobileApplied) return;
  location.reload();
}

function handleResize() {
  if (isMobile()) {
    aplicarLayoutMobile();
  } else {
    aplicarLayoutDesktop();
  }
}

window.addEventListener("load", () => {
  aplicarLayoutMobile();
});

window.addEventListener("resize", handleResize);