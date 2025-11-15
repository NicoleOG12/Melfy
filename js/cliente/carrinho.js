import { rotasCliente } from "../rotas.js";
import { openModal, adicionarNaSacola } from "../modal.js";

function carregarSacola() {
  const sacola = JSON.parse(localStorage.getItem("Sacola")) || [];
  const produtos = JSON.parse(localStorage.getItem("Produtos")) || [];
  const lojas = JSON.parse(localStorage.getItem("Lojas")) || [];
  const tbody = document.querySelector("tbody");
  const subtotalSpan = document.querySelector("#subtotal");

  const totalSpan = document.querySelector("#total");

  tbody.innerHTML = "";

  if (sacola.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="5" style="text-align:center;">Sua sacola está vazia.</td></tr>';
    subtotalSpan.textContent = "R$ 0,00";
    totalSpan.textContent = "R$ 0,00";
    return;
  }

  let subtotal = 0;

  const lojasAgrupadas = {};
  sacola.forEach((item, index) => {
    const produto = produtos.find((p) => p.idProduto === item.idProduto);
    const idLoja = parseInt(produto?.idLoja);
    const loja = lojas.find((l) => parseInt(l.idLoja) === idLoja);

    if (!lojasAgrupadas[idLoja]) {
      lojasAgrupadas[idLoja] = {
        nomeLoja: loja?.nomeLoja || "Loja Desconhecida",
        logoLoja: loja?.fotoPerfil || "img/logo-default.png",
        itens: [],
        idLoja: idLoja,
      };
    }

    lojasAgrupadas[idLoja].itens.push({ item, produto, index });
  });

  Object.values(lojasAgrupadas).forEach((loja, i) => {
    if (i > 0) {
      const trSeparador = document.createElement("tr");
      trSeparador.classList.add("linha-separadora");
      trSeparador.innerHTML = `<td colspan="5" class="td-separador"></td>`;
      tbody.appendChild(trSeparador);
    }

    const trLoja = document.createElement("tr");
    trLoja.classList.add("linha-loja");
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
      const nome = produto?.nome || "Produto";
      const imagem = produto?.foto || "img/default.jpg";
      const valorUnitario = item.valorUnitario.toFixed(2).replace(".", ",");
      const valorTotal = item.valorTotal.toFixed(2).replace(".", ",");

      subtotal += item.valorTotal;

      const tr = document.createElement("tr");
      tr.classList.add("linha-produto");
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

  subtotalSpan.textContent = `R$ ${subtotal.toFixed(2).replace(".", ",")}`;
  totalSpan.textContent = `R$ ${subtotal.toFixed(2).replace(".", ",")}`;
}

function LojaCheckbox(lojaCheckbox) {
  const idLoja = lojaCheckbox.getAttribute("data-idloja");
  const checkboxesProdutos = document.querySelectorAll(
    `input.check-produto[data-idloja="${idLoja}"]`
  );
  checkboxesProdutos.forEach((checkbox) => {
    checkbox.checked = lojaCheckbox.checked;
  });
  atualizarTotal();
}

function alterarQuantidadeSacola(index, delta) {
  const sacola = JSON.parse(localStorage.getItem("Sacola")) || [];
  if (!sacola[index]) return;

  sacola[index].quantidade += delta;
  if (sacola[index].quantidade < 1) sacola[index].quantidade = 1;

  sacola[index].valorTotal =
    sacola[index].quantidade * sacola[index].valorUnitario;
  localStorage.setItem("Sacola", JSON.stringify(sacola));

  carregarSacola();
  atualizarTotal();
  if (window.atualizarContadorSacola) atualizarContadorSacola();

  document.dispatchEvent(new Event("sacolaAtualizada"));
}

window.alterarQuantidadeSacola = alterarQuantidadeSacola;

function removerItem(index) {
  if (confirm("Tem certeza que deseja remover este item da sacola?")) {
    const sacola = JSON.parse(localStorage.getItem("Sacola")) || [];
    if (index >= 0 && index < sacola.length) {
      sacola.splice(index, 1);
      localStorage.setItem("Sacola", JSON.stringify(sacola));
      carregarSacola();
      atualizarTotal();
      if (window.atualizarContadorSacola) atualizarContadorSacola();

      document.dispatchEvent(new Event("sacolaAtualizada"));
    }
  }
}

function atualizarTotal() {
  const checkboxes = document.querySelectorAll(".check-produto");
  const subtotalSpan = document.querySelector("#subtotal");
  const totalSpan = document.querySelector("#total");
  let subtotal = 0;

  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      const sacola = JSON.parse(localStorage.getItem("Sacola")) || [];
      const index = parseInt(checkbox.getAttribute("data-index"));
      const item = sacola[index];
      if (item) subtotal += item.valorTotal;
    }
  });

  subtotalSpan.textContent = `R$ ${subtotal.toFixed(2).replace(".", ",")}`;
  totalSpan.textContent = `R$ ${subtotal.toFixed(2).replace(".", ",")}`;
}

window.onload = carregarSacola;

document.addEventListener("sacolaAtualizada", () => {
  carregarSacola();
  atualizarTotal();
});

// / ---------- MODAL DE COMPRA ----------
function abrirModalCompra() {
  const modal = document.getElementById("modal-compra-buy");
  modal.style.display = "flex";
  preencherResumoCompra();
}

function fecharModalCompra() {
  const modal = document.getElementById("modal-compra-buy");
  modal.style.display = "none";
}

