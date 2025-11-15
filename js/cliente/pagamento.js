// Função para abrir e fechar os modais de pagamento
document.addEventListener("DOMContentLoaded", () => {
  const btnCartao = document.getElementById("btn_cartao");
  const btnPix = document.getElementById("btn_pix");
  const modalCartao = document.getElementById("modal_cartao");
  const modalPix = document.getElementById("modal_pix");

  // Começam escondidos
  modalCartao.style.display = "none";
  modalPix.style.display = "none";

  // Ao clicar em Cartão
  btnCartao.addEventListener("click", () => {
    modalCartao.style.display = "block";
    modalPix.style.display = "none";
  });

  // Ao clicar em Pix
  btnPix.addEventListener("click", () => {
    modalPix.style.display = "flex";
    modalCartao.style.display = "none";
  });
});
