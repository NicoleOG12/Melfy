import { carregarTodosOsDados } from './dicionario.js';

document.addEventListener('DOMContentLoaded', () => {
  carregarTodosOsDados();
});

document.addEventListener("DOMContentLoaded", function () {
  document.querySelector(".button").addEventListener("click", function() {
  document.getElementById("section1").scrollIntoView({ behavior: "smooth" });
});

  const cards = document.querySelectorAll(".dessert-card");
  const centerX = window.innerWidth / 2 - 130;
  const centerY = window.innerHeight / 2 - 50; 
  const radius = 420; 
  let angleOffset = 0;

  function positionCards() {
    const total = cards.length;
    cards.forEach((card, index) => {
      const angle = (index * (360 / total)) + angleOffset;
      const radians = (angle * Math.PI) / 180;
      const x = centerX + radius * Math.cos(radians) - card.offsetWidth / 2;
      const y = centerY + radius * Math.sin(radians) - card.offsetHeight / 2;

      card.style.position = "absolute";
      card.style.left = `${x}px`;
      card.style.top = `${y}px`;
    });
  }

  function animateRotation() {
    angleOffset += 1; 
    positionCards();
    requestAnimationFrame(animateRotation);
  }

  positionCards(); 
  animateRotation();
  
//---------------------------------------------------------
  const title = document.querySelector(".intro h2");
  title.classList.add("intro-animate");

  title.addEventListener("animationend", () => {
    title.classList.remove("intro-animate");
    title.classList.add("glow");
  });
});



const coordenadasIniciais = [-23.561684, -46.625378];
const mapa = L.map("mapa").setView(coordenadasIniciais, 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(mapa);

let marcador;

function pesquisar() {
  const endereco = document.getElementById("inputLocal").value;

  if (!endereco) {
    alert("Por favor, digite um endereço.");
    return;
  }

  fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco)}`)
    .then((res) => res.json())
    .then((dados) => {
      if (dados.length > 0) {
        const lat = parseFloat(dados[0].lat);
        const lon = parseFloat(dados[0].lon);
        mapa.setView([lat, lon], 15);

        if (marcador) {
          marcador.setLatLng([lat, lon]);
        } else {
          marcador = L.marker([lat, lon]).addTo(mapa);
        }
      } else {
        alert("Endereço não encontrado.");
      }
    })
    .catch((erro) => {
      console.error("Erro ao buscar endereço:", erro);
      alert("Ocorreu um erro ao buscar o endereço.");
    });
}
