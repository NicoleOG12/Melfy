import { carregarTodosOsDados } from './dicionario.js';

document.addEventListener('DOMContentLoaded', () => {
  carregarTodosOsDados();

  document.getElementById('nome').addEventListener('input', validarNome);
  document.getElementById('cpf_cnpj').addEventListener('input', validarCpfCnpj);
  document.getElementById('data').addEventListener('input', validarDataNascimento);
  document.getElementById('celular').addEventListener('input', validarCelular);
  document.getElementById('email').addEventListener('input', validarEmail);
  document.getElementById('senha').addEventListener('input', validarSenha);

  document.getElementById('banco').addEventListener('input', validarBanco);
  document.getElementById('agencia').addEventListener('input', validarAgencia);
  document.getElementById('conta').addEventListener('input', validarConta);
  document.getElementById('tipoConta').addEventListener('change', validarTipoConta);

  document.getElementById('btn-continuar').addEventListener('click', continuar);
  document.getElementById('btn-cadastrar').addEventListener('click', cadastrar);

  document.getElementById('form-informacoes').style.display = 'block';
  document.getElementById('form-novo').style.display = 'none';
});

function gerarId() {
  let Confeiteiras = JSON.parse(localStorage.getItem('Confeiteiras')) || [];
  return Confeiteiras.length > 0 ? Math.max(...Confeiteiras.map(c => c.id)) + 1 : 1;
}

function continuar() {
  if (!validarCamposPreenchidos()) {
    alert('Por favor, preencha todos os campos.');
    return;
  }

  const id = gerarId();

  const confeiteira = {
    id: id,
    nome: document.getElementById('nome').value.trim(),
    cpf_cnpj: document.getElementById('cpf_cnpj').value.trim(),
    nascimento: document.getElementById('data').value,
    endereco: document.getElementById('endereco').value.trim(),
    celular: document.getElementById('celular').value.trim(),
    email: document.getElementById('email').value.trim(),
    senha: document.getElementById('senha').value.trim(),
    dadosBancarios: null
  };

  let Confeiteiras = JSON.parse(localStorage.getItem('Confeiteiras')) || [];
  Confeiteiras.push(confeiteira);
  localStorage.setItem('Confeiteiras', JSON.stringify(Confeiteiras));

  localStorage.setItem('idConfeiteiraAtual', id);

  document.querySelector('form').reset();
  mostrarFormularioNovo();
}

function validarCamposPreenchidos() {
  return (
    !document.getElementById('nome').classList.contains('input-error') &&
    !document.getElementById('cpf_cnpj').classList.contains('input-error') &&
    !document.getElementById('data').classList.contains('input-error') &&
    !document.getElementById('celular').classList.contains('input-error') &&
    !document.getElementById('email').classList.contains('input-error') &&
    !document.getElementById('senha').classList.contains('input-error') &&
    document.getElementById('nome').value.trim() !== "" &&
    document.getElementById('cpf_cnpj').value.trim() !== "" &&
    document.getElementById('data').value.trim() !== "" &&
    document.getElementById('celular').value.trim() !== "" &&
    document.getElementById('email').value.trim() !== "" &&
    document.getElementById('senha').value.trim() !== ""
  );
}

function mostrarFormularioNovo() {
  document.getElementById('form-informacoes').style.display = 'none';
  document.getElementById('form-novo').style.display = 'block';
}

function voltarFormulario() {
  document.getElementById('form-novo').style.display = 'none';
  document.getElementById('form-informacoes').style.display = 'block';
}

function cadastrar() {
  const banco = document.getElementById('banco').value.trim();
  const agencia = document.getElementById('agencia').value.trim();
  const conta = document.getElementById('conta').value.trim();
  const tipoConta = document.getElementById('tipoConta').value;

  if (!banco || !agencia || !conta || !tipoConta) {
    alert("Preencha todos os campos bancários.");
    return;
  }

  let Confeiteiras = JSON.parse(localStorage.getItem('Confeiteiras')) || [];
  const idConfeiteiraAtual = parseInt(localStorage.getItem('idConfeiteiraAtual'));

  const index = Confeiteiras.findIndex(c => c.id === idConfeiteiraAtual);

  if (index !== -1) {
    Confeiteiras[index].dadosBancarios = {
      banco,
      agencia,
      conta,
      tipoConta
    };

    localStorage.setItem('Confeiteiras', JSON.stringify(Confeiteiras));
    document.querySelector('form').reset();
    alert("Cadastro finalizado com sucesso!");
    location.href = "cadastroLoja.html"; 
  } else {
    alert("Erro ao localizar a confeiteira.");
  }
}


