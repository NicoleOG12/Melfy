import { openModal, adicionarNaSacola } from '../modal.js';
import { filtrarProdutos } from '../pesquisa.js';

document.addEventListener("DOMContentLoaded", function () {
  const lojas = JSON.parse(localStorage.getItem('Lojas')) || [];
  const produtos = JSON.parse(localStorage.getItem('Produtos')) || [];
  const idLojaAtual = parseInt(localStorage.getItem('idLojaSelecionada'));

  const nomeLojaElement = document.getElementById('nome-loja');
  const logoLojaElement = document.querySelector('.logo-loja');
  const loja = lojas.find(l => parseInt(l.idLoja) === idLojaAtual);
  nomeLojaElement.textContent = loja?.nomeLoja || 'Loja Desconhecida';
  logoLojaElement.src = loja?.fotoPerfil || 'placeholder.jpg';
  logoLojaElement.alt = loja?.nomeLoja || 'Loja Desconhecida';

  const produtosWrapper = document.querySelector('.produtos');
  const cardsWrapper = document.querySelector('.cards-wrapper');
  const inputPesquisa = document.getElementById('search-input');
  const botaoPesquisa = document.getElementById('search-button');

  const produtosDaLojaLogada = produtos.filter(p => parseInt(p.idLoja) === idLojaAtual);

  function renderizarProdutosDestaques(produtos) {
    produtosWrapper.innerHTML = '';
    if (!produtos.length) {
      produtosWrapper.innerHTML = '<p>Nenhum produto disponível.</p>';
      return;
    }
    produtos.slice(-2).reverse().forEach(produto => {
      const div = document.createElement('div');
      div.classList.add('produto');
      div.innerHTML = `
        <img src="${produto.foto}" alt="${produto.nome}">
        <h4>${produto.nome}</h4>
        <p>${produto.subtitulo}</p>
      `;
      div.style.cursor = 'pointer';
      div.onclick = () => openModal(produto, lojas, { loja: 'loja.html' });
      produtosWrapper.appendChild(div);
    });
  }

  function renderizarProdutos(produtos) {
    cardsWrapper.innerHTML = '';
    if (!produtos.length) {
      cardsWrapper.innerHTML = '<p>Nenhum produto encontrado.</p>';
      return;
    }
    produtos.forEach(produto => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.innerHTML = `
        <div class="border-card">
          <img src="${produto.foto}" alt="Imagem do Produto" class="imagem-produto" />
          <div class="descricao">
            <h3>${produto.nome}</h3>
            <p>${produto.subtitulo}</p>
          </div>
          <div class="footerNovidades">
            <div class="preco">
              <span class="icone-preco">R$</span>
              <span class="valor">${produto.preco}</span>
            </div>
          </div>
        </div>
      `;
      card.querySelector('.border-card').style.cursor = 'pointer';
      card.querySelector('.border-card').addEventListener('click', () => {
        openModal(produto, lojas, { loja: 'loja.html' });
      });
      cardsWrapper.appendChild(card);
    });
  }

  renderizarProdutosDestaques(produtosDaLojaLogada);
  renderizarProdutos(produtosDaLojaLogada);

  if (botaoPesquisa && inputPesquisa) {
    botaoPesquisa.addEventListener('click', () => filtrarProdutos(produtosDaLojaLogada, inputPesquisa, renderizarProdutos, cardsWrapper));
    inputPesquisa.addEventListener('keyup', e => {
      if (e.key === 'Enter') filtrarProdutos(produtosDaLojaLogada, inputPesquisa, renderizarProdutos, cardsWrapper);
    });
  }

  const btnAdd = document.querySelector('.btn-add');
  if (btnAdd) btnAdd.addEventListener('click', adicionarNaSacola);
});

document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('blur-active');

  const btnVoltar = document.getElementById('voltar-btn');
  btnVoltar.addEventListener('click', () => {
    window.history.back();
  });
});