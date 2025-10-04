document.addEventListener("DOMContentLoaded", function () {
  exibirInformacoes();
  renderizarEnderecos();
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
  let modal = document.getElementById('modal');
  let usuarios = JSON.parse(localStorage.getItem('Usuários')) || [];
  let usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

  const usuarioIndex = usuarios.findIndex(user => user.id === usuarioLogado.id);
  if (usuarioIndex === -1) {
    alert('Usuário logado não encontrado.');
    return;
  }

  if (!usuarios[usuarioIndex].enderecos) {
    usuarios[usuarioIndex].enderecos = [];
  }

  if (usuarios[usuarioIndex].enderecos.length >= 3) {
    alert('Você já atingiu o limite máximo de 3 endereços.');
    return;
  }

  modal.style.display = 'flex';
}

function fecharModal() {
  let modal = document.getElementById('modal');
  modal.style.display = 'none';
}

function adicionarEndereco() {
  let usuarios = JSON.parse(localStorage.getItem('Usuários')) || [];
  let usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

  let logradouro = document.getElementById('logradouro').value;
  let numero = document.getElementById('numero').value;
  let complemento = document.getElementById('complemento').value;
  let bairro = document.getElementById('bairro').value;
  let cidade = document.getElementById('cidade').value;
  let tipo = document.getElementById('tipo').value;
  let cep = document.getElementById('cep').value;

  const usuarioIndex = usuarios.findIndex(user => user.id === usuarioLogado.id);
  if (usuarioIndex === -1) {
    alert('Usuário logado não encontrado.');
    return;
  }

  if (!usuarios[usuarioIndex].enderecos) {
    usuarios[usuarioIndex].enderecos = [];
  }

  if (usuarios[usuarioIndex].enderecos.length >= 3) {
    alert('Você já atingiu o limite máximo de 3 endereços.');
    return;
  }

  usuarios[usuarioIndex].enderecos.push({
    logradouro,
    numero,
    complemento,
    bairro,
    cidade,
    tipo,
    cep
  });

  localStorage.setItem('Usuários', JSON.stringify(usuarios));
  renderizarEnderecos();
}

function renderizarEnderecos() {
  const container = document.getElementById('enderecos');
  const botaoAdicionar = document.getElementById('add-endereco');
  container.innerHTML = '';

  let usuarios = JSON.parse(localStorage.getItem('Usuários')) || [];
  let usuarioLogadoJSON = localStorage.getItem('usuarioLogado');
  if (!usuarioLogadoJSON) return;

  let usuarioLogado = JSON.parse(usuarioLogadoJSON);
  const usuario = usuarios.find(user => user.id === usuarioLogado.id);

  if (!usuario || !usuario.enderecos) return;

  usuario.enderecos.forEach((endereco, index) => {
    const div = document.createElement('div');
    div.className = 'endereco-box';
    div.innerHTML = `
      <p class='p-endereco'><strong>${endereco.logradouro}</strong><br>${endereco.tipo}</p>
      <span class="numero-endereco">#${index + 1}</span>
    `;

    div.addEventListener('click', () => abrirModalEndereco(endereco, index));
    container.appendChild(div);
  });

  if (botaoAdicionar) {
    container.appendChild(botaoAdicionar);
  }
}

let enderecoSelecionadoIndex = null;

function abrirModalEndereco(endereco, index) {
  enderecoSelecionadoIndex = index;

  document.getElementById('edit-logradouro').value = endereco.logradouro;
  document.getElementById('edit-numero').value = endereco.numero;
  document.getElementById('edit-complemento').value = endereco.complemento;
  document.getElementById('edit-bairro').value = endereco.bairro;
  document.getElementById('edit-cidade').value = endereco.cidade;
  document.getElementById('edit-cep').value = endereco.cep;
  document.getElementById('edit-tipo').value = endereco.tipo;

  document.getElementById('modal-dois').style.display = 'block';
}

function fecharModalEndereco() {
  document.getElementById('modal-dois').style.display = 'none';
  enderecoSelecionadoIndex = null;
}

function editarEndereco() {
  const btn = document.getElementById('btn-editar-endereco');
  const inputs = document.querySelectorAll('#form-editar-endereco input, #form-editar-endereco select');

  if (btn.textContent === "Editar") {
    inputs.forEach(input => input.disabled = false);
    btn.textContent = "Salvar";
    btn.style.backgroundColor = "green";
  } else {
    let usuarios = JSON.parse(localStorage.getItem("Usuários")) || [];
    let usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

    const usuarioIndex = usuarios.findIndex(user => user.id === usuarioLogado.id);
    if (usuarioIndex === -1) {
      alert('Usuário logado não encontrado.');
      return;
    }

    const enderecoAtualizado = {
      logradouro: document.getElementById('edit-logradouro').value,
      numero: document.getElementById('edit-numero').value,
      complemento: document.getElementById('edit-complemento').value,
      bairro: document.getElementById('edit-bairro').value,
      cidade: document.getElementById('edit-cidade').value,
      cep: document.getElementById('edit-cep').value,
      tipo: document.getElementById('edit-tipo').value
    };

    usuarios[usuarioIndex].enderecos[enderecoSelecionadoIndex] = enderecoAtualizado;
    localStorage.setItem("Usuários", JSON.stringify(usuarios));
    alert("Endereço atualizado com sucesso!");

    inputs.forEach(input => input.disabled = true);
    btn.textContent = "Editar";
    btn.style.backgroundColor = "";
    fecharModalEndereco();
    renderizarEnderecos();
  }
}

function removerEndereco() {
  if (confirm("Tem certeza que deseja remover este endereço?")) {
    let usuarios = JSON.parse(localStorage.getItem("Usuários")) || [];
    let usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

    const usuarioIndex = usuarios.findIndex(user => user.id === usuarioLogado.id);
    if (usuarioIndex === -1) {
      alert('Usuário logado não encontrado.');
      return;
    }

    if (enderecoSelecionadoIndex !== null) {
      usuarios[usuarioIndex].enderecos.splice(enderecoSelecionadoIndex, 1);
      localStorage.setItem("Usuários", JSON.stringify(usuarios));
      alert("Endereço removido com sucesso!");
    }

    fecharModalEndereco();
    renderizarEnderecos();
  }
}
