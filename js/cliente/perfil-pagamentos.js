import { rotasGerais } from '../rotas.js';

document.addEventListener("DOMContentLoaded", function () {
  exibirInformacoes();
});

function exibirInformacoes(){
  const usuarioLogadoJSON = localStorage.getItem("usuarioLogado");
  const confeiteiraLogadaJSON = localStorage.getItem("confeiteiraLogada");

  let usuarioAtual = null;

  if (usuarioLogadoJSON) {
    usuarioAtual = JSON.parse(usuarioLogadoJSON);
  } else if (confeiteiraLogadaJSON) {
    usuarioAtual = JSON.parse(confeiteiraLogadaJSON);
  } else {
    console.warn("Nenhum usuário ou confeiteira logada encontrado no localStorage.");
    return;
  }

  document.getElementById('nome-exibir').innerText = usuarioAtual.nome;
  document.getElementById('email-exibir').innerText = usuarioAtual.email;
}

function abrirModal() {
  const modal = document.getElementById('modalPagamento');
  let usuarios = JSON.parse(localStorage.getItem('Usuários')) || [];
  let confeiteiras = JSON.parse(localStorage.getItem('Confeiteiras')) || [];
  const usuarioAtualJSON = localStorage.getItem('usuarioLogado') || localStorage.getItem('confeiteiraLogada');
  const usuarioAtual = JSON.parse(usuarioAtualJSON);

  let registro;
  if (localStorage.getItem('confeiteiraLogada')) {
    registro = confeiteiras.find(c => c.id === usuarioAtual.id);
    if (!registro) {
      alert('Confeiteira logada não encontrada.');
      return;
    }
    if (!registro.cartoes) registro.cartoes = [];
    if (registro.cartoes.length >= 3) {
      alert('Você já atingiu o limite máximo de 3 cartões.');
      return;
    }
  } else {
    registro = usuarios.find(u => u.id === usuarioAtual.id);
    if (!registro) {
      alert('Usuário logado não encontrado.');
      return;
    }
    if (!registro.cartoes) registro.cartoes = [];
    if (registro.cartoes.length >= 3) {
      alert('Você já atingiu o limite máximo de 3 cartões.');
      return;
    }
  }

  modal.style.display = 'flex';
}

function fecharModal() {
  const modal = document.getElementById('modalPagamento');
  modal.style.display = 'none';
}

function salvarCartao() {
  let usuarios = JSON.parse(localStorage.getItem('Usuários')) || [];
  let confeiteiras = JSON.parse(localStorage.getItem('Confeiteiras')) || [];
  const usuarioAtualJSON = localStorage.getItem('usuarioLogado') || localStorage.getItem('confeiteiraLogada');
  const usuarioAtual = JSON.parse(usuarioAtualJSON);

  let nomeTitular = document.getElementById('nomeTitular').value;
  let numeroCartao = document.getElementById('numeroCartao').value;
  let validade = document.getElementById('validade').value;
  let cvv = document.getElementById('cvv').value;
  let tipoCartao = document.getElementById('tipoCartao').value;

  if (!nomeTitular || !numeroCartao || !validade || !cvv || !tipoCartao) {
    alert('Preencha todos os campos!');
    return;
  }

  if (localStorage.getItem('confeiteiraLogada')) {
    let index = confeiteiras.findIndex(c => c.id === usuarioAtual.id);
    if (index === -1) {
      usuarioAtual.cartoes = usuarioAtual.cartoes || [];
      usuarioAtual.cartoes.push({ nomeTitular, numeroCartao, validade, cvv, tipoCartao });
      localStorage.setItem('confeiteiraLogada', JSON.stringify(usuarioAtual));
    } else {
      if (!confeiteiras[index].cartoes) confeiteiras[index].cartoes = [];
      confeiteiras[index].cartoes.push({ nomeTitular, numeroCartao, validade, cvv, tipoCartao });
      localStorage.setItem('Confeiteiras', JSON.stringify(confeiteiras));
    }
  } else {
    let index = usuarios.findIndex(u => u.id === usuarioAtual.id);
    if (index === -1) {
      alert('Usuário logado não encontrado.');
      return;
    }
    if (!usuarios[index].cartoes) usuarios[index].cartoes = [];
    usuarios[index].cartoes.push({ nomeTitular, numeroCartao, validade, cvv, tipoCartao });
    localStorage.setItem('Usuários', JSON.stringify(usuarios));
  }

  fecharModal();
  renderizarCartoes();
}

function renderizarCartoes() {
  const container = document.querySelector('.formas-pagamento-wrapper');
  const botaoAdicionar = document.getElementById('add-pag');
  const usuarioAtualJSON = localStorage.getItem('confeiteiraLogada') || localStorage.getItem('usuarioLogado');
  const usuarioAtual = JSON.parse(usuarioAtualJSON);
  const usuarios = JSON.parse(localStorage.getItem('Usuários')) || [];
  const confeiteiras = JSON.parse(localStorage.getItem('Confeiteiras')) || [];

  let registro;
  if (localStorage.getItem('confeiteiraLogada')) {
    registro = confeiteiras.find(c => c.id === usuarioAtual.id) || usuarioAtual;
  } else {
    registro = usuarios.find(u => u.id === usuarioAtual.id) || usuarioAtual;
  }

  if (!registro || !registro.cartoes) return;

  container.innerHTML = '';
  registro.cartoes.forEach((cartao, index) => {
    const div = document.createElement('div');
    div.className = 'forma-cartao';
    div.innerHTML = `
      <div class="info-cartao">
        <p><strong>${cartao.tipoCartao}</strong></p>
        <p>nº ${cartao.numeroCartao}</p>
      </div>
      <div class="info-direita">
        <p>${cartao.nomeTitular}</p>
        <span>#${index + 1}</span>
      </div>
    `;
    container.appendChild(div);
  });

  if (botaoAdicionar) container.appendChild(botaoAdicionar);
}

function formatarNumero(input) {
  let valor = input.value.replace(/\D/g, '');
  valor = valor.replace(/(.{4})/g, '$1 ').trim();
  input.value = valor;
}

function formatarValidade(input) {
  let valor = input.value.replace(/\D/g, '');
  if (valor.length >= 3) {
    valor = valor.replace(/(\d{2})(\d{1,2})/, '$1/$2');
  }
  input.value = valor;
}

window.sairConta = function() {
  localStorage.removeItem("tokenCliente");
  localStorage.removeItem("infoCliente");
  alert("Você realizou o Logout. Até breve!");
  window.location.href = rotasGerais.home;
}

window.onload = () => {
  renderizarCartoes();
};
