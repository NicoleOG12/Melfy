import { rotasCliente } from '../rotas.js';

document.addEventListener("DOMContentLoaded", function () {
  let produtos = JSON.parse(localStorage.getItem('Produtos')) || [];
  let lojas = JSON.parse(localStorage.getItem('Lojas')) || [];

  const cardsWrapper = document.querySelector('.cards-wrapper');
  const inputPesquisa = document.getElementById('search-input');
  const botaoPesquisa = document.getElementById('search-button');

  function formatarPreco(valor) {
    return parseFloat(valor).toFixed(2).replace('.', ',');
  }

  function formatarPeso(peso) {
    if (!peso) return 'Não informado';
    if (peso >= 1000) return `${peso / 1000} kg`;
    return `${peso} g`;
  }

  function renderizarProdutos(listaProdutos) {
    cardsWrapper.innerHTML = '';

    if (listaProdutos.length === 0) {
      cardsWrapper.innerHTML = '<p>Nenhum produto encontrado.</p>';
      return;
    }

    const listaInvertida = [...listaProdutos].reverse();

    listaInvertida.forEach(produto => {
      const idLojaProduto = parseInt(produto.idLoja);
      const loja = lojas.find(l => l.idLoja === idLojaProduto);

      const card = document.createElement('div');
      card.classList.add('card');

      card.innerHTML = `
        <div class="border-card">
          <div class="headerNovidade">
            <img src="${loja?.fotoPerfil || ''}" alt="Logo da Loja" class="logoLoja" />
          </div>
          <img src="${produto.foto}" alt="Imagem do Produto" class="imagem-produto" />
          <div class="descricao">
            <h3>${produto.nome}</h3>
            <p>${produto.subtitulo}</p>
          </div>
          <div class="footerNovidades">
            <div class="preco">
              <span class="icone-preco">R$</span>
              <span class="valor">${formatarPreco(produto.preco)}</span>
            </div>
            <div class="btn-carrinho">
              <i class="fas fa-shopping-bag"></i>
            </div>
          </div>
        </div>
      `;

      const logoLojaElement = card.querySelector('.logoLoja');
      logoLojaElement.addEventListener('click', function (e) {
        e.stopPropagation();
        localStorage.setItem('idLojaSelecionada', loja.idLoja);
        window.location.href = rotasCliente.loja;
      });

      card.addEventListener('click', function (event) {
        const isHeader = event.target.closest('.headerNovidade');
        if (!isHeader) {
          openModal(produto);
        }
      });

      cardsWrapper.appendChild(card);
    });
  }
  
  function removerAcentos(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function filtrarProdutos() {
    const termo = removerAcentos(inputPesquisa.value.trim().toLowerCase());
    cardsWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });

    if (!termo) {
      renderizarProdutos(produtos);
      return;
    }

    const produtosFiltrados = produtos.filter(produto => {
      const nomeSemAcento = removerAcentos(produto.nome.toLowerCase());
      const subtituloSemAcento = removerAcentos(produto.subtitulo.toLowerCase());
      const categoriaSemAcento = removerAcentos((produto.categoria || '').toLowerCase());

      return nomeSemAcento.includes(termo)
        || subtituloSemAcento.includes(termo)
        || categoriaSemAcento.includes(termo);
    });

    renderizarProdutos(produtosFiltrados);
  }

  renderizarProdutos(produtos);

  inputPesquisa.addEventListener('input', filtrarProdutos);
  inputPesquisa.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') filtrarProdutos();
  });
  botaoPesquisa.addEventListener('click', filtrarProdutos);
  
  function openModal(produto) {
    const idLojaProduto = parseInt(produto.idLoja);
    const loja = lojas.find(l => l.idLoja === idLojaProduto);
  
    document.querySelector('.modal-img').src = produto.foto || '';
    document.querySelector('.modal-img').alt = produto.nome || '';
  
    const modalLogo = document.querySelector('.modal-logo');
    const modalNomeLoja = document.querySelector('.modal-nome-loja');
    modalLogo.src = loja?.fotoPerfil || '';
    modalNomeLoja.textContent = loja?.nomeLoja || 'Loja Desconhecida';
  
    modalLogo.onclick = modalNomeLoja.onclick = function () {
      if (loja?.idLoja) {
        localStorage.setItem('idLojaSelecionada', loja.idLoja);
        window.location.href = rotasCliente.loja
      }
  };

  document.querySelector('.modal-title').textContent = produto.nome || '';
  document.querySelector('.modal-subtitulo').textContent = produto.subtitulo || '';
  document.querySelector('.modal-description').textContent = produto.descricao || '';
  document.querySelector('.modal-peso').textContent = `Peso: ${formatarPeso(produto.peso)}`;
  document.querySelector('.modal-price').textContent = `R$ ${formatarPreco(produto.preco)}`;

  document.getElementById('qtd-value').textContent = 1;
  document.getElementById('product-modal').style.display = 'flex';
}

  const btnAdd = document.querySelector('.btn-add');
  btnAdd.addEventListener('click', function () {
    adicionarNaSacola();
  });

  document.querySelectorAll('.doce').forEach(doce => {
    doce.addEventListener('click', function () {
      const categoria = this.querySelector('p').textContent.trim();
      const produtosFiltrados = produtos.filter(p => p.categoria === categoria);
      renderizarProdutos(produtosFiltrados);
  
      cardsWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });


});

