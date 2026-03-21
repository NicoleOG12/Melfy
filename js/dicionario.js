const BASE_IMG = "../../assents/img";
const LOJAS_IMG = `${BASE_IMG}/Lojas`;
const DOCES_IMG = `${BASE_IMG}/Doces`;

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
  },

  {
    id: 5,
    nome: "Eduarda Costa",
    cpf_cnpj: "234.567.890-11",
    nascimento: "1997-05-21",
    endereco: "Rua das Margaridas, 500 - Curitiba",
    celular: "(41) 99876-1234",
    email: "eduarda@melfy.com",
    senha: "eduarda123",
    dadosBancarios: {
      banco: "Itaú",
      agencia: "1122",
      conta: "33445566",
      tipoConta: "Corrente"
    }
  },
  {
    id: 6,
    nome: "Fernanda Ribeiro",
    cpf_cnpj: "345.678.901-22",
    nascimento: "1993-11-03",
    endereco: "Av. Independência, 350 - Recife",
    celular: "(81) 91234-5678",
    email: "fernanda@melfy.com",
    senha: "fernanda123",
    dadosBancarios: {
      banco: "Bradesco",
      agencia: "3344",
      conta: "77889900",
      tipoConta: "Poupança"
    }
  },
  {
    id: 7,
    nome: "Gustavo Nunes",
    cpf_cnpj: "456.789.012-33",
    nascimento: "1986-02-09",
    endereco: "Rua do Sol, 123 - Porto Alegre",
    celular: "(51) 99876-5432",
    email: "gustavo@melfy.com",
    senha: "gustavo123",
    dadosBancarios: {
      banco: "Caixa Econômica",
      agencia: "5566",
      conta: "99887766",
      tipoConta: "Corrente"
    }
  },
  {
    id: 8,
    nome: "Helena Martins",
    cpf_cnpj: "567.890.123-44",
    nascimento: "2000-01-01",
    endereco: "Av. das Nações, 700 - Brasília",
    celular: "(61) 91111-2222",
    email: "helena@melfy.com",
    senha: "helena123",
    dadosBancarios: {
      banco: "Banco do Brasil",
      agencia: "6677",
      conta: "44332211",
      tipoConta: "Corrente"
    }
  },
  {
    id: 9,
    nome: "Isabela Ferreira",
    cpf_cnpj: "678.901.234-55",
    nascimento: "1998-08-08",
    endereco: "Rua Flor de Lis, 99 - Salvador",
    celular: "(71) 93456-7890",
    email: "isabela@melfy.com",
    senha: "isabela123",
    dadosBancarios: {
      banco: "Santander",
      agencia: "7788",
      conta: "12344321",
      tipoConta: "Poupança"
    }
  },
  {
    id: 10,
    nome: "Juliana Almeida",
    cpf_cnpj: "789.012.345-66",
    nascimento: "1991-06-15",
    endereco: "Rua das Palmeiras, 321 - Manaus",
    celular: "(92) 94567-8901",
    email: "juliana@melfy.com",
    senha: "juliana123",
    dadosBancarios: {
      banco: "Itaú",
      agencia: "8899",
      conta: "56785678",
      tipoConta: "Corrente"
    }
  },
  {
    id: 11,
    nome: "Lucas Pereira",
    cpf_cnpj: "890.123.456-77",
    nascimento: "1985-12-22",
    endereco: "Av. Amazonas, 1200 - Fortaleza",
    celular: "(85) 91234-5678",
    email: "lucas@melfy.com",
    senha: "lucas123",
    dadosBancarios: {
      banco: "Bradesco",
      agencia: "9911",
      conta: "11221122",
      tipoConta: "Poupança"
    }
  },
  {
    id: 12,
    nome: "Mariana Sousa",
    cpf_cnpj: "901.234.567-88",
    nascimento: "1994-03-10",
    endereco: "Rua das Acácias, 100 - Florianópolis",
    celular: "(48) 98765-4321",
    email: "mariana@melfy.com",
    senha: "mariana123",
    dadosBancarios: {
      banco: "Caixa Econômica",
      agencia: "3344",
      conta: "55665566",
      tipoConta: "Corrente"
    }
  },
  {
    id: 13,
    nome: "Paulo Silva",
    cpf_cnpj: "012.345.678-99",
    nascimento: "1979-09-05",
    endereco: "Rua das Oliveiras, 400 - Belo Horizonte",
    celular: "(31) 99887-7766",
    email: "paulo@melfy.com",
    senha: "paulo123",
    dadosBancarios: {
      banco: "Banco do Brasil",
      agencia: "4455",
      conta: "66778899",
      tipoConta: "Corrente"
    }
  },
  {
    id: 14,
    nome: "Renata Carvalho",
    cpf_cnpj: "123.456.789-11",
    nascimento: "1996-07-18",
    endereco: "Av. Paulista, 1500 - São Paulo",
    celular: "(11) 91122-3344",
    email: "renata@melfy.com",
    senha: "renata123",
    dadosBancarios: {
      banco: "Santander",
      agencia: "5566",
      conta: "99887755",
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
    fotoPerfil: `${LOJAS_IMG}/Dama.svg`,
    idConfeiteira: "1"
  },
  {
    idLoja: 2,
    nomeLoja: "Caseirinho",
    horario: "09:00 - 20:00",
    descricao: "Tortas gourmet, cupcakes e doces personalizados para eventos.",
    fotoPerfil: `${LOJAS_IMG}/Caseirinho.svg`,
    idConfeiteira: "2"
  },
  {
    idLoja: 3,
    nomeLoja: "Da Bê",
    horario: "10:00 - 17:00",
    descricao: "Bolos caseiros e brigadeiros feitos com ingredientes naturais.",
    fotoPerfil: `${LOJAS_IMG}/Da Bê.svg`,
    idConfeiteira: "3"
  },
  {
    idLoja: 4,
    nomeLoja: "Barcelle",
    horario: "11:00 - 19:00",
    descricao: "Brownies, cookies e sobremesas de potinho irresistíveis.",
    fotoPerfil: `${LOJAS_IMG}/Barcelle.png`,
    idConfeiteira: "4"
  },

  {
    idLoja: 5,
    nomeLoja: "Doce Mania",
    horario: "08:00 - 19:00",
    descricao: "Delícias doces feitas com ingredientes naturais.",
    fotoPerfil: `${LOJAS_IMG}/Doce Mania.svg`,
    idConfeiteira: "5"
  },
  {
    idLoja: 6,
    nomeLoja: "Sabores da Vovó",
    horario: "09:00 - 21:00",
    descricao: "Doces caseiros com sabor de infância.",
    fotoPerfil: `${LOJAS_IMG}/Sabores da Vovó.svg`,
    idConfeiteira: "6"
  },
  {
    idLoja: 7,
    nomeLoja: "Delícias do Campo",
    horario: "07:00 - 17:00",
    descricao: "Receitas tradicionais e artesanais.",
    fotoPerfil: `${LOJAS_IMG}/Delícias do Campo.svg`,
    idConfeiteira: "7"
  },
  {
    idLoja: 8,
    nomeLoja: "Bella Confeitaria ",
    horario: "10:00 - 18:00",
    descricao: "Doces finos para ocasiões especiais.",
    fotoPerfil: `${LOJAS_IMG}/Bella Confeitaria.svg`,
    idConfeiteira: "8"
  },
  {
    idLoja: 9,
    nomeLoja: "Caramelo Doces",
    horario: "08:30 - 20:00",
    descricao: "Doces gourmets e sobremesas exclusivas.",
    fotoPerfil: `${LOJAS_IMG}/Caramelo Doces.svg`,
    idConfeiteira: "9"
  },
  {
    idLoja: 10,
    nomeLoja: "Cantinho Doce",
    horario: "09:00 - 19:30",
    descricao: "Delícias para adoçar o seu dia.",
    fotoPerfil: `${LOJAS_IMG}/Cantinho Doce.svg`,
    idConfeiteira: "10"
  },
  {
    idLoja: 11,
    nomeLoja: "Sabor & Arte",
    horario: "08:00 - 18:30",
    descricao: "Combinação perfeita de sabor e beleza.",
    fotoPerfil: `${LOJAS_IMG}/Sabor & Arte.svg`,
    idConfeiteira: "11"
  },
  {
    idLoja: 12,
    nomeLoja: "Cheiro Suave",
    horario: "10:00 - 22:00",
    descricao: "Doces sofisticados e irresistíveis.",
    fotoPerfil: `${LOJAS_IMG}/Cheiro Suave.svg`,
    idConfeiteira: "12"
  },
  {
    idLoja: 13,
    nomeLoja: "Doce Encanto",
    horario: "07:00 - 16:00",
    descricao: "Encantando com doces artesanais.",
    fotoPerfil: `${LOJAS_IMG}/Doce Encanto.svg`,
    idConfeiteira: "13"
  },
  {
    idLoja: 14,
    nomeLoja: "Sonho Doce",
    horario: "09:00 - 20:00",
    descricao: "Sonhos e doces que derretem na boca.",
    fotoPerfil: `${LOJAS_IMG}/Sonho Doce.svg`,
    idConfeiteira: "14"
  }
];

