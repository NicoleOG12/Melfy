export function openModal(produto, lojas, rotasCliente) {
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
      window.location.href = rotasCliente.loja;
    }
  };

  document.querySelector('.modal-title').textContent = produto.nome || '';
  document.querySelector('.modal-subtitulo').textContent = produto.subtitulo || '';
  document.querySelector('.modal-description').textContent = produto.descricao || '';
  document.querySelector('.modal-peso').textContent = `Peso: ${produto.peso >= 1000 ? produto.peso/1000+' kg' : produto.peso+' g'}`;
  document.querySelector('.modal-price').textContent = `R$ ${parseFloat(produto.preco).toFixed(2).replace('.', ',')}`;

  document.getElementById('qtd-value').textContent = 1;
  document.getElementById('product-modal').style.display = 'flex';
}

export function fecharModal() {
  document.getElementById("product-modal").style.display = "none";
}

export function alterarQuantidade(valor) {
  const qtdSpan = document.getElementById('qtd-value');
  let quantidade = parseInt(qtdSpan.textContent);
  quantidade += valor;
  if (quantidade < 1) quantidade = 1;
  qtdSpan.textContent = quantidade;
}

export function autoResize(textarea) {
  textarea.style.height = "auto";
  textarea.style.height = textarea.scrollHeight + "px";
}

export function adicionarNaSacola() {
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
  if (typeof atualizarContadorSacola === 'function') atualizarContadorSacola();
  mostrarAnimacaoCarrinho(produto.categoria, produto.nome);
  document.getElementById("product-modal").style.display = "none";

  document.dispatchEvent(new CustomEvent('sacolaAtualizada'));
}

export function mostrarAnimacaoCarrinho(categoria, nomeProduto) {
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
  setTimeout(() => { animacao.style.display = 'none'; }, 3000);
}

window.alterarQuantidade = alterarQuantidade;
window.fecharModal = fecharModal;
