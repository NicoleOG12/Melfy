import { rotasGerais } from '../rotas.js';

document.addEventListener("DOMContentLoaded", function () {
  exibirInformacoes();
});

function exibirInformacoes() {
  const usuarioLogadoJSON = localStorage.getItem("usuarioLogado");
  const confeiteiraLogadaJSON = localStorage.getItem("confeiteiraLogada");

  let usuarioAtual = null;

  if (usuarioLogadoJSON) {
    usuarioAtual = JSON.parse(usuarioLogadoJSON);
  } else if (confeiteiraLogadaJSON) {
    usuarioAtual = JSON.parse(confeiteiraLogadaJSON);
  } else {
    return;
  }

  document.getElementById('nome-exibir').innerText = usuarioAtual.nome;
  document.getElementById('email-exibir').innerText = usuarioAtual.email;

  document.getElementById("nome-input").value = usuarioAtual.nome || "";
  document.getElementById("sobrenome-input").value = usuarioAtual.sobrenome || "";
  document.getElementById("email-input").value = usuarioAtual.email || "";
  document.getElementById("celular-input").value = usuarioAtual.celular || "";
  document.getElementById("cpf-input").value = usuarioAtual.cpf || "";
  document.getElementById("dataNascimento-input").value = usuarioAtual.dataNascimento || "";
}

function salvarDados() {
  const usuarioLogadoJSON = localStorage.getItem("usuarioLogado");
  const confeiteiraLogadaJSON = localStorage.getItem("confeiteiraLogada");

  let usuarioAtual = null;
  let listaUsuarios = JSON.parse(localStorage.getItem("Usuários")) || [];

  if (usuarioLogadoJSON) {
    usuarioAtual = JSON.parse(usuarioLogadoJSON);
  } else if (confeiteiraLogadaJSON) {
    usuarioAtual = JSON.parse(confeiteiraLogadaJSON);
  } else {
    return;
  }

  const usuarioOriginal = listaUsuarios.find(u => u.id === usuarioAtual.id);
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

  const novaListaUsuarios = listaUsuarios.map(u => u.id === usuarioAtual.id ? usuarioAtualizado : u);

  localStorage.setItem("Usuários", JSON.stringify(novaListaUsuarios));
  if (usuarioLogadoJSON) {
    localStorage.setItem("usuarioLogado", JSON.stringify(usuarioAtualizado));
  } else if (confeiteiraLogadaJSON) {
    localStorage.setItem("confeiteiraLogada", JSON.stringify(usuarioAtualizado));
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
  localStorage.removeItem("tokenCliente");
  localStorage.removeItem("infoCliente");
  alert("Você realizou o Logout. Até breve!");
  window.location.href = rotasGerais.home;
}

window.abrirModal = function() {
  document.getElementById('modal').style.display = 'flex';
}

window.fecharModal = function() {
  document.getElementById('modal').style.display = 'none';
}
