
document.addEventListener("DOMContentLoaded", function () {
  exibirInformacoes();

});




function exibirInformacoes(){
  const usuarioLogadoJSON = localStorage.getItem("usuarioLogado");

  if (!usuarioLogadoJSON) {
    console.warn("Nenhum usuário logado encontrado no localStorage.");
    return;
  }

  const usuarioLogado = JSON.parse(usuarioLogadoJSON);


  document.getElementById('nome-exibir').innerText = usuarioLogado.nome 
  document.getElementById('email-exibir').innerText = usuarioLogado.email
 
}




function abrirModal() {
  const modal = document.getElementById('modalPagamento');
  let usuarios = JSON.parse(localStorage.getItem('Usuários')) || [];
  let usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

  const usuarioIndex = usuarios.findIndex(user => user.id === usuarioLogado.id);
  if (usuarioIndex === -1) {
    alert('Usuário logado não encontrado.');
    return;
  }

  if (!usuarios[usuarioIndex].cartoes) {
    usuarios[usuarioIndex].cartoes = [];
  }

  if (usuarios[usuarioIndex].cartoes.length >= 3) {
    alert('Você já atingiu o limite máximo de 3 cartões.');
    return;
  }

  modal.style.display = 'flex';
}

function fecharModal() {
  const modal = document.getElementById('modalPagamento');
  modal.style.display = 'none';
}

function salvarCartao() {
  let usuarios = JSON.parse(localStorage.getItem('Usuários')) || [];
  let usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

  let nomeTitular = document.getElementById('nomeTitular').value;
  let numeroCartao = document.getElementById('numeroCartao').value;
  let validade = document.getElementById('validade').value;
  let cvv = document.getElementById('cvv').value;
  let tipoCartao = document.getElementById('tipoCartao').value;

  if (!nomeTitular || !numeroCartao || !validade || !cvv || !tipoCartao) {
    alert('Preencha todos os campos!');
    return;
  }

  const usuarioIndex = usuarios.findIndex(user => user.id === usuarioLogado.id);
  if (usuarioIndex === -1) {
    alert('Usuário logado não encontrado.');
    return;
  }

  if (!usuarios[usuarioIndex].cartoes) {
    usuarios[usuarioIndex].cartoes = [];
  }

  if (usuarios[usuarioIndex].cartoes.length >= 3) {
    alert('Você já atingiu o limite máximo de 3 cartões.');
    return;
  }

  usuarios[usuarioIndex].cartoes.push({
    nomeTitular,
    numeroCartao,
    validade,
    cvv, 
    tipoCartao
  });

  localStorage.setItem('Usuários', JSON.stringify(usuarios));
  fecharModal();
  renderizarCartoes();
}

function renderizarCartoes() {
  const container = document.querySelector('.formas-pagamento-wrapper');

  const botaoAdicionar = document.getElementById('add-pag')
  let usuarios = JSON.parse(localStorage.getItem('Usuários')) || [];
  let usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

  const usuario = usuarios.find(user => user.id === usuarioLogado.id);
  if (!usuario || !usuario.cartoes) return;

  usuario.cartoes.forEach((cartao, index) => {
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

// Formatar número do cartão
function formatarNumero(input) {
  let valor = input.value.replace(/\D/g, '');
  valor = valor.replace(/(.{4})/g, '$1 ').trim();
  input.value = valor;
}

// Formatar validade
function formatarValidade(input) {
  let valor = input.value.replace(/\D/g, '');
  if (valor.length >= 3) {
    valor = valor.replace(/(\d{2})(\d{1,2})/, '$1/$2');
  }
  input.value = valor;
}

// Ao carregar a página
window.onload = () => {
  renderizarCartoes();
};