function preencherResumoCompra() {
  const sacola = JSON.parse(localStorage.getItem("Sacola")) || [];
  let subtotal = 0;

  sacola.forEach((item) => {
    subtotal += item.valorTotal || 0;
  });

  // Atualiza subtotal tanto no carrinho principal quanto no modal
  document.querySelectorAll("#subtotal, #subtotal-modal").forEach((el) => {
    el.textContent = `R$ ${subtotal.toFixed(2).replace(".", ",")}`;
  });

  window.modalSubtotalBuy = subtotal;
  atualizarFreteCompra(true);
}

function atualizarFreteCompra(inicial = false) {
  const cepInput = document.querySelector(".cep");
  const taxaEntregaCarrinho = document.getElementById("taxa-entrega");
  const taxaEntregaModal = document.getElementById("taxa-entrega-modal");
  const valorFrete = document.getElementById("valor-frete");
  const totalCarrinho = document.getElementById("total");
  const totalModal = document.getElementById("total-modal");

  function calcularFrete() {
    const cep = cepInput.value.trim();
    let frete = 0;

    // Verifica se CEP está completo
    if (cep.length === 9) {
      frete = 9;
      valorFrete.textContent = "R$ 9,00";
      taxaEntregaCarrinho.textContent = "R$ 9,00";
      taxaEntregaModal.textContent = "R$ 9,00";
    } else {
      valorFrete.textContent = "R$ 0,00";
      taxaEntregaCarrinho.textContent = "R$ 0,00";
      taxaEntregaModal.textContent = "R$ 0,00";
    }

    const total = (window.modalSubtotalBuy || 0) + frete;

    totalCarrinho.textContent = `R$ ${total.toFixed(2).replace(".", ",")}`;
    totalModal.textContent = `R$ ${total.toFixed(2).replace(".", ",")}`;
  }

  cepInput.removeEventListener("input", calcularFrete);
  cepInput.addEventListener("input", calcularFrete);

  if (inicial) {
    calcularFrete();
  }
}

function finalizarCompra() {
  const tipoPagamento =
    document.querySelector('.modal_tipo:not([style*="display: none"])')?.id ||
    "Nenhum selecionado";

  alert(
    `Compra finalizada!\nForma de pagamento: ${tipoPagamento.replace(
      "modal_",
      ""
    )}`
  );

  localStorage.removeItem("Sacola");
  carregarSacola();
  if (window.atualizarContadorSacola) atualizarContadorSacola();

  fecharModalCompra();
}

// --- ABRIR E FECHAR MODAIS DE PAGAMENTO ---
const modalCartao = document.getElementById("modal_cartao");
const modalPix = document.getElementById("modal_pix");
// Começam escondidos
modalCartao.style.display = "none";
modalPix.style.display = "none";

document.getElementById("btn_cartao").addEventListener("click", () => {
  document.getElementById("modal_cartao").style.display = "block";
  document.getElementById("modal_pix").style.display = "none";
});

document.getElementById("btn_pix").addEventListener("click", () => {
  document.getElementById("modal_pix").style.display = "flex";
  document.getElementById("modal_cartao").style.display = "none";
});

// --- FECHAR MODAL AO CLICAR FORA ---
document
  .getElementById("modal-compra-buy")
  .addEventListener("click", function (event) {
    // Se o clique for no fundo (overlay) e não dentro do modal, fecha
    if (event.target === this) {
      fecharModalCompra();
    }
  });

document.addEventListener("DOMContentLoaded", function () {
  const produtos = JSON.parse(localStorage.getItem("Produtos")) || [];
  const lojas = JSON.parse(localStorage.getItem("Lojas")) || [];
  const cardsWrapper = document.querySelector(".cards-wrapper");

  function formatarPreco(valor) {
    return parseFloat(valor).toFixed(2).replace(".", ",");
  }

  function renderizarProdutosAleatorios(listaProdutos) {
    cardsWrapper.innerHTML = "";

    if (listaProdutos.length === 0) {
      cardsWrapper.innerHTML = "<p>Nenhum produto encontrado.</p>";
      return;
    }

    const produtosAleatorios = listaProdutos
      .slice()
      .sort(() => 0.5 - Math.random())
      .slice(0, 5);

    produtosAleatorios.forEach((produto) => {
      const loja = lojas.find((l) => l.idLoja === parseInt(produto.idLoja));
      const precoFormatado = parseFloat(produto.preco)
        .toFixed(2)
        .replace(".", ",");

      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
        <div class="headerNovidade">
          <img src="${
            loja?.fotoPerfil || ""
          }" alt="Logo da Loja" class="logoLoja" />
        </div>
        <div class="border-card">
          <img src="${
            produto.foto
          }" alt="Imagem do Produto" class="imagem-produto" />
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

      const logoLojaElement = card.querySelector(".logoLoja");
      logoLojaElement.addEventListener("click", (e) => {
        e.stopPropagation();
        localStorage.setItem("idLojaSelecionada", loja.idLoja);
        window.location.href = rotasCliente.loja;
      });

      card.addEventListener("click", (event) => {
        const isHeader = event.target.closest(".headerNovidade");
        if (!isHeader) openModal(produto, lojas, rotasCliente);
      });

      cardsWrapper.appendChild(card);
    });
  }

  renderizarProdutosAleatorios(produtos);

  document
    .querySelector(".btn-add")
    .addEventListener("click", adicionarNaSacola);
});

window.removerItem = removerItem;
window.atualizarTotal = atualizarTotal;
window.LojaCheckbox = LojaCheckbox;
window.abrirModalCompra = abrirModalCompra;
window.finalizarCompra = finalizarCompra;
window.fecharModalCompra = fecharModalCompra;
