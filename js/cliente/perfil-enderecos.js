import { rotasGerais } from '../rotas.js';

document.addEventListener("DOMContentLoaded", function () {
  exibirInformacoes();
  renderizarEnderecos();
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

function salvarDados() {
  let usuarioAtualJSON = localStorage.getItem("usuarioLogado") || localStorage.getItem("confeiteiraLogada");
  if (!usuarioAtualJSON || usuarioAtualJSON === "undefined") return;

  let usuarioAtual = JSON.parse(usuarioAtualJSON);
  const idUsuarioLogado = usuarioAtual.id;

  let listaUsuarios = JSON.parse(localStorage.getItem("Usuários")) || [];
  let listaConfeiteiras = JSON.parse(localStorage.getItem("Confeiteiras")) || [];

  if (localStorage.getItem("confeiteiraLogada")) {
    const confeiteiraOriginal = listaConfeiteiras.find(u => u.id === idUsuarioLogado);
    if (!confeiteiraOriginal) return;

    const usuarioAtualizado = {
      ...confeiteiraOriginal,
      nome: document.getElementById("nome-input").value,
      sobrenome: document.getElementById("sobrenome-input").value,
      email: document.getElementById("email-input").value,
      celular: document.getElementById("celular-input").value,
      cpf: document.getElementById("cpf-input").value,
      dataNascimento: document.getElementById("dataNascimento-input").value
    };

    const novaListaConfeiteiras = listaConfeiteiras.map(usuario =>
      usuario.id === idUsuarioLogado ? usuarioAtualizado : usuario
    );

    localStorage.setItem("Confeiteiras", JSON.stringify(novaListaConfeiteiras));
    localStorage.setItem("confeiteiraLogada", JSON.stringify(usuarioAtualizado));
  } else {
    const usuarioOriginal = listaUsuarios.find(u => u.id === idUsuarioLogado);
    if (!usuarioOriginal) return;

    const usuarioAtualizado = {
      ...usuarioOriginal,
      nome: document.getElementById("nome-input").value,
      sobrenome: document.getElementById("sobrenome-input").value,
      email: document.getElementById("email-input").value,
      celular: document.getElementById("celular-input").value,
      cpf: document.getElementById("cpf-input").value,
      dataNascimento: document.getElementById("dataNascimento-input").value
    };

    const novaListaUsuarios = listaUsuarios.map(usuario =>
      usuario.id === idUsuarioLogado ? usuarioAtualizado : usuario
    );

    localStorage.setItem("Usuários", JSON.stringify(novaListaUsuarios));
    localStorage.setItem("usuarioLogado", JSON.stringify(usuarioAtualizado));
  }

  alert("Dados atualizados com sucesso!");
}

window.habilitarEdicao = function() {
  const botao = document.getElementById('botao-editar');
  const campos = ["nome-input","sobrenome-input","email-input","celular-input","cpf-input","dataNascimento-input"];

  if (botao.textContent === "Editar") {
    botao.textContent = "Salvar";
    botao.style.backgroundColor = "green";
    campos.forEach(id => {
      const campo = document.getElementById(id);
      campo.disabled = false;
      campo.classList.add("editando");
    });
  } else {
    botao.textContent = "Editar";
    botao.style.backgroundColor = "";
    campos.forEach(id => {
      const campo = document.getElementById(id);
      campo.disabled = true;
      campo.classList.remove("editando");
    });
    salvarDados();
  }
}

window.sairConta = function() {
  localStorage.removeItem('usuarioLogado');
  localStorage.removeItem('confeiteiraLogada');
  alert('Usuário deslogado');
  window.location.href = rotasGerais.home;
}

window.abrirModal = function() {
  document.getElementById('modal').style.display = 'flex';
}

window.fecharModal = function() {
  document.getElementById('modal').style.display = 'none';
}

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

function adicionarEndereco() {
  let usuarios = JSON.parse(localStorage.getItem('Usuários')) || [];
  let confeiteiras = JSON.parse(localStorage.getItem('Confeiteiras')) || [];
  let usuarioAtualJSON = localStorage.getItem('usuarioLogado') || localStorage.getItem('confeiteiraLogada');
  let usuarioAtual = JSON.parse(usuarioAtualJSON);

  let logradouro = document.getElementById('logradouro').value;
  let numero = document.getElementById('numero').value;
  let complemento = document.getElementById('complemento').value;
  let bairro = document.getElementById('bairro').value;
  let cidade = document.getElementById('cidade').value;
  let tipo = document.getElementById('tipo').value;
  let cep = document.getElementById('cep').value;

  if (localStorage.getItem('confeiteiraLogada')) {
    let index = confeiteiras.findIndex(c => c.id === usuarioAtual.id);
    if (index === -1) {
      usuarioAtual.enderecos = usuarioAtual.enderecos || [];
      usuarioAtual.enderecos.push({ logradouro, numero, complemento, bairro, cidade, tipo, cep });
      localStorage.setItem('confeiteiraLogada', JSON.stringify(usuarioAtual));
    } else {
      if (!confeiteiras[index].enderecos) confeiteiras[index].enderecos = [];
      confeiteiras[index].enderecos.push({ logradouro, numero, complemento, bairro, cidade, tipo, cep });
      localStorage.setItem('Confeiteiras', JSON.stringify(confeiteiras));
    }
  } else {
    const usuarioIndex = usuarios.findIndex(user => user.id === usuarioAtual.id);
    if (usuarioIndex === -1) {
      alert('Usuário logado não encontrado.');
      return;
    }
    if (!usuarios[usuarioIndex].enderecos) usuarios[usuarioIndex].enderecos = [];
    usuarios[usuarioIndex].enderecos.push({ logradouro, numero, complemento, bairro, cidade, tipo, cep });
    localStorage.setItem('Usuários', JSON.stringify(usuarios));
  }

  renderizarEnderecos();
}

function renderizarEnderecos() {
  const container = document.getElementById('enderecos');
  const botaoAdicionar = document.getElementById('add-endereco');
  container.innerHTML = '';

  let usuarios = JSON.parse(localStorage.getItem('Usuários')) || [];
  let confeiteiras = JSON.parse(localStorage.getItem('Confeiteiras')) || [];
  let usuarioAtualJSON = localStorage.getItem('confeiteiraLogada') || localStorage.getItem('usuarioLogado');
  if (!usuarioAtualJSON) return;

  let usuarioAtual = JSON.parse(usuarioAtualJSON);
  let registro;
  if (localStorage.getItem('confeiteiraLogada')) {
    registro = confeiteiras.find(c => c.id === usuarioAtual.id) || usuarioAtual;
  } else {
    registro = usuarios.find(u => u.id === usuarioAtual.id) || usuarioAtual;
  }

  if (!registro || !registro.enderecos) return;

  registro.enderecos.forEach((endereco, index) => {
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

function editarEndereco() {
  const btn = document.getElementById('btn-editar-endereco');
  const inputs = document.querySelectorAll('#form-editar-endereco input, #form-editar-endereco select');

  if (btn.textContent === "Editar") {
    inputs.forEach(input => input.disabled = false);
    btn.textContent = "Salvar";
    btn.style.backgroundColor = "green";
  } else {
    let usuarios = JSON.parse(localStorage.getItem("Usuários")) || [];
    let confeiteiras = JSON.parse(localStorage.getItem("Confeiteiras")) || [];
    let usuarioAtualJSON = localStorage.getItem('usuarioLogado') || localStorage.getItem('confeiteiraLogada');
    let usuarioAtual = JSON.parse(usuarioAtualJSON);

    const enderecoAtualizado = {
      logradouro: document.getElementById('edit-logradouro').value,
      numero: document.getElementById('edit-numero').value,
      complemento: document.getElementById('edit-complemento').value,
      bairro: document.getElementById('edit-bairro').value,
      cidade: document.getElementById('edit-cidade').value,
      cep: document.getElementById('edit-cep').value,
      tipo: document.getElementById('edit-tipo').value
    };

    if (localStorage.getItem('confeiteiraLogada')) {
      let index = confeiteiras.findIndex(c => c.id === usuarioAtual.id);
      if (index !== -1) {
        confeiteiras[index].enderecos[enderecoSelecionadoIndex] = enderecoAtualizado;
        localStorage.setItem("Confeiteiras", JSON.stringify(confeiteiras));
      } else {
        usuarioAtual.enderecos[enderecoSelecionadoIndex] = enderecoAtualizado;
        localStorage.setItem("confeiteiraLogada", JSON.stringify(usuarioAtual));
      }
    } else {
      const usuarioIndex = usuarios.findIndex(user => user.id === usuarioAtual.id);
      if (usuarioIndex === -1) {
        alert('Usuário logado não encontrado.');
        return;
      }
      usuarios[usuarioIndex].enderecos[enderecoSelecionadoIndex] = enderecoAtualizado;
      localStorage.setItem("Usuários", JSON.stringify(usuarios));
    }

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
    let confeiteiras = JSON.parse(localStorage.getItem("Confeiteiras")) || [];
    let usuarioAtualJSON = localStorage.getItem('usuarioLogado') || localStorage.getItem('confeiteiraLogada');
    let usuarioAtual = JSON.parse(usuarioAtualJSON);

    if (localStorage.getItem('confeiteiraLogada')) {
      let index = confeiteiras.findIndex(c => c.id === usuarioAtual.id);
      if (index !== -1 && enderecoSelecionadoIndex !== null) {
        confeiteiras[index].enderecos.splice(enderecoSelecionadoIndex, 1);
        localStorage.setItem("Confeiteiras", JSON.stringify(confeiteiras));
        alert("Endereço removido com sucesso!");
      }
    } else {
      const usuarioIndex = usuarios.findIndex(user => user.id === usuarioAtual.id);
      if (usuarioIndex !== -1 && enderecoSelecionadoIndex !== null) {
        usuarios[usuarioIndex].enderecos.splice(enderecoSelecionadoIndex, 1);
        localStorage.setItem("Usuários", JSON.stringify(usuarios));
        alert("Endereço removido com sucesso!");
      }
    }

    fecharModalEndereco();
    renderizarEnderecos();
  }
}
