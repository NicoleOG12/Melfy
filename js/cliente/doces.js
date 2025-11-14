import { rotasCliente } from '../rotas.js';
import { openModal, adicionarNaSacola } from '../modal.js';
import { filtrarProdutos } from '../pesquisa.js';

document.addEventListener("DOMContentLoaded", async function () {
  const API_URL = "https://melfy-backend-production.up.railway.app";

  const cardsWrapper = document.querySelector('.cards-wrapper');
  const inputPesquisa = document.getElementById('search-input');
  const botaoPesquisa = document.getElementById('search-button');

  let produtos = [];
  let lojas = [];

  try {
    const resProdutos = await fetch(`${API_URL}/produtos`);
    const dataProdutos = await resProdutos.json();
    produtos = dataProdutos.result || [];

    const resLojas = await fetch(`${API_URL}/lojas/fetchAll`);
    const dataLojas = await resLojas.json();
    lojas = dataLojas.result || [];
  } catch (erro) {
    console.error("Erro ao carregar API:", erro);
  }

  function limitarDescricao(texto, limite = 45) {
    if (!texto) return "";
    const clean = texto.normalize("NFC");
    const arr = [...clean];
    const textoCortado = arr.slice(0, limite).join("");
    return arr.length > limite
      ? `${textoCortado}... <strong>ver mais</strong>`
      : texto;
  }

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
      console.log("loja"+loja)
    
      
      
      card.innerHTML = `
        <div class="headerNovidade">
          <img src="${loja?.pfp || ''}" alt="Logo da Loja" class="logoLoja" />
        </div>
        <div class="border-card">
          <img src="${produto.midia?.imagens?.[0]?.path || produto.foto}" alt="${produto.nome}" class="imagem-produto" />
          <div class="descricao">
            <h3>${produto.nome}</h3>
            <p>${limitarDescricao(produto.descricao || produto.subtitulo || "")}</p>
          </div>
          <div class="footerNovidades">
            <div class="preco">
              <span class="icone-preco">R$</span>
              <span class="valor">${formatarPreco(produto.valor_uni || produto.preco)}</span>
            </div>
          </div>
          <button class="btn-carrinho">
            <span>Adicionar ao carrinho</span>
            <i class="fas fa-shopping-bag"></i>
          </button>
        </div>
      `;

      card.querySelector('.logoLoja').addEventListener('click', e => {
        e.stopPropagation();
        window.location.href = `${rotasCliente.loja}?id=${loja.idLoja}`;
      });

      card.addEventListener('click', e => {
        if (!e.target.closest('.headerNovidade'))
          openModal(produto, lojas, rotasCliente);
      });

      cardsWrapper.appendChild(card);
    });
  }

  renderizarProdutos(produtos);

  inputPesquisa.addEventListener('input', () => 
    filtrarProdutos(produtos, inputPesquisa, renderizarProdutos, cardsWrapper)
  );

  inputPesquisa.addEventListener('keyup', e => {
    if (e.key === 'Enter')
      filtrarProdutos(produtos, inputPesquisa, renderizarProdutos, cardsWrapper);
  });

  botaoPesquisa.addEventListener('click', () => 
    filtrarProdutos(produtos, inputPesquisa, renderizarProdutos, cardsWrapper)
  );

  document.querySelectorAll('.doce').forEach(doce => {
    doce.addEventListener('click', function () {
      const categoria = this.querySelector('p').textContent.trim();
      const filtrados = produtos.filter(p => 
        p.categorias?.includes(categoria) || p.categoria === categoria
      );
      renderizarProdutos(filtrados);
      cardsWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  document.querySelector('.btn-add').addEventListener('click', adicionarNaSacola);

  const container = document.getElementById('lojas-container');
  const slider = document.querySelector('.lojas-scroll');
  container.innerHTML = "";

  lojas.forEach(loja => {
    const card = document.createElement('div');
    card.classList.add('loja-card');

    card.innerHTML = `
      <img src="${loja.pfp || loja.fotoPerfil}" alt="${loja.nomeLoja || loja.nome}" class="logo-loja">
      <div class="info-loja">
        <h3>${loja.nomeLoja || loja.nome}</h3>
        <p>${loja.descricao || "Confeitaria artesanal"}</p>
        <button class="btn-loja">Ver loja</button>
      </div>
    `;

    card.querySelector('.btn-loja').addEventListener('click', () => {
      window.location.href = `${rotasCliente.loja}?id=${loja.idLoja}`;
    });

    container.appendChild(card);
  });

  let isDown = false, startX, scrollLeft;

  slider.addEventListener('mousedown', e => {
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

  slider.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2;
    slider.scrollLeft = scrollLeft - walk;
  });

  slider.addEventListener('touchstart', e => {
    isDown = true;
    startX = e.touches[0].pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });

  slider.addEventListener('touchend', () => {
    isDown = false;
  });

  slider.addEventListener('touchmove', e => {
    if (!isDown) return;
    const x = e.touches[0].pageX - slider.offsetLeft;
    const walk = (x - startX) * 2;
    slider.scrollLeft = scrollLeft - walk;
  });
});
