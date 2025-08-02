function carregarSacola() {
  const sacola = JSON.parse(localStorage.getItem('Sacola')) || [];
  const produtos = JSON.parse(localStorage.getItem('Produtos')) || [];
  const lojas = JSON.parse(localStorage.getItem('Lojas')) || [];
  const tbody = document.querySelector('tbody');
  const subtotalSpan = document.querySelector('#subtotal');
  const totalSpan = document.querySelector('#total');

  tbody.innerHTML = '';

  if (sacola.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Sua sacola está vazia.</td></tr>';
    subtotalSpan.textContent = 'R$ 0,00';
    totalSpan.textContent = 'R$ 0,00';
    return;
  }

  let subtotal = 0;

  const lojasAgrupadas = {};
  sacola.forEach((item, index) => {
    const produto = produtos.find(p => p.idProduto === item.idProduto);
    const idLoja = parseInt(produto?.idLoja);
    const loja = lojas.find(l => parseInt(l.idLoja) === idLoja);

    if (!lojasAgrupadas[idLoja]) {
      lojasAgrupadas[idLoja] = {
        nomeLoja: loja?.nomeLoja || 'Loja Desconhecida',
        logoLoja: loja?.fotoPerfil || 'img/logo-default.png',
        itens: [],
        idLoja: idLoja
      };
    }

    lojasAgrupadas[idLoja].itens.push({ item, produto, index });
  });

  Object.values(lojasAgrupadas).forEach((loja, i) => {
    if (i > 0) {
      const trSeparador = document.createElement('tr');
      trSeparador.classList.add('linha-separadora');
      trSeparador.innerHTML = `<td colspan="5" class="td-separador"></td>`;
      tbody.appendChild(trSeparador);
    }

    const trLoja = document.createElement('tr');
    trLoja.classList.add('linha-loja');
    trLoja.innerHTML = `
      <td colspan="5">
        <div class="loja-header" style="display: flex; align-items: center; gap: 12px;">
          <input type="checkbox" class="check-loja" data-idloja="${loja.idLoja}" checked onchange="LojaCheckbox(this)">
          <div class="loja-header-info" style="display:flex; align-items:center; gap:8px;">
            <img src="${loja.logoLoja}" alt="Logo da Loja" class="logo-loja">
            <strong>${loja.nomeLoja}</strong>
          </div>
        </div>
      </td>
    `;
    tbody.appendChild(trLoja);

    loja.itens.forEach(({ item, produto, index }) => {
      const nome = produto?.nome || 'Produto';
      const imagem = produto?.foto || 'img/default.jpg';
      const valorUnitario = item.valorUnitario.toFixed(2).replace('.', ',');
      const valorTotal = item.valorTotal.toFixed(2).replace('.', ',');

      subtotal += item.valorTotal;

      const tr = document.createElement('tr');
      tr.classList.add('linha-produto');
      tr.innerHTML = `
        <td>
          <div class="produto" style="display:flex; align-items:center; gap:8px;">
            <input type="checkbox" class="check-produto" data-index="${index}" data-idloja="${loja.idLoja}" checked onchange="atualizarTotal()">
            <img src="${imagem}" alt="${nome}" class="foto-produto">
            <div class="info">
              <h3 class="nome">${nome}</h3>
            </div>
          </div>
        </td>
        <td>R$ ${valorUnitario}</td>
        <td>
          <div class="qtd">
            <button onclick="alterarQuantidade(${index}, -1)"> <i class='bx bx-minus'></i> </button>
            <span>${item.quantidade}</span>
            <button onclick="alterarQuantidade(${index}, 1)"> <i class='bx bx-plus'></i> </button>
          </div>
        </td>
        <td>R$ ${valorTotal}</td>
        <td>
          <button class="remover" onclick="removerItem(${index})"> <i class='bx bx-x'></i> </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  });

  subtotalSpan.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
  totalSpan.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
}

function LojaCheckbox(lojaCheckbox) {
  const idLoja = lojaCheckbox.getAttribute('data-idloja');
  const checkboxesProdutos = document.querySelectorAll(`input.check-produto[data-idloja="${idLoja}"]`);
  checkboxesProdutos.forEach(checkbox => {
    checkbox.checked = lojaCheckbox.checked;
  });
  atualizarTotal();
}

function alterarQuantidade(index, delta) {
  const sacola = JSON.parse(localStorage.getItem('Sacola')) || [];

  if (!sacola[index]) return;

  sacola[index].quantidade += delta;

  if (sacola[index].quantidade < 1) {
    sacola[index].quantidade = 1;
  }

  sacola[index].valorTotal = sacola[index].quantidade * sacola[index].valorUnitario;

  localStorage.setItem('Sacola', JSON.stringify(sacola));
  carregarSacola();
  atualizarTotal();
}

function removerItem(index) {
  if (confirm('Tem certeza que deseja remover este item da sacola?')) {
    const sacola = JSON.parse(localStorage.getItem('Sacola')) || [];

    if (index >= 0 && index < sacola.length) {
      sacola.splice(index, 1);
      localStorage.setItem('Sacola', JSON.stringify(sacola));
      carregarSacola();
      atualizarTotal();
    }
  }
}

function atualizarTotal() {
  const checkboxes = document.querySelectorAll('.check-produto');
  const subtotalSpan = document.querySelector('#subtotal');
  const totalSpan = document.querySelector('#total');
  let subtotal = 0;

  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      const sacola = JSON.parse(localStorage.getItem('Sacola')) || [];
      const index = parseInt(checkbox.getAttribute('data-index'));
      const item = sacola[index];
      if (item) {
        subtotal += item.valorTotal;
      }
    }
  });

  subtotalSpan.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
  totalSpan.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
}

window.onload = carregarSacola;

function abrirModalCompra() {
  const modal = document.getElementById('modal-compra-buy');
  modal.style.display = 'flex';
  preencherProdutosModalCompra();
  atualizarFreteCompra();
}

function fecharModalCompra() {
  const modal = document.getElementById('modal-compra-buy');
  modal.style.display = 'none';
}

function preencherProdutosModalCompra() {
  const sacola = JSON.parse(localStorage.getItem('Sacola')) || [];
  const produtos = JSON.parse(localStorage.getItem('Produtos')) || [];
  const lista = document.getElementById('lista-produtos-compra');
  lista.innerHTML = '';

  if (sacola.length === 0) {
    lista.innerHTML = '<p>Sua sacola está vazia.</p>';
    document.getElementById('total-compra').textContent = 'R$ 0,00';
    window.modalSubtotalBuy = 0;
    return;
  }

  let subtotal = 0;

  sacola.forEach((item, index) => {
    const produto = produtos.find(p => p.idProduto === item.idProduto);
    if (!produto) return;

    const nome = produto.nome || 'Produto';
    const foto = produto.foto || 'img/default.jpg';
    const preco = item.valorUnitario.toFixed(2).replace('.', ',');
    const quantidade = item.quantidade;

    subtotal += item.valorTotal;

    const divProduto = document.createElement('div');
    divProduto.style.display = 'flex';
    divProduto.style.alignItems = 'flex-start';
    divProduto.style.marginBottom = '20px';
    divProduto.style.flexDirection = 'column';
    divProduto.style.borderBottom = '1px solid var(--cor-botao-hover)';
    divProduto.style.paddingBottom = '12px';

    divProduto.innerHTML = `
      <div style="display: flex; width: 100%;">
        <img src="${foto}" alt="${nome}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; margin-right: 20px; border: 1px solid var(--cor-botao-hover);" />
        <div style="flex: 1;">
          <div style="font-weight: bold; color: var(--cor-nome);">${nome}</div>
          <div style="color: var(--cor-footer-text); margin-top: 4px;">Preço unitário: R$ ${preco}</div>
          <div style="color: var(--cor-footer-text); margin-top: 2px;">Quantidade: ${quantidade}</div>
        </div>
        <div style="font-weight: bold; color: var(--cor-laranja); min-width: 80px; text-align: right;">
          R$ ${(item.valorTotal).toFixed(2).replace('.', ',')}
        </div>
      </div>
      <div style="margin-top: 10px; width: 100%;">
        <label for="comentario-${index}" style="font-weight: bold; color: var(--cor-nome); display:block; margin-bottom:4px;">Comentário para este item:</label>
        <textarea id="comentario-${index}" class="comentario-item" placeholder="Ex: Sem cebola, embalagem separada..." 
          style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid #ccc; resize: vertical; font-family: inherit; font-size: 14px;"></textarea>
      </div>
    `;

    lista.appendChild(divProduto);
  });

  document.getElementById('total-compra').textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
  window.modalSubtotalBuy = subtotal;
}


function atualizarFreteCompra() {
  const entrega = document.querySelector('input[name="entrega-buy"]:checked')?.value || 'retirada';
  const valorFreteSpan = document.getElementById('total-frete-buy');
  const totalProdutosSpan = document.getElementById('total-produtos-buy');
  const totalModalSpan = document.getElementById('total-compra');
  const totalGeralSpan = document.getElementById('total-geral-buy');

  let frete = 0;
  if (entrega === 'delivery') {
    frete = 10.00;
  }

  valorFreteSpan.textContent = `R$ ${frete.toFixed(2).replace('.', ',')}`;

  const totalProdutos = window.modalSubtotalBuy || 0;

  if (totalProdutosSpan) {
    totalProdutosSpan.textContent = `R$ ${totalProdutos.toFixed(2).replace('.', ',')}`;
  }

  if (totalModalSpan) {
    totalModalSpan.textContent = `R$ ${totalProdutos.toFixed(2).replace('.', ',')}`;
  }

  const totalGeral = totalProdutos + frete;
  if (totalGeralSpan) {
    totalGeralSpan.textContent = `R$ ${totalGeral.toFixed(2).replace('.', ',')}`;
  }
}

function finalizarCompra() {
  const pagamento = document.querySelector('input[name="pagamento-buy"]:checked').value;
  const entrega = document.querySelector('input[name="entrega-buy"]:checked').value;

  alert(`Compra finalizada!\nPagamento: ${pagamento}\nEntrega: ${entrega}`);

  localStorage.removeItem('Sacola');
  carregarSacola();

  fecharModalCompra();
}

document.addEventListener("DOMContentLoaded", function () { 
    let produtos = JSON.parse(localStorage.getItem('Produtos')) || [];
    let lojas = JSON.parse(localStorage.getItem('Lojas')) || [];

    const cardsWrapper = document.querySelector('.cards-wrapper');

    function renderizarProdutosAleatorios(listaProdutos) {
        cardsWrapper.innerHTML = '';

        if (listaProdutos.length === 0) {
            cardsWrapper.innerHTML = '<p>Nenhum produto encontrado.</p>';
            return;
        }

        const produtosAleatorios = listaProdutos
            .slice()
            .sort(() => 0.5 - Math.random())
            .slice(0, 4);

        produtosAleatorios.forEach(produto => {
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
                            <span class="valor">${produto.preco}</span>
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
                window.location.href = 'loja.html';
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

    renderizarProdutosAleatorios(produtos);

    document.querySelectorAll('.doce').forEach(doce => {
        doce.addEventListener('click', function () {
            const categoria = this.querySelector('p').textContent.trim();
            localStorage.setItem('categoriaSelecionada', categoria); 
            window.location.href = 'produtos.html';
        });
    });

    const btnAdd = document.querySelector('.btn-add');
    if (btnAdd) {
        btnAdd.addEventListener('click', function() {
            adicionarNaSacola();
        });
    }

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
    });

    document.querySelectorAll('.doce').forEach(doce => {
        doce.addEventListener('click', function () {
          const categoria = this.querySelector('p').textContent.trim();
          localStorage.setItem('categoriaSelecionada', categoria); 
          window.location.href = 'produtos.html';
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
     
    mostrarAnimacaoCarrinho(produto.categoria, produto.nome);
    fecharModal();
}

function mostrarAnimacaoCarrinho(categoria, nomeProduto) {
    const animacao = document.getElementById('carrinho-animacao');
    const img = document.getElementById('img-doce-animado');
    const mensagem = document.getElementById('mensagem-sacola');

    const nomeCategoria = categoria || localStorage.getItem('categoriaSelecionada') || 'Beijinho';
    img.src = `./img/Categorias/${nomeCategoria}.svg`;
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
