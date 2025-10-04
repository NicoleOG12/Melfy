function dados() {
    if (!localStorage.getItem('Confeiteiras')) {
        const dadosIniciais = [
          { 
            id: 1, 
            nome: "Ana Clara Souza", 
            cpf_cnpj: "123.456.789-00", 
            nascimento: "1995-08-12", 
            endereco: "Rua Girassol, 100 - São Paulo", 
            celular: "(11) 91234-5678", 
            email: "ana@melfy.com", 
            senha: "ana123",
            dadosBancarios: {
              banco: "Banco do Brasil",
              agencia: "1234",
              conta: "12345678",
              tipoConta: "Corrente"
            }
          },
          { 
            id: 2, 
            nome: "Bruno Ferreira", 
            cpf_cnpj: "987.654.321-00", 
            nascimento: "1988-04-23", 
            endereco: "Av. Brasil, 2000 - Campinas", 
            celular: "(19) 99876-5432", 
            email: "bruno@melfy.com", 
            senha: "bruno456",
            dadosBancarios: {
              banco: "Caixa Econômica",
              agencia: "5678",
              conta: "87654321",
              tipoConta: "Poupança"
            }
          },
          { 
            id: 3, 
            nome: "Camila Rodrigues", 
            cpf_cnpj: "321.654.987-00", 
            nascimento: "1992-10-05", 
            endereco: "Rua das Rosas, 300 - Rio de Janeiro", 
            celular: "(21) 98765-4321", 
            email: "camila@melfy.com", 
            senha: "camila789",
            dadosBancarios: {
              banco: "Itaú",
              agencia: "3456",
              conta: "11223344",
              tipoConta: "Corrente"
            }
          },
          { 
            id: 4, 
            nome: "Débora Lima", 
            cpf_cnpj: "456.123.789-00", 
            nascimento: "1990-03-15", 
            endereco: "Av. Central, 1500 - Belo Horizonte", 
            celular: "(31) 91234-9988", 
            email: "debora@melfy.com", 
            senha: "debora321",
            dadosBancarios: {
              banco: "Santander",
              agencia: "7890",
              conta: "55667788",
              tipoConta: "Poupança"
            }
          }
        ];
        localStorage.setItem('Confeiteiras', JSON.stringify(dadosIniciais));
      }
}

function logar() {
    const Confeiteiras = JSON.parse(localStorage.getItem('Confeiteiras'));

    let lg = document.querySelector('#email').value.trim();
    let sn = document.querySelector('#senha').value.trim();

    if (!lg || !sn) {
        alert('Por favor, preencha ambos os campos de email e senha.');
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

        window.location.href = 'adicionarProdutos.html';
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

    let Confeiteiras = JSON.parse(localStorage.getItem('Confeiteiras'));
    let confIndex = Confeiteiras.findIndex(c => c.email === email);

    if (confIndex !== -1) {
        Confeiteiras[confIndex].senha = novaSenha;
        localStorage.setItem('Confeiteiras', JSON.stringify(Confeiteiras));
        alert('Senha redefinida com sucesso!');
        window.location.href = 'login.html';
        return;
    }

    alert('Email não encontrado.');
}
dados();