document.addEventListener("DOMContentLoaded", function () {
  let lojas = JSON.parse(localStorage.getItem('Lojas')) || [];
  let produtos = JSON.parse(localStorage.getItem('Produtos')) || [];
  const idLojaAtual = parseInt(localStorage.getItem('idLojaSelecionada'));

  const nomeLojaElement = document.getElementById('nome-loja');
  const logoLojaElement = document.querySelector('.logo-loja');

  const loja = lojas.find(l => parseInt(l.idLoja) === idLojaAtual);
  
  if (loja) {
    nomeLojaElement.textContent = loja.nomeLoja || 'Loja Desconhecida';
    logoLojaElement.src = loja.fotoPerfil || 'placeholder.jpg';
    logoLojaElement.alt = loja.nomeLoja || 'Loja Desconhecida';
  } else {
    nomeLojaElement.textContent = 'Loja Desconhecida';
    logoLojaElement.src = 'placeholder.jpg';
    logoLojaElement.alt = 'Loja Desconhecida';
  }

  const produtosWrapper = document.querySelector('.produtos');
  const cardsWrapper = document.querySelector('.cards-wrapper');
  const botaoPesquisa = document.getElementById('search-button');
  const inputPesquisa = document.getElementById('search-input');

  const produtosDaLojaLogada = produtos.filter(produto => parseInt(produto.idLoja) === idLojaAtual);

  function renderizarProdutosDestaques(produtos) {
    produtosWrapper.innerHTML = '';
    if (produtos.length === 0) {
      produtosWrapper.innerHTML = '<p>Nenhum produto disponível.</p>';
      return;
    }
    const doisProdutosRecentes = produtos.slice(-2).reverse();
    doisProdutosRecentes.forEach(produto => {
      const produtoElement = document.createElement('div');
      produtoElement.classList.add('produto');
      produtoElement.innerHTML = `
        <img src="${produto.foto}" alt="${produto.nome}">
        <h4>${produto.nome}</h4>
        <p>${produto.subtitulo}</p>
      `;
      produtoElement.style.cursor = 'pointer';
      produtoElement.onclick = () => openModal(produto);

      produtosWrapper.appendChild(produtoElement);
    });
  }

  function renderizarProdutos(produtos) {
    cardsWrapper.innerHTML = '';
    if (produtos.length === 0) {
      cardsWrapper.innerHTML = '<p>Nenhum produto encontrado.</p>';
      return;
    }
    produtos.forEach(produto => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.innerHTML = `
        <div class="border-card" onclick='openModal(${JSON.stringify(produto).replace(/'/g, "\\'")})'>
          <img src="${produto.foto}" alt="Imagem do Produto" class="imagem-produto" />
          <div class="descricao">
              <h3>${produto.nome}</h3>
              <p>${produto.subtitulo}</p>
          </div>
          <div class="footerNovidades">
              <div class="preco">
                  <span class="icone-preco">R$</span>
                  <span class="valor">${produto.preco}</span>
              </div>
          </div>
        </div>
      `;
      cardsWrapper.appendChild(card);
    });
  }

  function removerAcentos(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function filtrarProdutos() {
    const termo = removerAcentos(inputPesquisa.value.trim().toLowerCase());
    if (!termo) {
      renderizarProdutos(produtosDaLojaLogada);
      return;
    }
    const produtosFiltrados = produtosDaLojaLogada.filter(produto => {
      const nome = removerAcentos(produto.nome.toLowerCase());
      const subtitulo = removerAcentos(produto.subtitulo.toLowerCase());
      const categoria = removerAcentos((produto.categoria || '').toLowerCase());
      return nome.includes(termo) || subtitulo.includes(termo) || categoria.includes(termo);
    });
    renderizarProdutos(produtosFiltrados);
  }

  renderizarProdutosDestaques(produtosDaLojaLogada);
  renderizarProdutos(produtosDaLojaLogada);

  if (botaoPesquisa && inputPesquisa) {
    botaoPesquisa.addEventListener('click', filtrarProdutos);
    inputPesquisa.addEventListener('keyup', function(event) {
      if (event.key === 'Enter') {
        filtrarProdutos();
      }
    });
  }
});

function openModal(produto) {
  let lojas = JSON.parse(localStorage.getItem('Lojas')) || [];
  const idLojaProduto = parseInt(produto.idLoja);
  const loja = lojas.find(l => parseInt(l.idLoja) === idLojaProduto);
  document.querySelector('.modal-img').src = produto.foto || '';
  document.querySelector('.modal-img').alt = produto.nome || '';
  document.querySelector('.modal-logo').src = loja?.fotoPerfil || '';
  document.querySelector('.modal-nome-loja').textContent = loja?.nomeLoja || 'Loja Desconhecida';
  document.querySelector('.modal-title').textContent = produto.nome || '';
  document.querySelector('.modal-subtitulo').textContent = produto.subtitulo || '';
  document.querySelector('.modal-description').textContent = produto.descricao || '';
  document.querySelector('.modal-peso').textContent = `Peso: ${produto.peso || 'Não informado'}`;
  document.querySelector('.modal-price').textContent = `R$ ${parseFloat(produto.preco).toFixed(2).replace('.', ',')}`;
  document.getElementById('qtd-value').textContent = 1;
  document.getElementById('comentario').value = '';
  document.getElementById('product-modal').style.display = 'flex';
}

const btnAdd = document.querySelector('.btn-add');
if(btnAdd) {
  btnAdd.addEventListener('click', function () {
    adicionarNaSacola();
  });
}

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
  const comentario = document.getElementById('comentario').value.trim();
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
    itemExistente.comentario = comentario || itemExistente.comentario;
    itemExistente.data = data;
    itemExistente.horario = horario;
  } else {
    sacola.push({
      idProduto: produto.idProduto,
      idUsuario: usuarioLogado.id,
      quantidade: quantidadeAdicionada,
      comentario,
      valorUnitario,
      valorTotal: valorTotalAdicionado,
      data,
      horario
    });
  }

  localStorage.setItem('Sacola', JSON.stringify(sacola));
  alert('Produto adicionado à sacola!');
  fecharModal();
}
