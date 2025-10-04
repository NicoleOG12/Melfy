document.addEventListener('DOMContentLoaded', () => {
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
});

