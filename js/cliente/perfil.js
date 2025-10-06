import { rotasGerais } from '../rotas.js';

document.addEventListener("DOMContentLoaded", function () {
  exibirInformacoes();
});

function exibirInformacoes(){
  const usuarioLogadoJSON = localStorage.getItem("usuarioLogado");
  if (!usuarioLogadoJSON) return;

  const usuarioLogado = JSON.parse(usuarioLogadoJSON);

  document.getElementById('nome-exibir').innerText = usuarioLogado.nome;
  document.getElementById('email-exibir').innerText = usuarioLogado.email;
  document.getElementById("nome-input").value = usuarioLogado.nome || "";
  document.getElementById("sobrenome-input").value = usuarioLogado.sobrenome || "";
  document.getElementById("email-input").value = usuarioLogado.email || "";
  document.getElementById("celular-input").value = usuarioLogado.celular || "";
  document.getElementById("cpf-input").value = usuarioLogado.cpf || "";
  document.getElementById("dataNascimento-input").value = usuarioLogado.dataNascimento || "";
}

function salvarDados() {
  const usuarioLogadoJSON = localStorage.getItem("usuarioLogado");
  if (!usuarioLogadoJSON || usuarioLogadoJSON === "undefined") return;

  const usuarioLogado = JSON.parse(usuarioLogadoJSON);
  const idUsuarioLogado = usuarioLogado.id;

  let listaUsuarios = JSON.parse(localStorage.getItem("Usuários")) || [];
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
  alert('Usuário deslogado');
  window.location.href = rotasGerais.home;
}

window.abrirModal = function() {
  document.getElementById('modal').style.display = 'flex';
}

window.fecharModal = function() {
  document.getElementById('modal').style.display = 'none';
}
