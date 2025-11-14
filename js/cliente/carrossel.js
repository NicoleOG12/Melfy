document.addEventListener('DOMContentLoaded', async () => { 
    const API_URL = "https://melfy-backend-production.up.railway.app";
  const categoriasDiv = document.getElementById("categorias-div")

  const scrollAmount = 300;
  const carrosseis = document.querySelectorAll('.carrossel');

  carrosseis.forEach(carrossel => {
    const leftBtn = carrossel.querySelector('.arrow.left');
    const rightBtn = carrossel.querySelector('.arrow.right');
    const scrollContainer = carrossel.querySelector('.categorias') || carrossel.querySelector('.doces') || carrossel.querySelector('.cards-container');

    if (!leftBtn || !rightBtn || !scrollContainer) return;

    leftBtn.addEventListener('click', () => {
      scrollContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    rightBtn.addEventListener('click', () => {
      scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
  });





// lógica para buscar produtos por categoria
const resp = await fetch(`${API_URL}/categorias`);

const categorias = await resp.json();
console.log(categorias)
categoriasDiv.innerHTML = "";

categorias.result.forEach(categoria => {
  categoriasDiv.innerHTML += `
       <div class="categoria categoria-click-event-listener" data-id="${categoria.id}">
              <div class="hex-externo">
                <div class="hex-interno">
                  <div class="hex-img">
                    <img src="${categoria.icone}" alt="${categoria.nome}">
                  </div>
                </div>
              </div>
              <p>${categoria.nome}</p>
       </div>`;
});


});


