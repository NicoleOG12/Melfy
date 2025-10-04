window.onload = function () {
    document.querySelector('#nome').addEventListener('input', validarNome);
    document.querySelector('#email').addEventListener('input', validarEmail);
    document.querySelector('#data').addEventListener('input', validarDataNascimento);
    document.querySelector('#senha').addEventListener('input', validarSenha);
};

function cadastrar() {
    let nome = document.querySelector('#nome').value.trim();
    let email = document.querySelector('#email').value.trim();
    let dataNascimento = document.querySelector('#data').value;
    let senha = document.querySelector('#senha').value;

    if (!nome || !email || !dataNascimento || !senha) {
        alert("Preencha todos os campos!");
        return;
    }

    let usuarios = JSON.parse(localStorage.getItem('Usuários')) || [];
    let existe = usuarios.some(user => user.email === email);
    if (existe) {
        alert("Este e-mail já está cadastrado.");
        return;
    }

    let novoId = usuarios.length > 0 ? Math.max(...usuarios.map(user => user.id)) + 1 : 1;
    let novoUsuario = {
        id: novoId,
        nome,
        email,
        senha,
        dataNascimento
    };

    usuarios.push(novoUsuario);

    localStorage.setItem('Usuários', JSON.stringify(usuarios));

    alert("Cadastro realizado com sucesso!");
    window.location.href = 'login.html';
}

function validarNome() {
    const nome = document.querySelector('#nome').value.trim();
    if (!nome) {
        mostrarErro('nome', 'Nome é obrigatório');
    } else {
        removerErro('nome');
    }
}

function validarEmail() {
    const email = document.querySelector('#email').value.trim();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
        mostrarErro('email', 'E-mail inválido');
    } else {
        removerErro('email');
    }
}

function validarDataNascimento() {
    const dataNascimento = document.querySelector('#data').value;
    if (!validarIdade(dataNascimento)) {
        mostrarErro('data', 'Você precisa ter mais de 16 anos');
    } else {
        removerErro('data');
    }
}

function validarSenha() {
    const senha = document.querySelector('#senha').value.trim();
    if (!senha) {
        mostrarErro('senha', 'Senha é obrigatória');
    } else {
        removerErro('senha');
    }
}

function mostrarErro(campo, mensagem) {
    document.querySelector(`#${campo}`).classList.add('input-error');
    document.querySelector(`#${campo}-error`).textContent = mensagem;
}

function removerErro(campo) {
    document.querySelector(`#${campo}`).classList.remove('input-error');
    document.querySelector(`#${campo}-error`).textContent = '';
}

function validarIdade(dataNascimento) {
    const dataNascimentoDate = new Date(dataNascimento);
    const hoje = new Date();
    let idade = hoje.getFullYear() - dataNascimentoDate.getFullYear();
    const mes = hoje.getMonth();
    const dia = hoje.getDate();

    if (mes < dataNascimentoDate.getMonth() || (mes === dataNascimentoDate.getMonth() && dia < dataNascimentoDate.getDate())) {
        idade--;
    }

    return idade >= 16;
}
