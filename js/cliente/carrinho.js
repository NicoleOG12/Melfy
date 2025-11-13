import { rotasCliente } from '../rotas.js';
import { openModal, adicionarNaSacola } from '../modal.js';

function carregarSacola() {
  const sacola = JSON.parse(localStorage.getItem('Sacola')) || [];
  const produtos = JSON.parse(localStorage.getItem('Produtos')) || [];
  const lojas = JSON.parse(localStorage.getItem('Lojas')) || [];
  const tbody = document.querySelector('tbody');
  const subtotalSpan = document.querySelector('#subtotal');
  const totalSpan = document.querySelector('#total');

  tbody.innerHTML = '';

  if (sacola.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="5" style="text-align:center;">Sua sacola está vazia.</td></tr>';
    subtotalSpan.textContent = 'R$ 0,00';
    totalSpan.textContent = 'R$ 0,00';
    return;
  }

  let subtotal = 0;

  const lojasAgrupadas = {};
  sacola.forEach((item, index) => {
    const produto = produtos.find(p => p.idProduto === item.idProduto);
    const idLoja = parseInt(produto?.idLoja);
    const loja = lojas.find(l => parseInt(l.idLoja) === idLoja);

    if (!lojasAgrupadas[idLoja]) {
      lojasAgrupadas[idLoja] = {
        nomeLoja: loja?.nomeLoja || 'Loja Desconhecida',
        logoLoja: loja?.fotoPerfil || 'img/logo-default.png',
        itens: [],
        idLoja: idLoja
      };
    }

    lojasAgrupadas[idLoja].itens.push({ item, produto, index });
  });

  Object.values(lojasAgrupadas).forEach((loja, i) => {
    if (i > 0) {
      const trSeparador = document.createElement('tr');
      trSeparador.classList.add('linha-separadora');
      trSeparador.innerHTML = `<td colspan="5" class="td-separador"></td>`;
      tbody.appendChild(trSeparador);
    }

    const trLoja = document.createElement('tr');
    trLoja.classList.add('linha-loja');
    trLoja.innerHTML = `
      <td colspan="5">
        <div class="loja-header" style="display: flex; align-items: center; gap: 12px;">
          <input type="checkbox" class="check-loja" data-idloja="${loja.idLoja}" checked onchange="LojaCheckbox(this)">
          <div class="loja-header-info" style="display:flex; align-items:center; gap:8px;">
            <img src="${loja.logoLoja}" alt="Logo da Loja" class="logo-loja">
            <strong>${loja.nomeLoja}</strong>
          </div>
        </div>
      </td>
    `;
    tbody.appendChild(trLoja);

    loja.itens.forEach(({ item, produto, index }) => {
      const nome = produto?.nome || 'Produto';
      const imagem = produto?.foto || 'img/default.jpg';
      const valorUnitario = item.valorUnitario.toFixed(2).replace('.', ',');
      const valorTotal = item.valorTotal.toFixed(2).replace('.', ',');

      subtotal += item.valorTotal;

      const tr = document.createElement('tr');
      tr.classList.add('linha-produto');
      tr.innerHTML = `
        <td>
          <div class="produto" style="display:flex; align-items:center; gap:8px;">
            <input type="checkbox" class="check-produto" data-index="${index}" data-idloja="${loja.idLoja}" checked onchange="atualizarTotal()">
            <img src="${imagem}" alt="${nome}" class="foto-produto">
            <div class="info">
              <h3 class="nome">${nome}</h3>
            </div>
          </div>
        </td>
        <td>R$ ${valorUnitario}</td>
        <td>
          <div class="qtd">
            <button onclick="alterarQuantidadeSacola(${index}, -1)"> <i class='bx bx-minus'></i> </button>
            <span>${item.quantidade}</span>
            <button onclick="alterarQuantidadeSacola(${index}, 1)"> <i class='bx bx-plus'></i> </button>
          </div>
        </td>
        <td>R$ ${valorTotal}</td>
        <td>
          <button class="remover" onclick="removerItem(${index})"> <i class='bx bx-x'></i> </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  });

  subtotalSpan.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
  totalSpan.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
}

function LojaCheckbox(lojaCheckbox) {
  const idLoja = lojaCheckbox.getAttribute('data-idloja');
  const checkboxesProdutos = document.querySelectorAll(
    `input.check-produto[data-idloja="${idLoja}"]`
  );
  checkboxesProdutos.forEach(checkbox => {
    checkbox.checked = lojaCheckbox.checked;
  });
  atualizarTotal();
}

function alterarQuantidadeSacola(index, delta) {
  const sacola = JSON.parse(localStorage.getItem('Sacola')) || [];
  if (!sacola[index]) return;

  sacola[index].quantidade += delta;
  if (sacola[index].quantidade < 1) sacola[index].quantidade = 1;

  sacola[index].valorTotal = sacola[index].quantidade * sacola[index].valorUnitario;
  localStorage.setItem('Sacola', JSON.stringify(sacola));

  carregarSacola();
  atualizarTotal();
  if (window.atualizarContadorSacola) atualizarContadorSacola();

  document.dispatchEvent(new Event('sacolaAtualizada'));
}

window.alterarQuantidadeSacola = alterarQuantidadeSacola;

function removerItem(index) {
  if (confirm('Tem certeza que deseja remover este item da sacola?')) {
    const sacola = JSON.parse(localStorage.getItem('Sacola')) || [];
    if (index >= 0 && index < sacola.length) {
      sacola.splice(index, 1);
      localStorage.setItem('Sacola', JSON.stringify(sacola));
      carregarSacola();
      atualizarTotal();
      if (window.atualizarContadorSacola) atualizarContadorSacola();

      document.dispatchEvent(new Event('sacolaAtualizada'));
    }
  }
}

function atualizarTotal() {
  const checkboxes = document.querySelectorAll('.check-produto');
  const subtotalSpan = document.querySelector('#subtotal');
  const totalSpan = document.querySelector('#total');
  let subtotal = 0;

  checkboxes.forEach(checkbox => {
    if (checkbox.checked) {
      const sacola = JSON.parse(localStorage.getItem('Sacola')) || [];
      const index = parseInt(checkbox.getAttribute('data-index'));
      const item = sacola[index];
      if (item) subtotal += item.valorTotal;
    }
  });

  subtotalSpan.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
  totalSpan.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
}

window.onload = carregarSacola;

document.addEventListener('sacolaAtualizada', () => {
  carregarSacola();
  atualizarTotal();
});

// ---------- MODAL DE COMPRA ----------
function abrirModalCompra() {
  const modal = document.getElementById('modal-compra-buy');
  modal.style.display = 'flex';
  preencherProdutosModalCompra();
  atualizarFreteCompra();
}

function fecharModalCompra() {
  const modal = document.getElementById('modal-compra-buy');
  modal.style.display = 'none';
}

function preencherProdutosModalCompra() {
  const sacola = JSON.parse(localStorage.getItem('Sacola')) || [];
  const produtos = JSON.parse(localStorage.getItem('Produtos')) || [];
  const lista = document.getElementById('lista-produtos-compra');
  lista.innerHTML = '';

  if (sacola.length === 0) {
    lista.innerHTML = '<p>Sua sacola está vazia.</p>';
    document.getElementById('total-compra').textContent = 'R$ 0,00';
    window.modalSubtotalBuy = 0;
    return;
  }

  let subtotal = 0;

  sacola.forEach(item => {
    const produto = produtos.find(p => p.idProduto === item.idProduto);
    if (!produto) return;

    const nome = produto.nome || 'Produto';
    const foto = produto.foto || 'img/default.jpg';
    const preco = item.valorUnitario.toFixed(2).replace('.', ',');
    const quantidade = item.quantidade;

    subtotal += item.valorTotal;

    const divProduto = document.createElement('div');
    divProduto.style.display = 'flex';
    divProduto.style.flexDirection = 'column';
    divProduto.style.borderBottom = '1px solid var(--cor-botao-hover)';
    divProduto.style.paddingBottom = '12px';
    divProduto.style.marginBottom = '20px';

    divProduto.innerHTML = `
      <div style="display: flex; width: 100%;">
        <img src="${foto}" alt="${nome}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; margin-right: 20px; border: 1px solid var(--cor-botao-hover);" />
        <div style="flex: 1;">
          <div style="font-weight: bold; color: var(--cor-nome);">${nome}</div>
          <div style="color: var(--cor-footer-text); margin-top: 4px;">Preço unitário: R$ ${preco}</div>
          <div style="color: var(--cor-footer-text); margin-top: 2px;">Quantidade: ${quantidade}</div>
        </div>
        <div style="font-weight: bold; color: var(--cor-laranja); min-width: 80px; text-align: right;">
          R$ ${(item.valorTotal).toFixed(2).replace('.', ',')}
        </div>
      </div>
    `;

    lista.appendChild(divProduto);
  });

  document.getElementById('total-compra').textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
  window.modalSubtotalBuy = subtotal;
}

function atualizarFreteCompra() {
  const entrega = document.querySelector('input[name="entrega-buy"]:checked')?.value || 'retirada';
  const valorFreteSpan = document.getElementById('total-frete-buy');
  const totalProdutosSpan = document.getElementById('total-produtos-buy');
  const totalModalSpan = document.getElementById('total-compra');
  const totalGeralSpan = document.getElementById('total-geral-buy');

  let frete = entrega === 'delivery' ? 10.0 : 0;
  valorFreteSpan.textContent = `R$ ${frete.toFixed(2).replace('.', ',')}`;

  const totalProdutos = window.modalSubtotalBuy || 0;
  totalProdutosSpan.textContent = `R$ ${totalProdutos.toFixed(2).replace('.', ',')}`;
  totalModalSpan.textContent = `R$ ${totalProdutos.toFixed(2).replace('.', ',')}`;
  totalGeralSpan.textContent = `R$ ${(totalProdutos + frete).toFixed(2).replace('.', ',')}`;
}

function finalizarCompra() {
  const pagamento = document.querySelector('input[name="pagamento-buy"]:checked').value;
  const entrega = document.querySelector('input[name="entrega-buy"]:checked').value;

  alert(`Compra finalizada!\nPagamento: ${pagamento}\nEntrega: ${entrega}`);

  localStorage.removeItem('Sacola');
  carregarSacola();
  if (window.atualizarContadorSacola) atualizarContadorSacola();

  document.dispatchEvent(new Event('sacolaAtualizada'));
  fecharModalCompra();
}

document.addEventListener('DOMContentLoaded', function () {
  const produtos = JSON.parse(localStorage.getItem('Produtos')) || [];
  const lojas = JSON.parse(localStorage.getItem('Lojas')) || [];
  const cardsWrapper = document.querySelector('.cards-wrapper');

  function formatarPreco(valor) {
    return parseFloat(valor).toFixed(2).replace('.', ',');
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

  function renderizarProdutosAleatorios(listaProdutos) {
    cardsWrapper.innerHTML = '';
  
    if (listaProdutos.length === 0) {
      cardsWrapper.innerHTML = '<p>Nenhum produto encontrado.</p>';
      return;
    }
  
    const produtosAleatorios = listaProdutos
      .slice()
      .sort(() => 0.5 - Math.random())
      .slice(0, 5);
  
    produtosAleatorios.forEach(produto => {
      const loja = lojas.find(l => l.idLoja === parseInt(produto.idLoja));
  
      const card = document.createElement('div');
      card.classList.add('card');
  
      card.innerHTML = `
        <div class="headerNovidade">
          <img src="${loja?.pfp || loja?.fotoPerfil || ''}" class="logoLoja" />
        </div>
        <div class="border-card">
          <img src="${produto.midia?.imagens?.[0]?.path || produto.foto}" class="imagem-produto" />
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
  
  renderizarProdutosAleatorios(produtos);


  document.querySelector('.btn-add').addEventListener('click', adicionarNaSacola);
});

window.removerItem = removerItem;
window.atualizarTotal = atualizarTotal;
window.LojaCheckbox = LojaCheckbox;
window.abrirModalCompra = abrirModalCompra;
window.finalizarCompra = finalizarCompra;
window.fecharModalCompra = fecharModalCompra;