function validarNome() {
  const nome = document.getElementById('nome').value.trim();
  if (!nome) {
    mostrarErro('nome', 'Nome é obrigatório');
  } else {
    removerErro('nome');
  } 
}

function validarCpfCnpj() {
  const cpf_cnpj = document.getElementById('cpf_cnpj').value.trim();
  if (!validarCpfCnpjRegex(cpf_cnpj)) {
    mostrarErro('cpf_cnpj', 'CPF ou CNPJ inválido');
  } else {
    removerErro('cpf_cnpj');
  }
}

function validarDataNascimento() {
  const nascimento = document.getElementById('data').value;
  if (!validarIdade(nascimento)) {
    mostrarErro('data', 'Você precisa ser maior de 18 anos');
  } else {
    removerErro('data');
  }
}

function validarCelular() {
  const celular = document.getElementById('celular').value.trim();
  if (!validarCelularRegex(celular)) {
    mostrarErro('celular', 'Celular inválido');
  } else {
    removerErro('celular');
  }
}

function validarEmail() {
  const email = document.getElementById('email').value.trim();
  if (!validarEmailRegex(email)) {
    mostrarErro('email', 'Email inválido');
  } else {
    removerErro('email');
  }
}

function validarSenha() {
  const senha = document.getElementById('senha').value.trim();
  if (!senha) {
    mostrarErro('senha', 'Senha é obrigatória');
  } else {
    removerErro('senha');
  }
}

function validarBanco() {
  const banco = document.getElementById('banco').value.trim();
  if (!banco) {
    mostrarErro('banco', 'Banco é obrigatório');
  } else if (banco.length < 2) {
    mostrarErro('banco', 'Nome do banco muito curto');
  } else {
    removerErro('banco');
  }
}

function validarAgencia() {
  const agencia = document.getElementById('agencia').value.trim();
  const agenciaRegex = /^[0-9]{4,6}$/;
  if (!agencia) {
    mostrarErro('agencia', 'Agência é obrigatória');
  } else if (!agenciaRegex.test(agencia)) {
    mostrarErro('agencia', 'Agência deve conter apenas números e ter entre 4 a 6 dígitos');
  } else {
    removerErro('agencia');
  }
}

function validarConta() {
  const conta = document.getElementById('conta').value.trim();
  const contaRegex = /^[0-9]{6,12}$/;
  if (!conta) {
    mostrarErro('conta', 'Número da conta é obrigatório');
  } else if (!contaRegex.test(conta)) {
    mostrarErro('conta', 'Número da conta deve conter apenas números e ter entre 6 a 12 dígitos');
  } else {
    removerErro('conta');
  }
}

function validarTipoConta() {
  const tipoConta = document.getElementById('tipoConta').value;
  if (!tipoConta) {
    mostrarErro('tipoConta', 'Tipo de conta é obrigatório');
  } else {
    removerErro('tipoConta');
  }
}


function mostrarErro(campo, mensagem) {
  document.getElementById(campo).classList.add('input-error');
  document.getElementById(`${campo}-error`).textContent = mensagem;
}

function removerErro(campo) {
  document.getElementById(campo).classList.remove('input-error');
  document.getElementById(`${campo}-error`).textContent = '';
}

function validarCpfCnpjRegex(cpf_cnpj) {
  const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
  const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
  return cpfRegex.test(cpf_cnpj) || cnpjRegex.test(cpf_cnpj);
}

function validarCelularRegex(celular) {
  const regex = /^\(\d{2}\) \d{5}-\d{4}$/;
  return regex.test(celular);
}

function validarEmailRegex(email) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return regex.test(email);
}

function validarIdade(nascimento) {
  const dataNascimento = new Date(nascimento);
  const hoje = new Date();
  let idade = hoje.getFullYear() - dataNascimento.getFullYear();
  const mes = hoje.getMonth();
  const dia = hoje.getDate();

  if (mes < dataNascimento.getMonth() || (mes === dataNascimento.getMonth() && dia < dataNascimento.getDate())) {
    idade--;
  }

  return idade >= 18;
}



