import { rotasCliente } from "../rotas.js";
import { openModal, adicionarNaSacola } from "../modal.js";

// ============================================================
// API URL
// ============================================================
const API_URL = "https://melfy-backend-production.up.railway.app";

// ============================================================
// BUSCAR SACOLA DO BACKEND
// ============================================================
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
// RENDERIZAR CARRINHO
// ============================================================
function renderizarCarrinhoCarrinhoAPI(data) {
  const tbody = document.querySelector("#tabela-carrinho");
  const subtotalSpan = document.querySelector("#subtotal");
  const totalSpan = document.querySelector("#total");

  tbody.innerHTML = "";
  let subtotal = 0;

  const lojasAgrupadas = {};
  data.forEach((produto, idx) => {
    const id_loja = produto.id_loja || 0;

    if (!lojasAgrupadas[id_loja]) {
      lojasAgrupadas[id_loja] = {
        id_loja,
        nomeLoja: produto.nomeLoja || "Loja",
        logoLoja: produto.logoLoja || "img/default-loja.png",
        itens: [],
      };
    }

    lojasAgrupadas[id_loja].itens.push({
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
            <input type="checkbox" class="check-produto" data-index="${idx}" data-id_loja="${loja.id_loja}" checked onchange="atualizarTotal()">
            <img src="${imagem}" alt="${nome}" class="foto-produto">
            <div class="info">
              <h3>${nome}</h3>
            </div>
          </div>
        </td>
        <td>R$ ${valorUnit.toFixed(2).replace(".", ",")}</td>
        <td>
          <div class="qtd">
            <button onclick="alterarQuantidadeSacola(${idx}, -1)"><i class='bx bx-minus'></i></button>
            <span>${item.quantidade}</span>
            <button onclick="alterarQuantidadeSacola(${idx}, 1)"><i class='bx bx-plus'></i></button>
          </div>
        </td>
        <td>R$ ${(valorUnit * item.quantidade).toFixed(2).replace(".", ",")}</td>
        <td>
          <button class="remover" onclick="removerItem(${idx})"><i class='bx bx-x'></i></button>
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
  let sacola = JSON.parse(localStorage.getItem("Sacola")) || [];
  if (!sacola[index]) return;

  const item = sacola[index];
  const token = localStorage.getItem("tokenCliente");

  try {
    if (delta === 0) return;

    let res;

    if (delta > 0) {
      res = await fetch(`${API_URL}/carrinho?id=${item.id_produto}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ qtd: delta }),
      });
    } else {
      res = await fetch(`${API_URL}/carrinho?id=${item.id_produto}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ qtd: Math.abs(delta) }),
      });
    }

    const data = await res.json();
    if (!res.ok || data.error) throw data;

    if (delta < 0 && item.quantidade + delta <= 0) {
      sacola.splice(index, 1);
    } else {
      item.quantidade += delta;
    }

    if (sacola[index]) {
      item.valorTotal = item.quantidade * (item.valorUnitario || item.valor_uni);
    }

    localStorage.setItem("Sacola", JSON.stringify(sacola));
    renderizarCarrinhoCarrinhoAPI(sacola);
    atualizarTotal();

  } catch (err) {
    alertError("Não foi possível atualizar a quantidade no servidor.");
    console.error(err);
    await carregarSacola();
  }
}

window.alterarQuantidadeSacola = alterarQuantidadeSacola;

window.removerItem = async function (index) {
  if (!confirm("Tem certeza que deseja remover este item da sacola?")) return;

  let sacola = JSON.parse(localStorage.getItem("Sacola")) || [];
  const item = sacola[index];
  if (!item) return;

  const token = localStorage.getItem("tokenCliente");
  try {
    const res = await fetch(`${API_URL}/carrinho?id=${item.id_produto}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ qtd: item.quantidade }), 
    });
    const data = await res.json();
    if (!res.ok || data.error) throw data;

    sacola.splice(index, 1);
    localStorage.setItem("Sacola", JSON.stringify(sacola));
    renderizarCarrinhoCarrinhoAPI(sacola);
    atualizarTotal();
  } catch (err) {
    alertError("Não foi possível remover o item do carrinho.");
    console.error(err);
    await carregarSacola();
  }
};

// ============================================================
// TOTAL
// ============================================================
async function atualizarTotal() {
  const checkboxes = document.querySelectorAll(".check-produto");
  const sacola = JSON.parse(localStorage.getItem("Sacola")) || [];

  let subtotal = 0;

  checkboxes.forEach(cb => {
    if (cb.checked) {
      const item = sacola[parseInt(cb.dataset.index)];
      if (item) {
        const valorUnit = parseFloat(item.valor_uni || item.valorUnitario || 0);
        const quantidade = parseInt(item.quantidade || 1);
        subtotal += valorUnit * quantidade;
      }
    }
  });

  document.querySelector("#subtotal").textContent =
    "R$ " + subtotal.toFixed(2).replace(".", ",");
  document.querySelector("#total").textContent =
    "R$ " + subtotal.toFixed(2).replace(".", ",");
}
window.atualizarTotal = atualizarTotal;


function LojaCheckbox(el) {
  const id_loja = el.dataset.id_loja;
  const cbs = document.querySelectorAll(`.check-produto[data-id_loja="${id_loja}"]`);
  cbs.forEach(c => (c.checked = el.checked));
  atualizarTotal();
}
window.LojaCheckbox = LojaCheckbox;

// ============================================================
// MODAL DE COMPRA
// ============================================================
function abrirModalCompra() {
  const modal = document.getElementById("modal-compra-buy");
  modal.style.display = "flex";
  setTimeout(preencherResumoCompra, 50);
}

function fecharModalCompra() {
  document.getElementById("modal-compra-buy").style.display = "none";
}
window.abrirModalCompra = abrirModalCompra;
window.fecharModalCompra = fecharModalCompra;

async function preencherResumoCompra() {
  const sacola = await carregarSacola();
  let subtotal = sacola.reduce((t, i) => {
    const valorUnitario = parseFloat(i.valor_uni || i.valorUnitario || 0);
    const quantidade = parseInt(i.quantidade || i.qtd || 1);
    return t + valorUnitario * quantidade;
  }, 0);

  const subtotalModalSpan = document.querySelector("#modal-compra-buy #subtotal-modal");
  if (subtotalModalSpan) {
    subtotalModalSpan.textContent = "R$ " + subtotal.toFixed(2).replace(".", ",");
  }

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

// Função para aplicar máscara de CEP
function aplicarMascaraCEP(input) {
  input.addEventListener("input", () => {
    let valor = input.value.replace(/\D/g, ""); // remove tudo que não é número
    if (valor.length > 5) {
      valor = valor.replace(/^(\d{5})(\d)/, "$1-$2"); // adiciona o hífen após 5 dígitos
    }
    input.value = valor;
  });
}

// Aplica a máscara em todos os inputs com classe "cep"
document.querySelectorAll(".cep").forEach(aplicarMascaraCEP);

// Validação extra ao enviar o formulário
const form = document.querySelector("form"); // seu formulário
if (form) {
  form.addEventListener("submit", (e) => {
    const cepInput = document.querySelector(".cep");
    if (!cepInput.value || cepInput.value.length !== 9) {
      e.preventDefault();
      alertWarning("Por favor, preencha um CEP válido (XXXXX-XX).");
// FINALIZAR COMPRA
// ============================================================
async function finalizarCompra() {
  try {
    const token = localStorage.getItem("tokenCliente");
    if (!token) {
      alertWarning("Você precisa estar logado para finalizar a compra.");
      return;
    }

    let sacola = JSON.parse(localStorage.getItem("Sacola")) || [];
    if (!sacola.length) {
      alertWarning("Sua sacola está vazia.");
      return;
    }

    const itens = {};
    sacola.forEach((p, i) => {
      itens[`item${i + 1}`] = {
        id_produto: p.idProduto || p.id_produto,
        valor_uni: p.valorUnitario || p.valor_uni,
        qtd: p.quantidade || p.qtd,
      };
    });

    const pedido = {
      itens,
      id_pagamento: 1,
      id_entrega: 1,
      id_status: 1,
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
      alertError("Erro ao finalizar compra.");
      return;
    }

    alertSuccess("Pedido criado com sucesso!");

    for (const item of sacola) {
      await fetch(`${API_URL}/carrinho?id=${item.id_produto}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ qtd: item.quantidade }),
      });
    }

    localStorage.removeItem("Sacola");

    renderizarCarrinhoCarrinhoAPI([]);
    document.querySelector("#subtotal").textContent = "R$ 0,00";
    document.querySelector("#total").textContent = "R$ 0,00";

    fecharModalCompra();
  } catch (err) {
    console.error(err);
    alertError("Erro inesperado ao finalizar compra.");
  }
}
window.finalizarCompra = finalizarCompra;

