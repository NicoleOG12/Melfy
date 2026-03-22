document.addEventListener("DOMContentLoaded", async () => {
  const API_URL = "https://melfy-backend-production.up.railway.app";

  const colunaAberto = document.getElementById("coluna-aberto");
  const colunaPreparo = document.getElementById("coluna-preparo");
  const colunaEntrega = document.getElementById("coluna-entrega");

  async function getPedidos() {
    const pedidosLocal = localStorage.getItem("pedidos");

    if (pedidosLocal) {
      return JSON.parse(pedidosLocal);
    }

    const response = await fetch(`${API_URL}/pedidos`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("tokenLoja")}`,
      },
    });

    return await response.json();
  }

  async function moverCard(card, pedido, novoStatus, novaEtapa) {
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
        card.remove();
        criarCard({ ...pedido, status: novaEtapa }, novaEtapa);
      } else {
        alert("Erro ao atualizar pedido");
      }
    } catch (error) {
      console.error("Erro ao mover card:", error);
    }
  }

  function criarCard(pedido, etapa = pedido.status) {
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

    if (etapa === "Pendente") {
      botoes.innerHTML = `
        <button class="btn btn-accept">Aceitar</button>
        <button class="btn btn-details">Detalhes</button>
        <button class="btn btn-decline">Recusar</button>
      `;
      botoes
        .querySelector(".btn-accept")
        .addEventListener("click", () =>
          moverCard(card, pedido, 2, "Em preparo"),
        );
      botoes
        .querySelector(".btn-decline")
        .addEventListener("click", () =>
          moverCard(card, pedido, 5, "Cancelado"),
        );
      colunaAberto.appendChild(card);
    }

    if (etapa === "Em preparo") {
      botoes.innerHTML = `
        <button class="btn btn-liberar">Liberar</button>
        <button class="btn btn-cancel">Cancelar</button>
      `;
      botoes
        .querySelector(".btn-liberar")
        .addEventListener("click", () => moverCard(card, pedido, 3, "Enviado"));
      botoes
        .querySelector(".btn-cancel")
        .addEventListener("click", () =>
          moverCard(card, pedido, 5, "Cancelado"),
        );
      colunaPreparo.appendChild(card);
    }

    if (etapa === "Enviado") {
      botoes.innerHTML = `
        <button class="btn btn-coletado">Recebido</button>
      `;
      botoes
        .querySelector(".btn-coletado")
        .addEventListener("click", () =>
          moverCard(card, pedido, 4, "Concluido"),
        );
      colunaEntrega.appendChild(card);
    }

    lucide.createIcons();
  }

  const pedidos = await getPedidos();
  console.log(pedidos);
  pedidos.forEach((p) => criarCard(p));
});
