const imagens = document.querySelectorAll(".image-slider img");
const indicadoresContainer = document.querySelector(".slider-indicadores");

let indice = 0;


imagens.forEach((_, i) => {
  const dot = document.createElement("div");
  dot.classList.add("dot");
  if (i === 0) dot.classList.add("ativa");
  indicadoresContainer.appendChild(dot);
});

const dots = document.querySelectorAll(".slider-indicadores .dot"); 
function trocarImagens() {

  imagens[indice].classList.remove("ativa");
  dots[indice].classList.remove("ativa");


  indice = (indice + 1) % imagens.length;


  imagens[indice].classList.add("ativa");
  dots[indice].classList.add("ativa");
}


setInterval(trocarImagens, 8000);
