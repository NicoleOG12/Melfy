import { rotasGerais } from '../rotas.js';

document.addEventListener("DOMContentLoaded", function () {
  exibirInformacoes();
});

function exibirInformacoes() {
  console.log(localStorage)
  const usuarioLogadoJSON = localStorage.getItem("infoCliente");
  const confeiteiraLogadaJSON = localStorage.getItem("confeiteiraLogada");

  let usuarioAtual = null;

  if (usuarioLogadoJSON) {
    usuarioAtual = JSON.parse(usuarioLogadoJSON)[0];
  } else if (confeiteiraLogadaJSON) {
    usuarioAtual = JSON.parse(confeiteiraLogadaJSON);
  } else {
    return;
  }

  console.log(usuarioAtual)


  document.getElementById('nome-exibir').innerText = usuarioAtual.nome;
  document.getElementById('email-exibir').innerText = usuarioAtual.email;

  document.getElementById("nome-input").value = usuarioAtual.nome.split(" ")[0] || "";
  document.getElementById("sobrenome-input").value = usuarioAtual.nome.trim().split(" ").slice(1).join(" ") || "";
  document.getElementById("email-input").value = usuarioAtual.email || "";
  document.getElementById("celular-input").value = formatarCelular(usuarioAtual.telefone || "");
  document.getElementById("cpf-input").value = formatarCPF(usuarioAtual.cpf || "");
  document.getElementById("dataNascimento-input").value = dataISO(usuarioAtual.data_nasc) || "";
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

  alertSuccess("Dados atualizados com sucesso!");
}

