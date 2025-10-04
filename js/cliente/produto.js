window.addEventListener('DOMContentLoaded', () => { 
  const categoriaSelecionada = localStorage.getItem('categoriaSelecionada');
  const lojas = JSON.parse(localStorage.getItem('Lojas')) || [];
  const produtos = JSON.parse(localStorage.getItem('Produtos')) || [];

  const produtosFiltrados = produtos.filter(produto =>
    produto.categoria === categoriaSelecionada
  );

  const mainContainer = document.querySelector('main');
  mainContainer.innerHTML = '';

  if (produtosFiltrados.length === 0) {
    mainContainer.innerHTML = `
      <p class="mensagem-vazia">Nenhum produto encontrado para a categoria selecionada.</p>
    `;
    return;
  }

  const cardsWrapper = document.createElement('div');
  cardsWrapper.classList.add('cards-wrapper');
  mainContainer.appendChild(cardsWrapper);

  produtosFiltrados.forEach(produto => {
    const loja = lojas.find(l => l.idLoja == produto.idLoja) || {};

    const card = document.createElement('div');
    card.classList.add('card');

    card.innerHTML = `
      <div class="border-card">
        <div class="headerNovidade">
          <img src="${loja.fotoPerfil || ''}" alt="Logo da Loja" class="logoLoja" />
        </div>
        <img src="${produto.foto}" alt="Imagem do Produto" class="imagem-produto" />
        <div class="descricao">
          <h3>${produto.nome}</h3>
          <p>${produto.subtitulo}</p>
        </div>
        <div class="footerNovidades">
          <div class="preco">
            <span class="icone-preco">R$</span>
            <span class="valor">${produto.preco.toFixed(2)}</span>
          </div>
          <div class="btn-carrinho">
            <i class="fas fa-shopping-bag"></i>
          </div>
        </div>
      </div>
    `;

    cardsWrapper.appendChild(card);
  });

  adicionarEventosAoModal();
});

function adicionarEventosAoModal() {
  const cards = document.querySelectorAll('.card');
  const modal = document.getElementById('product-modal');
  const modalImg = modal.querySelector('.modal-img');
  const modalTitulo = modal.querySelector('.modal-title');
  const modalDescricao = modal.querySelector('.modal-description');
  const modalPreco = modal.querySelector('.modal-price');
  const fecharBtn = modal.querySelector('.modal-close');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const imgSrc = card.querySelector('img.imagem-produto')?.src || '';
      const titulo = card.querySelector('h3')?.innerText || 'Sem nome';
      const preco = `${card.querySelector('.icone-preco')?.innerText || 'R$'} ${card.querySelector('.valor')?.innerText || '0,00'}`;

      modalImg.src = imgSrc;
      modalTitulo.textContent = titulo;
      modalDescricao.textContent = 'Descrição do produto ainda não definida.';
      modalPreco.textContent = preco;

      modal.style.display = 'flex';
    });
  });

  fecharBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
}
