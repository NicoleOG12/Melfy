export const dadosIniciais = [
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

export const lojasIniciais = [
  {
    idLoja: 1,
    nomeLoja: "Dama",
    horario: "08:00 - 18:00",
    descricao: "Bolos decorados e doces artesanais feitos com carinho.",
    fotoPerfil: "img/Lojas/Dama.svg",
    idConfeiteira: "1"
  },
  {
    idLoja: 2,
    nomeLoja: "Caseirinho",
    horario: "09:00 - 20:00",
    descricao: "Tortas gourmet, cupcakes e doces personalizados para eventos.",
    fotoPerfil: "img/Lojas/Caseirinho.svg",
    idConfeiteira: "2"
  },
  {
    idLoja: 3,
    nomeLoja: "Da Bê",
    horario: "10:00 - 17:00",
    descricao: "Bolos caseiros e brigadeiros feitos com ingredientes naturais.",
    fotoPerfil: "img/Lojas/Da Bê.svg",
    idConfeiteira: "3"
  },
  {
    idLoja: 4,
    nomeLoja: "Barcelle",
    horario: "11:00 - 19:00",
    descricao: "Brownies, cookies e sobremesas de potinho irresistíveis.",
    fotoPerfil: "img/Lojas/Barcelle.png",
    idConfeiteira: "4"
  }
];

export const produtosPadrao = [
  {
      nome: "Éclairs",
      subtitulo: "Caixa com 7 éclairs sortidas",
      categoria: "Éclair",
      descricao: "Caixa com 7 éclairs sortidas",
      peso: 210,
      preco: 133.00,
      foto: "./img/Eclairs.svg",
      idLoja: "1",
      idConfeiteira: "1",
      idProduto: 1
  },
  {
      nome: "Bombons",
      subtitulo: "Caixa com 36 doces",
      categoria: "Bombons",
      descricao: "Caixa com 36 doces",
      peso: 360,
      preco: 148.00,
      foto: "./img/Bombons.svg",
      idLoja: "2",
      idConfeiteira: "2",
      idProduto: 2
  },
  {
      nome: "Brigadeiros",
      subtitulo: "Caixa com 6 brigadeiros",
      categoria: "Brigadeiro",
      descricao: "Caixa com 6 brigadeiros de chocolate",
      peso: 90,
      preco: 15.00,
      foto: "./img/Brigadeiros.svg",
      idLoja: "3",
      idConfeiteira: "3",
      idProduto: 3
  },
  {
      nome: "Brownie ninho e nutella",
      subtitulo: "Marmita brownie de ninho e nutella",
      categoria: "Brownie",
      descricao: "Marmita brownie de ninho e nutella",
      peso: 100,
      preco: 20.00,
      foto: "./img/Brownie de Ninho.svg",
      idLoja: "4",
      idConfeiteira: "4",
      idProduto: 4
  },
  {
      nome: "Cookies Recheados",
      subtitulo: "Cookie recheado de chocolate",
      categoria: "Cookies",
      descricao: "Cookie recheado de chocolate",
      peso: 40,
      preco: 6.00,
      foto: "./img/Cookies de Chocolate.svg",
      idLoja: "2",
      idConfeiteira: "2",
      idProduto: 5
  },
  {
      nome: "Pudim",
      subtitulo: "Pudim tamanho família",
      categoria: "Pudim",
      descricao: "Pudim tamanho família",
      peso: 1300,
      preco: 70.00,
      foto: "./img/Pudim.svg",
      idLoja: "4",
      idConfeiteira: "4",
      idProduto: 6
  },
  {
      nome: "Mini Sonhos",
      subtitulo: "Sonhos tradicionais unidade",
      categoria: "Sonho",
      descricao: "Sonhos tradicionais unidade",
      peso: 25,
      preco: 2.50,
      foto: "./img/Mini Sonhos.svg",
      idLoja: "1",
      idConfeiteira: "1",
      idProduto: 7
  },
  {
      nome: "Cheescake de Morango",
      subtitulo: "Cheescake de 8 fatias",
      categoria: "Cheescake",
      descricao: "Cheescake de 8 fatias",
      peso: 1100,
      preco: 163.00,
      foto: "./img/Cheescake.svg",
      idLoja: "3",
      idConfeiteira: "3",
      idProduto: 8
  },
  {
      nome: "Pavê de Chocolates",
      subtitulo: "Pavê de chocolate preto e branco",
      categoria: "Pavê",
      descricao: "Pavê de chocolate preto e branco",
      peso: 150,
      preco: 16.00,
      foto: "./img/Pave.svg",
      idLoja: "1",
      idConfeiteira: "1",
      idProduto: 9
  },
  {
      nome: "Romcabole Red Velvet",
      subtitulo: "Recheado com geléia de amoras",
      categoria: "Romcabole", 
      descricao: "Recheado com geléia de amoras",
      peso: 600, 
      preco: 120.00,
      foto: "./img/Romcabole.svg",
      idLoja: "1", 
      idConfeiteira: "1", 
      idProduto: 10 
  }
];

export function carregarTodosOsDados() {
  if (!localStorage.getItem('Confeiteiras')) {
    localStorage.setItem('Confeiteiras', JSON.stringify(dadosIniciais));
  }

  if (!localStorage.getItem('Lojas')) {
    localStorage.setItem('Lojas', JSON.stringify(lojasIniciais));
  }
  
  if (!localStorage.getItem('Produtos')) {
    localStorage.setItem('Produtos', JSON.stringify(produtosPadrao));
  }
}
