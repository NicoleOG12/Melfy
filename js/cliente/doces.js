import { rotasCliente } from '../rotas.js';
import { openModal,  adicionarNaSacola } from '../modal.js';
import { filtrarProdutos } from '../pesquisa.js';

document.addEventListener("DOMContentLoaded", function () {
  let produtos = JSON.parse(localStorage.getItem('Produtos')) || [];
  let lojas = JSON.parse(localStorage.getItem('Lojas')) || [];

  const cardsWrapper = document.querySelector('.cards-wrapper');
  const inputPesquisa = document.getElementById('search-input');
  const botaoPesquisa = document.getElementById('search-button');

  function formatarPreco(valor) {
    return parseFloat(valor).toFixed(2).replace('.', ',');
  }

  function renderizarProdutos(listaProdutos) {
    cardsWrapper.innerHTML = '';
    if (listaProdutos.length === 0) {
      cardsWrapper.innerHTML = '<p>Nenhum produto encontrado.</p>';
      return;
    }

    [...listaProdutos].reverse().forEach(produto => {
      const loja = lojas.find(l => l.idLoja === parseInt(produto.idLoja));
      const card = document.createElement('div');
      card.classList.add('card');
      
      card.innerHTML = `
        <div class="border-card">
          <div class="headerNovidade">
            <img src="${loja?.fotoPerfil || ''}" alt="Logo da Loja" class="logoLoja" />
          </div>
          <img src="${produto.foto}" alt="Imagem do Produto" class="imagem-produto" />
          <div class="descricao">
            <h3>${produto.nome}</h3>
            <p>${produto.subtitulo}</p>
          </div>
          <div class="footerNovidades">
            <div class="preco">
              <span class="icone-preco">R$</span>
              <span class="valor">${formatarPreco(produto.preco)}</span>
            </div>
          </div>
          <button class="btn-carrinho">
            <span>COMPRAR</span>
            <i class="fas fa-shopping-bag"></i>
          </button>
        </div>
      `;

      card.querySelector('.logoLoja').addEventListener('click', e => {
        e.stopPropagation();
        localStorage.setItem('idLojaSelecionada', loja.idLoja);
        window.location.href = rotasCliente.loja;
      });

      card.addEventListener('click', e => {
        if (!e.target.closest('.headerNovidade')) openModal(produto, lojas, rotasCliente);
      });

      cardsWrapper.appendChild(card);
    });
  }

  renderizarProdutos(produtos);

  inputPesquisa.addEventListener('input', () => filtrarProdutos(produtos, inputPesquisa, renderizarProdutos, cardsWrapper));
  inputPesquisa.addEventListener('keyup', e => { if(e.key==='Enter') filtrarProdutos(produtos, inputPesquisa, renderizarProdutos, cardsWrapper); });
  botaoPesquisa.addEventListener('click', () => filtrarProdutos(produtos, inputPesquisa, renderizarProdutos, cardsWrapper));

  document.querySelectorAll('.doce').forEach(doce => {
    doce.addEventListener('click', function () {
      const categoria = this.querySelector('p').textContent.trim();
      const filtrados = produtos.filter(p => p.categoria === categoria);
      renderizarProdutos(filtrados);
      cardsWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  document.querySelector('.btn-add').addEventListener('click', adicionarNaSacola);
});
