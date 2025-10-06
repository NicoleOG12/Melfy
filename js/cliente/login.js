function dados() {
    if (!localStorage.getItem('Usuários')) {
        const usuarios = [
            { id: 1, nome: "Lucas", sobrenome:'Andrade Da silva', email: "lucas@email.com", celular:'123456', cpf: '12345', senha: "lucas123", dataNascimento: "2000-05-20" },
            { id: 2, nome: "Fernanda", sobrenome:'Lima Monteiro', email: "fernanda@email.com", celular: '1190394039', cpf:'3234564321', senha: "nanda456", dataNascimento: "1998-08-10" },
            { id: 3, nome: "Carlos", sobrenome:'Mendes', email: "carlos@email.com", celular: '1190394039', cpf:'3234564321', senha: "carl789", dataNascimento: "1995-02-14" },
            { id: 4, nome: "Juliana", sobrenome:'Silva', email: "juliana@email.com", celular: '1190394039', cpf:'3234564321', senha: "ju321", dataNascimento: "2001-11-05" },
            { id: 5, nome: "Nicole", sobrenome:'Oliveira', email: "nicole@gmail.com", celular: '1190394039', cpf:'3234564321', senha: "1234", dataNascimento: "1999-03-15" },
            { id: 6, nome: "Julia", sobrenome:'Silva', email: "julia@gmail.com", celular: '1190394039', cpf:'3234564321', senha: "5678", dataNascimento: "2002-07-22" },
            { id: 7, nome: "Isabella", sobrenome:'Apolinário', email: "isabella@gmail.com", celular: '1190394039', cpf:'3234564321', senha: "1357", dataNascimento: "1997-12-03" },
            { id: 8, nome: "Ana", sobrenome:'Gonçalves', email: "ana@gmail.com", celular: '1190394039', cpf:'3234564321', senha: "2468", dataNascimento: "2000-09-30" }
        ];
        localStorage.setItem('Usuários', JSON.stringify(usuarios));
    }

    if (!localStorage.getItem('Confeiteiras')) {
        const Confeiteiras = [];
        localStorage.setItem('Confeiteiras', JSON.stringify(Confeiteiras));
    }
}

function logar() {
    const usuarios = JSON.parse(localStorage.getItem('Usuários'));
    const Confeiteiras = JSON.parse(localStorage.getItem('Confeiteiras'));

    let lg = document.querySelector('#email').value.trim();
    let sn = document.querySelector('#senha').value.trim();

    if (!lg || !sn) {
        alert('Por favor, preencha ambos os campos de email e senha.');
        return;
    }

    const usuario = usuarios.find(u => u.email === lg && u.senha === sn);
    if (usuario) {
        sessionStorage.setItem("user", usuario.nome);
        localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
        window.location.href = rotasCliente.doces
        return;
    }

    const confeiteira = Confeiteiras.find(c => c.email === lg && c.senha === sn);
    if (confeiteira) {
        sessionStorage.setItem("user", confeiteira.nome);
        localStorage.setItem('usuarioLogado', JSON.stringify(confeiteira));

        const idLoja = confeiteira.id || confeiteira.idLoja || null; 
        if (idLoja) {
            localStorage.setItem('idLojaAtual', idLoja);
        }

        window.location.href = rotasConfeiteira.adicionarProdutos
        return;
    }

    alert('Usuário ou senha inválidos.');
}


function logado() {
    let usuario = sessionStorage.getItem('user');
    document.querySelector('#usuario').value = usuario;
}

function redefinirSenha(event) {
    event.preventDefault();

    let email = document.querySelector('#emailRedefinir').value.trim();
    let novaSenha = document.querySelector('#RedefinirSenha').value.trim();
    let confirmarSenha = document.querySelector('#ConfirmarSenha').value.trim();

    if (!email || !novaSenha || !confirmarSenha) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    if (novaSenha !== confirmarSenha) {
        alert('As senhas não coincidem.');
        return;
    }

    let usuarios = JSON.parse(localStorage.getItem('Usuários'));
    let userIndex = usuarios.findIndex(u => u.email === email);

    if (userIndex !== -1) {
        usuarios[userIndex].senha = novaSenha;
        localStorage.setItem('Usuários', JSON.stringify(usuarios));
        alert('Senha redefinida com sucesso!');
        window.location.href = rotasGerais.login
        return;
    }

    let Confeiteiras = JSON.parse(localStorage.getItem('Confeiteiras'));
    let confIndex = Confeiteiras.findIndex(c => c.email === email);

    if (confIndex !== -1) {
        Confeiteiras[confIndex].senha = novaSenha;
        localStorage.setItem('Confeiteiras', JSON.stringify(Confeiteiras));
        alert('Senha redefinida com sucesso!');
        window.location.href = rotasConfeiteira.login
        return;
    }

    alert('Email não encontrado.');
}

dados();
