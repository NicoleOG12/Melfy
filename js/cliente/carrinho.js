import { rotasCliente } from "../rotas.js";
import { openModal, adicionarNaSacola } from "../modal.js";

// ============================================================
// BUSCAR SACOLA DO BACKEND
// ============================================================

const API_URL = "https://melfy-backend-production.up.railway.app";

async function carregarSacola() {
  try {
    const token = localStorage.getItem("tokenCliente");

    if (!token) {
      console.warn("Nenhum token encontrado no localStorage.");
      return [];
    }

    const res = await fetch(`${API_URL}/carrinho`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    
    const texto = await res.text();
    console.log("RAW RESPONSE:", texto);

    let data;
    try {
      data = JSON.parse(texto);
      
    renderizarCarrinhoCarrinhoAPI(data.result);
    localStorage.setItem("Sacola", JSON.stringify(data.result));

    } catch (e) {
      console.error(e);
      return [];
    }

    if (data.error) {
      console.error("Erro da API:", data.message || data.error);
      return [];
    }

    return data.result || [];
  } catch (err) {
    console.error("Erro ao carregar sacola:", err);
    return [];
  }

}


// ============================================================
// CARREGAR SACOLA
// ============================================================

function renderizarCarrinhoCarrinhoAPI(data) {
  const tbody = document.querySelector("#tabela-carrinho");
  const subtotalSpan = document.querySelector("#subtotal");
  const totalSpan = document.querySelector("#total");

  tbody.innerHTML = "";

  let subtotal = 0;

  // Agrupando por loja
  const lojasAgrupadas = {};

  data.forEach((produto, idx) => {
    const idLoja = produto.id_loja || 0;

    if (!lojasAgrupadas[idLoja]) {
      lojasAgrupadas[idLoja] = {
        idLoja,
        nomeLoja: produto.nomeLoja || "Loja",
        logoLoja: produto.logoLoja || "img/default-loja.png",
        itens: [],
      };
    }

    lojasAgrupadas[idLoja].itens.push({
      item: {
        valorUnitario: parseFloat(produto.valor_uni),
        quantidade: produto.quantidade || 1,
        valorTotal: parseFloat(produto.valor_uni) * (produto.quantidade || 1),
        id: produto.id_item_carrinho,
      },
      produto,
      idx,
    });
  });

  Object.values(lojasAgrupadas).forEach((loja, i) => {
    if (i > 0) {
      const trSep = document.createElement("tr");
      trSep.classList.add("linha-separadora");
      trSep.innerHTML = `<td colspan="5" class="td-separador"></td>`;
      tbody.appendChild(trSep);
    }

    // Linha da loja
    // const trLoja = document.createElement("tr");
    // trLoja.classList.add("linha-loja");
    // trLoja.innerHTML = `
    //   <td colspan="5">
    //     <div class="loja-header" style="display:flex; align-items:center; gap:12px;">
    //       <input type="checkbox" class="check-loja" data-idloja="${loja.idLoja}" checked onchange="LojaCheckbox(this)">
    //       <div class="loja-header-info" style="display:flex; align-items:center; gap:8px;">
    //         <img src="${loja.pfp}" alt="Logo da Loja" class="logo-loja">
    //         <strong>${loja.nomeLoja}</strong>
    //       </div>
    //     </div>
    //   </td>
    // `;
    // tbody.appendChild(trLoja);

    // Produtos dessa loja
    loja.itens.forEach(({ item, produto, idx }) => {
      const nome = produto.nome;
      const imagem = produto.imagem;
      const valorUnit = parseFloat(produto.valor_uni);

      subtotal += valorUnit * item.quantidade;

      const tr = document.createElement("tr");
      tr.classList.add("linha-produto");
      tr.innerHTML = `
        <td>
          <div class="produto" style="display:flex; align-items:center; gap:8px;">
            <input 
              type="checkbox" 
              class="check-produto" 
              data-index="${idx}" 
              data-idloja="${loja.idLoja}" 
              checked 
              onchange="atualizarTotal()">

            <img src="${imagem}" alt="${nome}" class="foto-produto">

            <div class="info">
              <h3>${nome}</h3>
            </div>
          </div>
        </td>

        <td>R$ ${valorUnit.toFixed(2).replace(".", ",")}</td>

        <td>
          <div class="qtd">
            <button onclick="alterarQuantidadeSacola(${idx}, -1)"> <i class='bx bx-minus'></i> </button>
            <span>${item.quantidade}</span>
            <button onclick="alterarQuantidadeSacola(${idx}, 1)"> <i class='bx bx-plus'></i> </button>
          </div>
        </td>

        <td>R$ ${(valorUnit * item.quantidade)
          .toFixed(2)
          .replace(".", ",")}</td>

        <td>
          <button class="remover" onclick="removerItem(${item.id})"> 
            <i class='bx bx-x'></i> 
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  });

  subtotalSpan.textContent = `R$ ${subtotal.toFixed(2).replace(".", ",")}`;
  totalSpan.textContent = `R$ ${subtotal.toFixed(2).replace(".", ",")}`;


}

// ============================================================
// FUNÇÕES DE QUANTIDADE / REMOVER
// ============================================================

async function alterarQuantidadeSacola(index, delta) {
  const sacola = await fetchSacola();
  if (!sacola[index]) return;

  sacola[index].quantidade += delta;
  if (sacola[index].quantidade < 1) sacola[index].quantidade = 1;

  sacola[index].valorTotal =
    sacola[index].quantidade * sacola[index].valorUnitario;

  await salvarSacolaBackend(sacola);

  carregarSacola();
  atualizarTotal();
}

window.alterarQuantidadeSacola = alterarQuantidadeSacola;

async function removerItem(index) {
  if (!confirm("Tem certeza que deseja remover este item da sacola?")) return;

  const sacola = await fetchSacola();
  sacola.splice(index, 1);

  await salvarSacolaBackend(sacola);
  carregarSacola();
  atualizarTotal();
}

window.removerItem = removerItem;

// ============================================================
// TOTAL
// ============================================================

async function atualizarTotal() {
  const checkboxes = document.querySelectorAll(".check-produto");
  const sacola = await fetchSacola();

  let subtotal = 0;

  checkboxes.forEach((cb) => {
    if (cb.checked) {
      const item = sacola[parseInt(cb.dataset.index)];
      if (item) subtotal += item.valorTotal;
    }
  });

  document.querySelector("#subtotal").textContent =
    "R$ " + subtotal.toFixed(2).replace(".", ",");
  document.querySelector("#total").textContent =
    "R$ " + subtotal.toFixed(2).replace(".", ",");
}

window.atualizarTotal = atualizarTotal;

function LojaCheckbox(el) {
  const idLoja = el.dataset.idloja;
  const cbs = document.querySelectorAll(
    `.check-produto[data-idloja="${idLoja}"]`
  );
  cbs.forEach((c) => (c.checked = el.checked));
  atualizarTotal();
}

window.LojaCheckbox = LojaCheckbox;

// ============================================================
// MODAL DE COMPRA
// ============================================================

function abrirModalCompra() {
  document.getElementById("modal-compra-buy").style.display = "flex";
  preencherResumoCompra();
}

function fecharModalCompra() {
  document.getElementById("modal-compra-buy").style.display = "none";
}

window.abrirModalCompra = abrirModalCompra;
window.fecharModalCompra = fecharModalCompra;

async function preencherResumoCompra() {
  const sacola = await fetchSacola();

  let subtotal = sacola.reduce((t, i) => t + i.valorTotal, 0);
  document.querySelectorAll("#subtotal-modal").forEach((el) => {
    el.textContent = "R$ " + subtotal.toFixed(2).replace(".", ",");
  });

  window.modalSubtotalBuy = subtotal;
  atualizarFreteCompra(true);
}

// ============================================================
// FRETE
// ============================================================

function atualizarFreteCompra(inicial = false) {
  const cepInput = document.querySelector(".cep");
  const taxaEntregaCarrinho = document.getElementById("taxa-entrega");
  const taxaEntregaModal = document.getElementById("taxa-entrega-modal");
  const valorFrete = document.getElementById("valor-frete");
  const totalCarrinho = document.getElementById("total");
  const totalModal = document.getElementById("total-modal");

  function calcularFrete() {
    const cep = cepInput.value.trim();
    let frete = cep.length === 9 ? 9 : 0;

    valorFrete.textContent = `R$ ${frete.toFixed(2).replace(".", ",")}`;
    taxaEntregaCarrinho.textContent = valorFrete.textContent;
    taxaEntregaModal.textContent = valorFrete.textContent;

    const total = (window.modalSubtotalBuy || 0) + frete;
    totalCarrinho.textContent = `R$ ${total.toFixed(2).replace(".", ",")}`;
    totalModal.textContent = `R$ ${total.toFixed(2).replace(".", ",")}`;
  }

  cepInput.removeEventListener("input", calcularFrete);
  cepInput.addEventListener("input", calcularFrete);

  if (inicial) calcularFrete();
}

// ============================================================
// FINALIZAR COMPRA
// ============================================================
async function finalizarCompra() {
  try {
    const token = localStorage.getItem("tokenCliente");
    if (!token) {
      alert("Você precisa estar logado para finalizar a compra.");
      return;
    }

    let sacola = JSON.parse(localStorage.getItem("Sacola")) || [];

    if (!sacola.length) {
      alert("Sua sacola está vazia.");
      return;
    }

   
    const itens = {};
    sacola.forEach((p, i) => {
      console.log(p)
      itens[`item${i + 1}`] = {
        id_produto: p.idProduto || p.id_produto,
        valor_uni: p.valorUnitario || p.valor_uni,
        qtd: p.quantidade || p.qtd,
      };
    });

    const pedido = {
      itens,
      "id_pagamento": 1,
      "id_entrega":1,
       "id_status": 1

    };

    const res = await fetch(`${API_URL}/pedidos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(pedido),
    });

    const data = await res.json();

    if (!res.ok || data.error) {
      console.error("Erro:", data);
      alert("Erro ao finalizar compra.");
      return;
    }

    alert("Pedido criado com sucesso!");

    localStorage.removeItem("Sacola");

    window.location.reload();
  } catch (err) {
    console.error(err);
    alert("Erro inesperado ao finalizar compra.");
  }
}

window.finalizarCompra = finalizarCompra;

// ============================================================
// PRODUTOS RECOMENDADOS
// ============================================================

document.addEventListener("DOMContentLoaded", function () {
  const produtos = JSON.parse(localStorage.getItem("Produtos")) || [];
  const lojas = JSON.parse(localStorage.getItem("Lojas")) || [];
  const cardsWrapper = document.querySelector(".cards-wrapper");

  function formatarPreco(v) {
    return parseFloat(v).toFixed(2).replace(".", ",");
  }

  function renderizarProdutosAleatorios(lista) {
    cardsWrapper.innerHTML = "";

    if (!lista.length) {
      cardsWrapper.innerHTML = "<p>Nenhum produto encontrado.</p>";
      return;
    }

    const produtosAleatorios = lista
      .sort(() => 0.5 - Math.random())
      .slice(0, 5);

    produtosAleatorios.forEach((produto) => {
      const loja = lojas.find((l) => l.idLoja === parseInt(produto.idLoja));

      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
        <div class="headerNovidade">
          <img src="${loja?.fotoPerfil || ""}" class="logoLoja">
        </div>

        <div class="border-card">
          <img src="${produto.foto}" class="imagem-produto">

          <div class="descricao">
            <h3>${produto.nome}</h3>
            <p>${produto.subtitulo}</p>
          </div>

          <div class="footerNovidades">
            <div class="preco">
              <span>R$</span>
              <span class="valor">${formatarPreco(produto.preco)}</span>
            </div>
          </div>

          <button class="btn-carrinho btn-add-prod" data-id="${
            produto.idProduto
          }">
            <span>Adicionar ao carrinho</span>
            <i class="fas fa-shopping-bag"></i>
          </button>
        </div>
      `;

      cardsWrapper.appendChild(card);
    });

    document.querySelectorAll(".btn-add-prod").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const id = parseInt(btn.dataset.id);

        await fetch("http://localhost:3000/sacola/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idProduto: id }),
        });

        carregarSacola();
      });
    });
  }

  renderizarProdutosAleatorios(produtos);

  document
    .querySelector(".btn-add")
    ?.addEventListener("click", adicionarNaSacola);
});

window.onload = carregarSacola();

const btn = document.getElementById("btn_cartao");
const modal = document.getElementById("modal_cartao");

btn.addEventListener("click", () => {
  if (modal.style.height === "0px" || modal.style.height === "") {
    modal.style.height = modal.scrollHeight + "px";
  } else {
    modal.style.height = "0px";
  }
});

const btnPix = document.getElementById("btn_pix");
const modalPix = document.getElementById("modal_pix");

btnPix.addEventListener("click", () => {
  if (modalPix.style.height === "0px" || modalPix.style.height === "") {
    modalPix.style.height = modalPix.scrollHeight + "px";
  } else {
    modalPix.style.height = "0px";
  }
});

const modalCompra = document.getElementById("modal-compra-buy");
const btnFechar = document.getElementById("fechar_modal");

btnFechar.addEventListener("click", () => {
  modalCompra.style.display = "none";
});

modalCompra.addEventListener("click", (e) => {
  if (e.target === modalCompra) {
    modalCompra.style.display = "none";
  }
});