function alterarQuantidade(valor) {
  const qtdSpan = document.getElementById('qtd-value');
  let quantidade = parseInt(qtdSpan.textContent);
  quantidade += valor;
  if (quantidade < 1) quantidade = 1;
  qtdSpan.textContent = quantidade;
}

function autoResize(textarea) {
  textarea.style.height = "auto";
  textarea.style.height = textarea.scrollHeight + "px";
}

function fecharModal() {
  document.getElementById("product-modal").style.display = "none";
}

function adicionarNaSacola() {
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado')) || null;
  if (!usuarioLogado || !usuarioLogado.id) {
    alert('Usuário não está logado corretamente!');
    return;
  }

  const nomeProduto = document.querySelector('.modal-title').textContent;
  const produtos = JSON.parse(localStorage.getItem('Produtos')) || [];

  const produto = produtos.find(p => p.nome === nomeProduto);
  if (!produto || !produto.idProduto) {
    alert('Produto não encontrado ou sem ID válido.');
    return;
  }

  const quantidadeAdicionada = parseInt(document.getElementById('qtd-value').textContent);

  const agora = new Date();
  const data = agora.toLocaleDateString();
  const horario = agora.toLocaleTimeString();

  const valorUnitario = parseFloat(produto.preco);
  const valorTotalAdicionado = valorUnitario * quantidadeAdicionada;

  let sacola = JSON.parse(localStorage.getItem('Sacola')) || [];

  const itemExistente = sacola.find(item =>
    item.idUsuario === usuarioLogado.id &&
    item.idProduto === produto.idProduto
  );

  if (itemExistente) {
    itemExistente.quantidade += quantidadeAdicionada;
    itemExistente.valorTotal = itemExistente.quantidade * itemExistente.valorUnitario;
    itemExistente.data = data;
    itemExistente.horario = horario;
  } else {
    sacola.push({
      idProduto: produto.idProduto,
      idUsuario: usuarioLogado.id,
      quantidade: quantidadeAdicionada,
      valorUnitario,
      valorTotal: valorTotalAdicionado,
      data,
      horario
    });
  }
  localStorage.setItem('Sacola', JSON.stringify(sacola));

  if (typeof window.atualizarContadorSacola === 'function') {
    window.atualizarContadorSacola();
  }

  mostrarAnimacaoCarrinho(produto.categoria, produto.nome);
  fecharModal();
}

function mostrarAnimacaoCarrinho(categoria, nomeProduto) {
  const animacao = document.getElementById('carrinho-animacao');
  const img = document.getElementById('img-doce-animado');
  const mensagem = document.getElementById('mensagem-sacola');

  const nomeCategoria = categoria || localStorage.getItem('categoriaSelecionada') || 'Beijinho';
  img.src = `../../assents/img/Categorias/${nomeCategoria}.svg`;
  img.alt = nomeCategoria;

  mensagem.textContent = `"${nomeProduto}" foi adicionado à sacola com sucesso!`;

  img.classList.remove('img-doce-sacola');
  void img.offsetWidth;
  img.classList.add('img-doce-sacola');

  animacao.style.display = 'flex';

  setTimeout(() => {
    animacao.style.display = 'none';
  }, 3000);
}