window.habilitarEdicao = function() {
  const botao = document.getElementById('botao-editar');
  const campos = ["nome-input","sobrenome-input","email-input","celular-input"];

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

window.sairConta = async function() {
  localStorage.removeItem("tokenCliente");
  localStorage.removeItem("infoCliente");
  await alertSuccess("Logout realizado com sucesso. Até breve!");
  window.location.href = rotasGerais.home;
}

window.abrirModal = function() {
  document.getElementById('modal').style.display = 'flex';
}

window.fecharModal = function() {
  document.getElementById('modal').style.display = 'none';
}


function dataISO(dataISO) {
  if (!dataISO) return "";
  const data = new Date(dataISO);

  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const ano = data.getFullYear();

  return `${dia}/${mes}/${ano}`;
}

function formatarCelular(v) {
  if (!v) return "";
  v = v.replace(/\D/g, "");
  v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
  v = v.replace(/(\d)(\d{4})$/, "$1-$2");
  return v;
}

function formatarCPF(v) {
  if (!v) return "";
  v = v.replace(/\D/g, "");
  v = v.replace(/(\d{3})(\d)/, "$1.$2");
  v = v.replace(/(\d{3})(\d)/, "$1.$2");
  v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  return v;
}

function formatarCEP(v) {
  if (!v) return "";
  v = v.replace(/\D/g, "");
  if (v.length > 5) v = v.replace(/^(\d{5})(\d)/, "$1-$2");
  return v;
}

function formatarCartao(v) {
  if (!v) return "";
  v = v.replace(/\D/g, "");
  return v.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

function formatarValidade(v) {
  if (!v) return "";
  v = v.replace(/\D/g, "");
  if(v.length > 2) v = v.replace(/^(\d{2})(\d)/, "$1/$2");
  return v.substring(0, 5);
}

window.mostrarSecao = function(secao) {
  document.getElementById('secao-dados').style.display = (secao === 'dados') ? 'block' : 'none';
  document.getElementById('secao-enderecos').style.display = (secao === 'enderecos') ? 'block' : 'none';
  
  const secaoPagamentos = document.getElementById('secao-pagamentos');
  if (secaoPagamentos) {
    secaoPagamentos.style.display = (secao === 'pagamentos') ? 'block' : 'none';
  }

  document.querySelectorAll('.perfil-menu .menu-item').forEach(el => {
    el.classList.remove('active-menu');
  });

  const activeMenu = document.getElementById(`menu-${secao}`);
  if (activeMenu) {
    activeMenu.classList.add('active-menu');
  }
}

window.habilitarEdicaoEndereco = function() {
  const botao = document.getElementById('botao-editar-endereco');
  const campos = ["cep-input","rua-input","numero-input","complemento-input","bairro-input","cidade-input"];

  if (botao.textContent === "Editar Endereço") {
    botao.textContent = "Salvar Endereço";
    botao.style.backgroundColor = "green";
    campos.forEach(id => {
      const campo = document.getElementById(id);
      if(campo) {
        campo.disabled = false;
        campo.classList.add("editando");
      }
    });
  } else {
    botao.textContent = "Editar Endereço";
    botao.style.backgroundColor = "";
    campos.forEach(id => {
      const campo = document.getElementById(id);
      if(campo) {
        campo.disabled = true;
        campo.classList.remove("editando");
      }
    });
    alertSuccess("Endereço salvo com sucesso!");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const celularInput = document.getElementById("celular-input");
  if(celularInput) celularInput.addEventListener("input", e => e.target.value = formatarCelular(e.target.value));

  const cpfInput = document.getElementById("cpf-input");
  if(cpfInput) cpfInput.addEventListener("input", e => e.target.value = formatarCPF(e.target.value));

  const numCartao = document.getElementById("numero-cartao-modal");
  if(numCartao) numCartao.addEventListener("input", e => e.target.value = formatarCartao(e.target.value).substring(0, 19));

  const valCartao = document.getElementById("validade-cartao-modal");
  if(valCartao) valCartao.addEventListener("input", e => e.target.value = formatarValidade(e.target.value));

  const cvvCartao = document.getElementById("cvv-cartao-modal");
  if(cvvCartao) cvvCartao.addEventListener("input", e => {
      let v = e.target.value.replace(/\D/g, "");
      e.target.value = v.substring(0, 4);
  });

  const cepInput = document.getElementById('cep-input');
  if(cepInput) {
    cepInput.addEventListener('blur', function() {
      let cep = this.value.replace(/\D/g, '');
      if (cep.length === 8) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
          .then(res => res.json())
          .then(data => {
            if (!data.erro) {
              document.getElementById('rua-input').value = data.logradouro || '';
              document.getElementById('bairro-input').value = data.bairro || '';
              document.getElementById('cidade-input').value = `${data.localidade} / ${data.uf}` || '';
              document.getElementById('numero-input').focus();
            }
          })
          .catch(err => console.error("Erro ao buscar CEP", err));
      }
    });

    cepInput.addEventListener('input', function(e) {
      e.target.value = formatarCEP(e.target.value).substring(0, 9);
    });
  }
});

window.abrirModalPagamento = function() {
  document.getElementById("modal-pagamento").style.display = "flex";
  document.getElementById("numero-cartao-modal").value = "";
  document.getElementById("validade-cartao-modal").value = "";
  document.getElementById("cvv-cartao-modal").value = "";
  document.getElementById("titular-cartao-modal").value = "";
  document.getElementById("chave-pix-modal").value = "";
}

window.fecharModalPagamento = function(salvar) {
  document.getElementById("modal-pagamento").style.display = "none";
  if (salvar === true) {
    alertSuccess("Forma de pagamento salva com sucesso!");

    document.getElementById("empty-pagamentos").style.display = "none";
  }
}

window.selecionarTipoPagamento = function(elemento, tipo) {
  document.querySelectorAll('.pay-option').forEach(el => el.classList.remove('active'));
  elemento.classList.add('active');

  const subOpcoesVoucher = document.getElementById("sub-opcoes-voucher");
  const subOpcoesVale = document.getElementById("sub-opcoes-vale");

  if(subOpcoesVoucher) subOpcoesVoucher.style.display = "none";
  if(subOpcoesVale) subOpcoesVale.style.display = "none";

  if (tipo === "voucher") {
    if(subOpcoesVoucher) subOpcoesVoucher.style.display = "block";
  } else if (tipo === "vale") {
    if(subOpcoesVale) subOpcoesVale.style.display = "block";
  }
}

window.selecionarSubBadge = function(elemento) {
  const container = elemento.parentElement;
  container.querySelectorAll('.pay-sub-badge').forEach(el => el.classList.remove('active'));
  elemento.classList.add('active');
}
