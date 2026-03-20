document.addEventListener("DOMContentLoaded", async () => {
  const API_URL = "https://melfy-backend-production.up.railway.app";

  let pedidos = JSON.parse(localStorage.getItem("pedidos"));

  if (!pedidos) {
    try {
      const response = await fetch(`${API_URL}/pedidos`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("tokenLoja")}`,
        },
      });

      pedidos = await response.json();
      localStorage.setItem("pedidos", JSON.stringify(pedidos));
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
      pedidos = [];
    }
  }

  const colunaAberto = document.getElementById("coluna-aberto");
  const colunaPreparo = document.getElementById("coluna-preparo");
  const colunaEntrega = document.getElementById("coluna-entrega");

  function salvarPedidos() {
    localStorage.setItem("pedidos", JSON.stringify(pedidos));
  }

  function finalizarPedido(pedidoId) {
    pedidos = pedidos.filter(p => p.id_pedido !== pedidoId);
    salvarPedidos();
  }

  function criarCard(pedido, destino, etapa = "aberto") {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="card-header">
        <span><i data-lucide="receipt"></i> Pedido #${pedido.id_pedido}</span>
        <span><i data-lucide="clock-3"></i> 1 min </span>
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

    if (etapa === "aberto") {
      botoes.innerHTML = `
        <button class="btn btn-accept">Aceitar</button>
        <button class="btn btn-details">Detalhes</button>
        <button class="btn btn-decline">Recusar</button>
      `;

      botoes.querySelector(".btn-accept").onclick = () =>
        moverCard(card, pedido, "preparo");
      botoes.querySelector(".btn-decline").onclick = () => {
        card.remove();
        finalizarPedido(pedido.id_pedido);
      };
    }

    if (etapa === "preparo") {
      botoes.innerHTML = `
        <button class="btn btn-liberar">Liberar</button>
        <button class="btn btn-cancel">Cancelar</button>
      `;

      botoes.querySelector(".btn-liberar").onclick = () =>
        moverCard(card, pedido, "entrega");
      botoes.querySelector(".btn-cancel").onclick = () => {
        card.remove();
        finalizarPedido(pedido.id_pedido); 
      };
    }

    if (etapa === "entrega") {
      botoes.innerHTML = `
        <button class="btn btn-coletado">Coletado</button>
      `;

      botoes.querySelector(".btn-coletado").onclick = () => {
        card.remove();
        finalizarPedido(pedido.id_pedido); 
      };
    }

    destino.appendChild(card);
    if (window.lucide) lucide.createIcons(); 
  }

  function moverCard(card, pedido, proximaEtapa) {
    card.remove();
    if (proximaEtapa === "preparo") criarCard(pedido, colunaPreparo, "preparo");
    if (proximaEtapa === "entrega") criarCard(pedido, colunaEntrega, "entrega");
  }

  pedidos.forEach(p => criarCard(p, colunaAberto));
});