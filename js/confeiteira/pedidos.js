document.addEventListener("DOMContentLoaded", async () => {
  const API_URL = "https://melfy-backend-production.up.railway.app";

  const colunaAberto = document.getElementById("coluna-aberto");
  const colunaPreparo = document.getElementById("coluna-preparo");
  const colunaEntrega = document.getElementById("coluna-entrega");
  const countBadge = document.getElementById('countBadge')

  async function getPedidos() {
    const response = await fetch(`${API_URL}/pedidos`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("tokenLoja")}`,
      },
    });
    const data = await response.json();
    
countBadge.textContent = data.result.filter(p => p.status !== "Entregue").length;
return data.result ?? [];;
  }

  // ✅ Limpa todas as colunas antes de re-renderizar
  function limparColunas() {
    colunaAberto.innerHTML = "";
    colunaPreparo.innerHTML = "";
    colunaEntrega.innerHTML = "";
  }

  async function moverCard(card, pedido, novoStatus) {
    try {
      const response = await fetch(
        `${API_URL}/pedidos?id=${pedido.id_pedido}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("tokenLoja")}`,
          },
          body: JSON.stringify({ status: novoStatus }),
        },
      );

      const data = await response.json();

      if (!data.error) {
        // ✅ Limpa colunas antes de re-renderizar
        limparColunas();
        const pedidos = await getPedidos();
        pedidos.forEach((p) => criarCard(p));
      } else {
        alert("Erro ao atualizar pedido");
      }
    } catch (error) {
      console.error("Erro ao mover card:", error);
    }
  }

  function criarCard(pedido) {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="card-header">
        <span><i data-lucide="receipt"></i> Pedido #${pedido.id_pedido}</span>
        <span><i data-lucide="clock-3"></i> 1 min</span>
      </div>
      <div class="card-info">
        <p><i data-lucide="user"></i> <strong>${pedido.nome_cliente}</strong></p>
        <div class="valor-pagamento">
          <p><i data-lucide="wallet"></i> ${pedido.valor_total}</p>
          <p><i data-lucide="credit-card"></i> ${pedido.tipo_pagamento}</p>
        </div>
      </div>
      <div class="actions"></div>
    `;

    const botoes = card.querySelector(".actions");

    if (pedido.status === "Pendente") {
      botoes.innerHTML = `
        <button class="btn btn-accept">Aceitar</button>
        <button class="btn btn-details">Detalhes</button>
        <button class="btn btn-decline">Recusar</button>
      `;
      botoes
        .querySelector(".btn-accept")
        .addEventListener("click", () => moverCard(card, pedido, 2));
      botoes
        .querySelector(".btn-decline")
        .addEventListener("click", () => moverCard(card, pedido, 5));
      colunaAberto.appendChild(card);
    }

    if (pedido.status === "Em preparo") {
      botoes.innerHTML = `
        <button class="btn btn-liberar">Liberar</button>
        <button class="btn btn-cancel">Cancelar</button>
      `;
      botoes
        .querySelector(".btn-liberar")
        .addEventListener("click", () => moverCard(card, pedido, 3));
      botoes
        .querySelector(".btn-cancel")
        .addEventListener("click", () => moverCard(card, pedido, 5));
      colunaPreparo.appendChild(card);
    }

    if (pedido.status === "Enviado") {
      botoes.innerHTML = `
        <button class="btn btn-coletado">Recebido</button>
      `;
      botoes
        .querySelector(".btn-coletado")
        .addEventListener("click", () => moverCard(card, pedido, 4));
      colunaEntrega.appendChild(card);
    }

    lucide.createIcons();
  }

  // ✅ `pedidos` agora é variável local (não global acidentalmente)
  const pedidos = await getPedidos();
  console.log(pedidos);
  pedidos.forEach((p) => criarCard(p));
});