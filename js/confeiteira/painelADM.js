function mostrarSecao(id) {
  document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

let ingredientes = [];

function atualizarTabela() {
  const tbody = document.querySelector("#tabelaIngredientes tbody");
  tbody.innerHTML = "";

  ingredientes.forEach((ing, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${ing.nome}</td>
      <td>${ing.gramas.toFixed(2)}</td>
      <td>R$ ${ing.preco.toFixed(2)}</td>
      <td>
        <button class="btn btn-consumir" onclick="consumir(${index})">Consumir</button>
        <button class="btn btn-adicionar" onclick="adicionarMais(${index})">Adicionar</button>
        <button class="btn btn-remove" onclick="remover(${index})">Remover</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  const total = ingredientes.reduce((acc, ing) => acc + ing.preco, 0);
  document.getElementById("total").innerText = `Total Gasto: R$ ${total.toFixed(2)}`;
}

function adicionarIngrediente() {
  const nome = document.getElementById("nome").value.trim();
  const gramas = parseFloat(document.getElementById("gramas").value);
  const preco = parseFloat(document.getElementById("preco").value);

  if (!nome || isNaN(gramas) || isNaN(preco)) {
    alert("Preencha todos os campos corretamente.");
    return;
  }

  const existente = ingredientes.find(ing => ing.nome.toLowerCase() === nome.toLowerCase());

  if (existente) {
    existente.gramas += gramas;
    existente.preco += preco;
  } else {
    ingredientes.push({ nome, gramas, preco });
  }

  document.getElementById("nome").value = "";
  document.getElementById("gramas").value = "";
  document.getElementById("preco").value = "";

  atualizarTabela();
}

function consumir(index) {
  const quantidade = prompt("Quantas gramas deseja consumir?");
  const gramasConsumidas = parseFloat(quantidade);

  if (isNaN(gramasConsumidas) || gramasConsumidas <= 0) {
    alert("Valor inválido.");
    return;
  }

  if (gramasConsumidas > ingredientes[index].gramas) {
    alert("Você não tem essa quantidade disponível.");
    return;
  }

  ingredientes[index].gramas -= gramasConsumidas;
  atualizarTabela();
}

function adicionarMais(index) {
  const novaGrama = prompt("Quantas gramas deseja adicionar?");
  const novoPreco = prompt("Qual o valor pago por essas gramas?");
  const g = parseFloat(novaGrama);
  const p = parseFloat(novoPreco);

  if (isNaN(g) || isNaN(p) || g <= 0 || p < 0) {
    alert("Valores inválidos.");
    return;
  }

  ingredientes[index].gramas += g;
  ingredientes[index].preco += p;
  atualizarTabela();
}

function remover(index) {
  if (confirm("Deseja remover este ingrediente?")) {
    ingredientes.splice(index, 1);
    atualizarTabela();
  }
}

let lucros = [];

function atualizarLucros() {
  const tbody = document.querySelector("#tabelaLucros tbody");
  tbody.innerHTML = "";

  lucros.forEach((item, index) => {
    const total = item.valorVenda * item.quantidade;
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${item.produto}</td>
      <td>R$ ${item.valorVenda.toFixed(2)}</td>
      <td>${item.quantidade}</td>
      <td>R$ ${(total).toFixed(2)}</td>
      <td><button class="btn btn-remove" onclick="removerLucro(${index})">Remover</button></td>
    `;
    tbody.appendChild(tr);
  });

  const totalLucro = lucros.reduce((acc, item) => acc + (item.valorVenda * item.quantidade), 0);
  document.getElementById("totalLucro").innerText = `Lucro Bruto Total: R$ ${totalLucro.toFixed(2)}`;
}

function adicionarLucro() {
  const produto = document.getElementById("produto").value.trim();
  const valorVenda = parseFloat(document.getElementById("valorVenda").value);
  const quantidade = parseInt(document.getElementById("quantidade").value);

  if (!produto || isNaN(valorVenda) || isNaN(quantidade)) {
    alert("Preencha todos os campos corretamente.");
    return;
  }

  lucros.push({ produto, valorVenda, quantidade });

  document.getElementById("produto").value = "";
  document.getElementById("valorVenda").value = "";
  document.getElementById("quantidade").value = "";

  atualizarLucros();
}

function removerLucro(index) {
  if (confirm("Deseja remover este produto?")) {
    lucros.splice(index, 1);
    atualizarLucros();
  }
}

function gerarResumo() {
  const totalGasto = ingredientes.reduce((acc, ing) => acc + ing.preco, 0);
  const totalLucro = lucros.reduce((acc, item) => acc + (item.valorVenda * item.quantidade), 0);
  const lucroFinal = totalLucro - totalGasto;

  const texto = `
    <strong>Total Gasto:</strong> R$ ${totalGasto.toFixed(2)}<br>
    <strong>Lucro Bruto:</strong> R$ ${totalLucro.toFixed(2)}<br>
    <strong>Lucro Final:</strong> R$ ${lucroFinal.toFixed(2)}
  `;

  document.getElementById("resumoFinal").innerHTML = texto;
}