export const produtosPadrao = [
    {
      nome: "Alfajor",
      subtitulo: "Caixa com 12 unidades",
      categoria: "Alfajor",
      descricao: "Delicioso alfajor artesanal recheado com doce de leite argentino e coberto com chocolate ao leite",
      peso: 60,
      preco: 144.00,
      foto: `${DOCES_IMG}/Alfajor.svg`,
      idLoja: "10",
      idConfeiteira: "10",
      idProduto: 1
  },
  {
      nome: "Éclairs",
      subtitulo: "Caixa com 7 éclairs sortidas",
      categoria: "Éclair",
      descricao: "Caixa com 7 éclairs sortidas",
      peso: 210,
      preco: 133.00,
      foto: `${DOCES_IMG}/Eclairs.svg`,
      idLoja: "1",
      idConfeiteira: "1",
      idProduto: 2
  },
  {
      nome: "Bombons",
      subtitulo: "Caixa com 36 doces",
      categoria: "Bombons",
      descricao: "Caixa com 36 doces",
      peso: 360,
      preco: 148.00,
      foto: `${DOCES_IMG}/Bombons.svg`,
      idLoja: "2",
      idConfeiteira: "2",
      idProduto: 3
  },
  {
      nome: "Brigadeiros",
      subtitulo: "Caixa com 6 brigadeiros",
      categoria: "Brigadeiro",
      descricao: "Caixa com 6 brigadeiros de chocolate",
      peso: 90,
      preco: 15.00,
      foto: `${DOCES_IMG}/Brigadeiros.svg`,
      idLoja: "3",
      idConfeiteira: "3",
      idProduto: 4
  },
  {
      nome: "Brownie ninho e nutella",
      subtitulo: "Marmita brownie de ninho e nutella",
      categoria: "Brownie",
      descricao: "Marmita brownie de ninho e nutella",
      peso: 100,
      preco: 20.00,
      foto: `${DOCES_IMG}/Brownie de Ninho.svg`,
      idLoja: "4",
      idConfeiteira: "4",
      idProduto: 5
  },
  {
      nome: "Cookies Recheados",
      subtitulo: "Cookie recheado de chocolate",
      categoria: "Cookies",
      descricao: "Cookie recheado de chocolate",
      peso: 40,
      preco: 6.00,
      foto: `${DOCES_IMG}/Cookies de Chocolate.svg`,
      idLoja: "2",
      idConfeiteira: "2",
      idProduto: 6
  },
  {
      nome: "Pudim",
      subtitulo: "Pudim tamanho família",
      categoria: "Pudim",
      descricao: "Pudim tamanho família",
      peso: 1300,
      preco: 70.00,
      foto: `${DOCES_IMG}/Pudim.svg`,
      idLoja: "4",
      idConfeiteira: "4",
      idProduto: 7
  },
  {
      nome: "Mini Sonhos",
      subtitulo: "Sonhos tradicionais unidade",
      categoria: "Sonho",
      descricao: "Sonhos tradicionais unidade",
      peso: 25,
      preco: 2.50,
      foto: `${DOCES_IMG}/Mini Sonhos.svg`,
      idLoja: "1",
      idConfeiteira: "1",
      idProduto: 8
  },
  {
      nome: "Cheescake de Morango",
      subtitulo: "Cheescake de 8 fatias",
      categoria: "Cheescake",
      descricao: "Cheescake de 8 fatias",
      peso: 1100,
      preco: 163.00,
      foto: `${DOCES_IMG}/Cheescake.svg`,
      idLoja: "3",
      idConfeiteira: "3",
      idProduto: 9
  },
  {
      nome: "Pavê de Chocolates",
      subtitulo: "Pavê de chocolate preto e branco",
      categoria: "Pavê",
      descricao: "Pavê de chocolate preto e branco",
      peso: 150,
      preco: 16.00,
      foto: `${DOCES_IMG}/Pave.svg`,
      idLoja: "1",
      idConfeiteira: "1",
      idProduto: 10
  },
  {
      nome: "Rocambole Red Velvet",
      subtitulo: "Recheado com geléia de amoras",
      categoria: "Rocambole", 
      descricao: "Recheado com geléia de amoras",
      peso: 600, 
      preco: 120.00,
      foto: `${DOCES_IMG}/Romcabole.svg`,
      idLoja: "1", 
      idConfeiteira: "1", 
      idProduto: 11
  },
  {
    nome: "Torta de Limão",
    subtitulo: "Torta com recheio de limão siciliano",
    categoria: "Torta",
    descricao: "Deliciosa torta com creme de limão siciliano e base crocante",
    peso: 500,
    preco: 45.00,
    foto: `${DOCES_IMG}/Torta de Limão.svg`,
    idLoja: "5",
    idConfeiteira: "5",
    idProduto: 12
  },
  {
    nome: "Trufa de Chocolate",
    subtitulo: "Caixa com 12 trufas sortidas",
    categoria: "Bombons",
    descricao: "Trufas cremosas com cobertura de cacau",
    peso: 200,
    preco: 35.00,
    foto: `${DOCES_IMG}/Trufas de Chocolate.svg`,
    idLoja: "6",
    idConfeiteira: "6",
    idProduto: 13
  },
  {
    nome: "Churros Recheado",
    subtitulo: "Vários Recheios",
    categoria: "Churros",
    descricao: "Churros Recheados com vários sabores",
    peso: 300,
    preco: 15.00,
    foto: `${DOCES_IMG}/Churros Recheado.svg`,
    idLoja: "10",
    idConfeiteira: "10",
    idProduto: 14
  },
  {
    nome: "Cupcake Red Velvet",
    subtitulo: "Cupcake com cobertura de cream cheese",
    categoria: "Cupcake",
    descricao: "Clássico cupcake red velvet com cobertura de cream cheese",
    peso: 80,
    preco: 12.00,
    foto: `${DOCES_IMG}/Cupcake Red Velvet.svg`,
    idLoja: "8",
    idConfeiteira: "8",
    idProduto: 15
  },
  {
    nome: "Pão de Mel",
    subtitulo: "Pão de mel recheado com doce de leite",
    categoria: "Pão de Mel",
    descricao: "Pão de mel macio com recheio cremoso",
    peso: 100,
    preco: 10.00,
    foto: `${DOCES_IMG}/Pão de Mel.svg`,
    idLoja: "9",
    idConfeiteira: "9",
    idProduto: 16
  },
  {
    nome: "Cheesecake de Framboesa",
    subtitulo: "Cheesecake com cobertura de framboesa",
    categoria: "Cheesecake",
    descricao: "Delicioso cheesecake com base crocante e cobertura de framboesa",
    peso: 600,
    preco: 195.00,
    foto: `${DOCES_IMG}/Cheesecake Framboesa.svg`,
    idLoja: "7",
    idConfeiteira: "7",
    idProduto: 17
  },
  {
    nome: "Mousse de Maracujá",
    subtitulo: "Mousse leve e refrescante",
    categoria: "Mousse",
    descricao: "Mousse de maracujá com toque cítrico",
    peso: 150,
    preco: 18.00,
    foto: `${DOCES_IMG}/Mousse de Maracujá.svg`,
    idLoja: "11",
    idConfeiteira: "11",
    idProduto: 18
  },
  {
    nome: "Bolo de Cenoura",
    subtitulo: "Bolo caseiro com cobertura de chocolate",
    categoria: "Bolo",
    descricao: "Bolo fofinho de cenoura com cobertura de chocolate",
    peso: 800,
    preco: 70.00,
    foto: `${DOCES_IMG}/Bolo de Cenoura.svg`,
    idLoja: "12",
    idConfeiteira: "12",
    idProduto: 19
  },
  {
    nome: "Quindim",
    subtitulo: "Doce tradicional brasileiro",
    categoria: "Quindim",
    descricao: "Quindim com sabor autêntico e textura cremosa",
    peso: 90,
    preco: 8.00,
    foto: `${DOCES_IMG}/Quindim.svg`,
    idLoja: "13",
    idConfeiteira: "13",
    idProduto: 20
  },
  {
    nome: "Macarons",
    subtitulo: "Macarons Coloridos e Recheados",
    categoria: "Macarons",
    descricao: "Macarons Coloridos e Recheados",
    peso: 50,
    preco: 10.00,
    foto: `${DOCES_IMG}/Macarons.svg`,
    idLoja: "14",
    idConfeiteira: "14",
    idProduto: 21
  },
  {
    nome: "Banoffe",
    subtitulo: "Torta de banana com doce de leite",
    categoria: "Banoffe",
    descricao: "Clássica sobremesa Banoffe com base crocante",
    peso: 500,
    preco: 35.00,
    foto: `${DOCES_IMG}/Banoffe.svg`,
    idLoja: "14",
    idConfeiteira: "14",
    idProduto: 22
  },
  {
    nome: "Croissant Recheado",
    subtitulo: "Croissant com recheio de frutas vermelhas",
    categoria: "Croissant Recheado",
    descricao: "Croissant artesanal com recheio de frutas vermelhas",
    peso: 130,
    preco: 18.00,
    foto: `${DOCES_IMG}/Croissant de Frutas Vermelhas.svg`,
    idLoja: "8",
    idConfeiteira: "8",
    idProduto: 23
  },
  {
    nome: "Cake Pop",
    subtitulo: "Bolinhos no palito cobertos com chocolate",
    categoria: "Cake Pop",
    descricao: "Coloridos e divertidos, ideais para festas",
    peso: 80,
    preco: 8.00,
    foto: `${DOCES_IMG}/Cake pop.svg`,
    idLoja: "5",
    idConfeiteira: "5",
    idProduto: 24
  },
  {
    nome: "Tiramisu",
    subtitulo: "Sobremesa italiana com café e mascarpone",
    categoria: "Tiramisu",
    descricao: "Clássico italiano em versão individual",
    peso: 120,
    preco: 22.00,
    foto: `${DOCES_IMG}/Tiramisu.svg`,
    idLoja: "7",
    idConfeiteira: "7",
    idProduto: 25
  },
  {
    nome: "Beijinho",
    subtitulo: "Doce de coco com leite condensado",
    categoria: "Beijinho",
    descricao: "Tradicional docinho de festa brasileiro",
    peso: 25,
    preco: 2.00,
    foto: `${DOCES_IMG}/Beijinho.svg`,
    idLoja: "14",
    idConfeiteira: "14",
    idProduto: 26
  },
  {
    nome: "Bomba de Morango",
    subtitulo: "Recheado com brigadeiro",
    categoria: "Bomba de Morango",
    descricao: "Bomba recheado com brigadeiro, morango e banhado no chocolate",
    peso: 150,
    preco: 10.00,
    foto: `${DOCES_IMG}/Bomba de Morango.svg`,
    idLoja: "11",
    idConfeiteira: "11",
    idProduto: 27
  },
  {
    nome: "Chocolate de Dubai",
    subtitulo: "Barra recheada com kadayif e pistache",
    categoria: "Chocolate de Dubai",
    descricao: "Barra de chocolate recheada com kadayif e um creme de pistache e tahine",
    peso: 150,
    preco: 55.00,
    foto: `${DOCES_IMG}/Chocolate de Dubai.svg`,
    idLoja: "3",
    idConfeiteira: "3",
    idProduto: 28
  },
  {
    nome: "Morango do Amor",
    subtitulo: "Morango com Brigadeiro de Ninho",
    categoria: "Morango do Amor",
    descricao: "Morango com Brigadeiro de Ninho banhado no caramelo, viral das redes sociais!",
    peso: 100,
    preco: 15.00,
    foto: `${DOCES_IMG}/Morango do amor.svg`,
    idLoja: "2",
    idConfeiteira: "2",
    idProduto: 29
  },
  {
    nome: "Morango do Amor de Maracujá",
    subtitulo: "Brigadeiro de Maracujá",
    descricao: "Morango com Brigadeiro de Maracujá banhado no caramelo",
    peso: 100,
    categoria: "Morango do Amor",
    preco: 18.00,
    foto: `${DOCES_IMG}/Morango de Maracujá.svg`,
    idLoja: "10",
    idConfeiteira: "10",
    idProduto: 30
  },

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