// ============================================================
// BUSCAR PRODUTOS E LOJAS DA API
// ============================================================
async function buscarProdutosAPI() {
  try {
    const res = await fetch(`${API_URL}/produtos`);
    const data = await res.json();
    return data.result || [];
  } catch (err) {
    console.error("Erro ao buscar produtos:", err);
    return [];
  }
}

async function buscarLojasAPI() {
  try {
    const res = await fetch(`${API_URL}/lojas`);
    const data = await res.json();
    return data.result || [];
  } catch (err) {
    console.error("Erro ao buscar lojas:", err);
    return [];
  }
}

// ============================================================
// FUNÇÕES AUXILIARES
// ============================================================
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

// ============================================================
// RENDERIZAR PRODUTOS ALEATÓRIOS
// ============================================================
function renderizarProdutosAleatorios(produtos, lojas) {
  const cardsWrapper = document.querySelector('.cards-wrapper');
  cardsWrapper.innerHTML = '';

  const produtosAleatorios = produtos
    .slice()
    .sort(() => 0.5 - Math.random())
    .slice(0, 5);

  produtosAleatorios.forEach(produto => {
    const lojaEncontrada = lojas.find(l => l.id_loja == produto.id_loja);
    const loja = {
      id: produto.id_loja,
      nome: produto.loja_nome,
      pfp: produto.pfp
    };

    const card = document.createElement('div');
    card.classList.add('card');

    card.innerHTML = `
      <div class="headerNovidade">
        <img src="${loja.pfp}" alt="Logo da Loja" class="logoLoja" />
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
        <button class="btn-carrinho add-carrinho-btn" data-id="${produto.id_produto}">
          <span>Adicionar ao carrinho</span>
          <i class="fas fa-shopping-bag"></i>
        </button>
      </div>
    `;

    card.querySelector('.logoLoja').addEventListener('click', e => {
      e.stopPropagation();
      window.location.href = `${rotasCliente.loja}?id=${loja.id}`;
    });

    card.addEventListener('click', e => {
      if (!e.target.closest('.headerNovidade'))
        openModal(produto, lojas, rotasCliente);
    });

    cardsWrapper.appendChild(card);
  });
}

// ============================================================
// INICIALIZAÇÃO AO CARREGAR A PÁGINA
// ============================================================
document.addEventListener('DOMContentLoaded', async () => {
  const lojas = await buscarLojasAPI();
  const produtos = await buscarProdutosAPI();
  renderizarProdutosAleatorios(produtos, lojas);

  document.querySelector('.btn-add')?.addEventListener('click', adicionarNaSacola);
  carregarSacola();
});

// ============================================================
// MODAIS DE PAGAMENTO
// ============================================================
const btn = document.getElementById("btn_cartao");
const modal = document.getElementById("modal_cartao");

btn.addEventListener("click", () => {
  modal.style.height = (modal.style.height === "0px" || modal.style.height === "") 
    ? modal.scrollHeight + "px" 
    : "0px";
});

const btnPix = document.getElementById("btn_pix");
const modalPix = document.getElementById("modal_pix");

const modalCompra = document.getElementById("modal-compra-buy");
const btnFechar = document.getElementById("fechar_modal");

btnFechar.addEventListener("click", () => modalCompra.style.display = "none");
modalCompra.addEventListener("click", e => {
  if (e.target === modalCompra) modalCompra.style.display = "none";
});
