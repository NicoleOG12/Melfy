document.addEventListener("DOMContentLoaded", () => {
  const pedidos = [
    { id: 101, minutos: 5, nome: "Clara Mendes", valor: "R$ 48,90", pagamento: "Pix" },
    { id: 102, minutos: 12, nome: "Lucas Santos", valor: "R$ 32,50", pagamento: "Cartão" },
    { id: 103, minutos: 20, nome: "Beatriz Lima", valor: "R$ 59,00", pagamento: "Dinheiro" },
    { id: 101, minutos: 5, nome: "Clara Mendes", valor: "R$ 48,90", pagamento: "Pix" },
    { id: 102, minutos: 12, nome: "Lucas Santos", valor: "R$ 32,50", pagamento: "Cartão" },
    { id: 103, minutos: 20, nome: "Beatriz Lima", valor: "R$ 59,00", pagamento: "Dinheiro" }
  ];

  const colunaAberto = document.getElementById("coluna-aberto");
  const colunaPreparo = document.getElementById("coluna-preparo");
  const colunaEntrega = document.getElementById("coluna-entrega");

  pedidos.forEach(p => criarCard(p, colunaAberto));

  function criarCard(pedido, destino, etapa = "aberto") {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="card-header">
        <span><i data-lucide="receipt"></i> Pedido #${pedido.id}</span>
        <span><i data-lucide="clock-3"></i> ${pedido.minutos} min</span>
      </div>

      <div class="card-info">
        <p><i data-lucide="user"></i> <strong>${pedido.nome}</strong></p>
        <div class="valor-pagamento">
          <p><i data-lucide="wallet"></i> ${pedido.valor}</p>
          <p><i data-lucide="credit-card"></i> ${pedido.pagamento}</p>
        </div>
      </div>

      <div class="actions"></div>
    `;

    const botoes = card.querySelector(".actions");

    if (etapa === "aberto") {
      botoes.innerHTML = `
        <button class="btn btn-accept" aria-label="Aceitar pedido ${pedido.nome}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17l-5-5" stroke="var(--success)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Aceitar
        </button>

        <button class="btn btn-details" aria-label="Detalhes do pedido ${pedido.nome}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#4a2b1d" stroke-width="2"/>
            <path d="M12 16v-4m0-4h.01" stroke="#4a2b1d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Detalhes
        </button>

        <button class="btn btn-decline" aria-label="Recusar pedido ${pedido.nome}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="#FF6B6B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Recusar
        </button>
      `;

      botoes.querySelector(".btn-accept").onclick = () => moverCard(card, pedido, "preparo");
      botoes.querySelector(".btn-decline").onclick = () => card.remove();
    }

    if (etapa === "preparo") {
      botoes.innerHTML = `
        <button class="btn btn-liberar" aria-label="Liberar entrega">
          <i data-lucide="truck"></i> Liberar
        </button>

        <button class="btn btn-cancel" aria-label="Cancelar pedido">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="#FF6B6B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Cancelar
        </button>
      `;

      botoes.querySelector(".btn-liberar").onclick = () => moverCard(card, pedido, "entrega");
      botoes.querySelector(".btn-cancel").onclick = () => card.remove();
    }

    if (etapa === "entrega") {
      botoes.innerHTML = `
        <button class="btn btn-coletado" aria-label="Marcar como coletado">
          <i data-lucide="package-check"></i> Coletado
        </button>
      `;

      botoes.querySelector(".btn-coletado").onclick = () => card.remove();
    }

    destino.appendChild(card);
    lucide.createIcons();
  }

  function moverCard(card, pedido, proximaEtapa) {
    card.remove();
    if (proximaEtapa === "preparo") criarCard(pedido, colunaPreparo, "preparo");
    if (proximaEtapa === "entrega") criarCard(pedido, colunaEntrega, "entrega");
  }
});
