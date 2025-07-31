document.addEventListener("DOMContentLoaded", function () { 
    let produtos = JSON.parse(localStorage.getItem('Produtos')) || [];
    let lojas = JSON.parse(localStorage.getItem('Lojas')) || [];

    const cardsWrapper = document.querySelector('.cards-wrapper');
    const inputPesquisa = document.getElementById('search-input');
    const botaoPesquisa = document.getElementById('search-button');

    function removerAcentos(str) {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    function renderizarProdutos(listaProdutos) {
        cardsWrapper.innerHTML = '';

        if (listaProdutos.length === 0) {
            cardsWrapper.innerHTML = '<p>Nenhum produto encontrado.</p>';
            return;
        }

        listaProdutos.forEach(produto => {
            const idLojaProduto = parseInt(produto.idLoja);
            const loja = lojas.find(l => l.idLoja === idLojaProduto);

            const card = document.createElement('div');
            card.classList.add('card');
            
            card.innerHTML = `
                <div class="border-card">
                    <div class="headerNovidade">
                        <img src="${loja?.fotoPerfil || ''}" alt="Logo da Loja" class="logoLoja" />
                        <span class="marca">${loja?.nomeLoja || 'Loja Desconhecida'}</span>
                    </div>
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
            
            const nomeLojaElement = card.querySelector('.marca');
            const logoLojaElement = card.querySelector('.logoLoja');
            
            [nomeLojaElement, logoLojaElement].forEach(el => {
                el.addEventListener('click', function (e) {
                    e.stopPropagation(); 
                    localStorage.setItem('idLojaSelecionada', loja.idLoja);
                    window.location.href = 'loja.html';
                });
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

    function filtrarProdutos() {
        const termo = removerAcentos(inputPesquisa.value.trim().toLowerCase());
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

    botaoPesquisa.addEventListener('click', filtrarProdutos);
    inputPesquisa.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            filtrarProdutos();
        }
    });

    function openModal(produto) {
        const idLojaProduto = parseInt(produto.idLoja);
        const loja = lojas.find(l => l.idLoja === idLojaProduto);
      
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
        document.getElementById('product-modal').style.display = 'flex';
    }

    const btnAdd = document.querySelector('.btn-add');
    btnAdd.addEventListener('click', function() {
        adicionarNaSacola();
    });

    document.querySelectorAll('.doce').forEach(doce => {
        doce.addEventListener('click', function () {
          const categoria = this.querySelector('p').textContent.trim();
          localStorage.setItem('categoriaSelecionada', categoria); 
          window.location.href = 'produtos.html';
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

    // Verifica se já existe o mesmo produto na sacola desse usuário
    const itemExistente = sacola.find(item =>
        item.idUsuario === usuarioLogado.id &&
        item.idProduto === produto.idProduto
    );

    if (itemExistente) {
        // Atualiza a quantidade e o valor total
        itemExistente.quantidade += quantidadeAdicionada;
        itemExistente.valorTotal = itemExistente.quantidade * itemExistente.valorUnitario;

        itemExistente.data = data;
        itemExistente.horario = horario;
    } else {
        // Adiciona um novo item
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

    alert('Produto adicionado à sacola!');
    fecharModal();
}



function entrarPerfil() {
  let usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

  if (!usuarioLogado || Object.keys(usuarioLogado).length === 0) {
      alert('Você precisa se logar primeiro!');
      window.location.href = 'login.html';
  } else {
      alert('Usuário logado!!');
      window.location.href = 'perfil.html';
  }

  console.log(usuarioLogado);
}

