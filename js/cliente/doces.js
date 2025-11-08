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
        <div class="headerNovidade">
          <img src="${loja?.fotoPerfil || ''}" alt="Logo da Loja" class="logoLoja" />
        </div>
        <div class="border-card">
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
            <span>Adicionar ao carrinho </span>
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


const lojas = JSON.parse(localStorage.getItem('Lojas')) || [];
const container = document.getElementById('lojas-container');
container.innerHTML = "";

lojas.forEach(loja => {
  const card = document.createElement('div');
  card.classList.add('loja-card');

  card.innerHTML = `
    <img src="${loja.fotoPerfil}" alt="${loja.nomeLoja}" class="logo-loja">
    <div class="info-loja">
      <h3>${loja.nomeLoja}</h3>
      <p>${loja.descricao}</p>
      <button class="btn-loja">Ver loja</button>
    </div>
  `;

  card.querySelector('.btn-loja').addEventListener('click', () => {
    localStorage.setItem('idLojaSelecionada', loja.idLoja);
    window.location.href = rotasCliente.loja;
  });

  container.appendChild(card);
});

const slider = document.querySelector('.lojas-scroll');
let isDown = false;
let startX;
let scrollLeft;

slider.addEventListener('mousedown', (e) => {
  isDown = true;
  slider.classList.add('active');
  startX = e.pageX - slider.offsetLeft;
  scrollLeft = slider.scrollLeft;
});

slider.addEventListener('mouseleave', () => {
  isDown = false;
  slider.classList.remove('active');
});

slider.addEventListener('mouseup', () => {
  isDown = false;
  slider.classList.remove('active');
});

slider.addEventListener('mousemove', (e) => {
  if(!isDown) return;
  e.preventDefault();
  const x = e.pageX - slider.offsetLeft;
  const walk = (x - startX) * 2;
  slider.scrollLeft = scrollLeft - walk;
});

slider.addEventListener('touchstart', (e) => {
  isDown = true;
  startX = e.touches[0].pageX - slider.offsetLeft;
  scrollLeft = slider.scrollLeft;
});

slider.addEventListener('touchend', () => {
  isDown = false;
});

slider.addEventListener('touchmove', (e) => {
  if(!isDown) return;
  const x = e.touches[0].pageX - slider.offsetLeft;
  const walk = (x - startX) * 2;
  slider.scrollLeft = scrollLeft - walk;
});

