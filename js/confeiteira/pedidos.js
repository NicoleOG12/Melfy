const pedidos = [
  { nome: "João Silva", pedido: "#00123", data: "24/05/2025 - 14:32", status: "aguardando" },
  { nome: "Maria Souza", pedido: "#00124", data: "24/05/2025 - 15:18", status: "aprovado" },
  { nome: "Pedro Lima", pedido: "#00125", data: "24/05/2025 - 16:03", status: "aprovado" },
  { nome: "Ana Paula", pedido: "#00126", data: "25/05/2025 - 09:22", status: "rejeitado" },
  { nome: "Lucas Mendes", pedido: "#00127", data: "25/05/2025 - 10:45", status: "aguardando" },
];

const cores = ["#fff8a6", "#a6f0ff", "#ffa6a6", "#a6ffa6", "#f0a6ff"];

function criarPostIt(pedido, index) {
  const a = document.createElement("a");
  a.href = "detalhesPedido.html";
  a.className = "post-it";

  a.classList.add(index % 2 === 0 ? "left" : "right");

  a.style.backgroundColor = cores[index % cores.length];
  
  a.innerHTML = `
    <h3>${pedido.nome}</h3>
    <p><strong>Pedido:</strong> ${pedido.pedido}</p>
    <p><strong>Data/Hora:</strong> ${pedido.data}</p>
    <p class="status ${pedido.status}">${statusEmoji(pedido.status)} ${statusTexto(pedido.status)}</p>
  `;

  return a;
}

function statusEmoji(status) {
  switch (status) {
    case "aguardando": return "⏳";
    case "aprovado": return "✅";
    case "rejeitado": return "❌";
    default: return "";
  }
}

function statusTexto(status) {
  switch (status) {
    case "aguardando": return "Em análise";
    case "aprovado": return "Aprovado";
    case "rejeitado": return "Rejeitado";
    default: return "";
  }
}

function init() {
  const container = document.getElementById("quadro-pedidos");
  pedidos.forEach((pedido, index) => {
    const postIt = criarPostIt(pedido, index);
    container.appendChild(postIt);
  });
}

window.onload = init;
