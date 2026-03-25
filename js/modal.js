const API_URL = "https://melfy-backend-production.up.railway.app";
let produtoAtual = null;
let precoUnitario = 0;

export function openModal(produto, lojas, rotasCliente) {
  produtoAtual = produto;

  const idLojaProduto = parseInt(produto.id_loja);
  const loja = lojas.find(
    l => parseInt(l.id_loja) === idLojaProduto || parseInt(l.idLoja) === idLojaProduto
  );

  document.querySelector('.modal-img').src =
    produto.midia?.imagens?.[0]?.path || produto.foto || '';
  document.querySelector('.modal-img').alt = produto.nome || '';

  const modalLogo = document.querySelector('.modal-logo');
  const modalNomeLoja = document.querySelector('.modal-nome-loja');

  modalLogo.src = loja?.pfp || loja?.fotoPerfil || '';
  modalLogo.alt = loja?.nomeLoja || loja?.loja_nome || loja?.nome || 'Loja';
  modalNomeLoja.textContent =
    loja?.nomeLoja || loja?.loja_nome || loja?.nome || 'Loja Desconhecida';

  modalLogo.onclick = modalNomeLoja.onclick = function () {
    const idLoja = loja?.id_loja || loja?.idLoja;
    if (idLoja) {
      localStorage.setItem('idLojaSelecionada', idLoja);
      window.location.href = rotasCliente.loja;
    }
  };

  document.querySelector('.modal-title').textContent = produto.nome || '';
  document.querySelector('.modal-subtitulo').textContent = produto.subtitulo || '';
  document.querySelector('.modal-description').textContent = produto.descricao || '';

  const preco = parseFloat(produto.valor_uni ?? produto.preco ?? produto.valor ?? 0);
  precoUnitario = preco;

  document.querySelector('.modal-price').textContent =
    `R$ ${preco.toFixed(2).replace('.', ',')}`;

  document.getElementById('qtd-value').textContent = 1;

  atualizarTotal();

  document.getElementById('product-modal').style.display = 'flex';
}

function atualizarTotal() {
  const quantidade = parseInt(document.getElementById('qtd-value').textContent);
  const total = quantidade * precoUnitario;

  const totalElement = document.getElementById('total-price');
  if (totalElement) {
    totalElement.textContent = total.toFixed(2).replace('.', ',');
  }
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

  atualizarTotal();
}

export function autoResize(textarea) {
  textarea.style.height = "auto";
  textarea.style.height = textarea.scrollHeight + "px";
}

export async function adicionarNaSacola() {
  const usuarioLogado = JSON.parse(localStorage.getItem("infoCliente")) || null;
  if (!usuarioLogado) {
    alert("Você precisa estar logado para adicionar produtos à cesta.");
    return;
  }

  if (!produtoAtual || !produtoAtual.id_produto) {
    alert("Produto não encontrado ou sem ID válido.");
    return;
  }

  const quantidade = parseInt(document.getElementById("qtd-value").textContent);
  const body = { qtd: quantidade };

  let respostaJson = null;
  try {
    const resposta = await fetch(`${API_URL}/carrinho?id=${produtoAtual.id_produto}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("tokenCliente")}`,
      },
      body: JSON.stringify(body),
    });

    const text = await resposta.text();
    respostaJson = text ? JSON.parse(text) : null;

    if (!resposta.ok) {
      console.error("Erro API:", respostaJson);
      alert("Erro ao adicionar o produto ao carrinho.");
      return;
    }
  } catch (err) {
    console.error("Falha ao conectar API:", err);
    alert("Não foi possível adicionar ao carrinho agora.");
    return;
  }

  if (respostaJson?.carrinho) {
    localStorage.setItem("Sacola", JSON.stringify(respostaJson.carrinho));
  }

  const imagemProduto = produtoAtual.midia?.imagens?.[0]?.path || produtoAtual.foto || '';
  mostrarAnimacaoCarrinho(imagemProduto, produtoAtual.nome);

  fecharModal();

  if (typeof window.atualizarContadorCarrinho === "function") {
    window.atualizarContadorCarrinho();
  }
  document.dispatchEvent(new CustomEvent("sacolaAtualizada"));
}

export function mostrarAnimacaoCarrinho(imgProduto, nomeProduto) {
  const animacao = document.getElementById('carrinho-animacao');
  const img = document.getElementById('img-doce-animado');
  const mensagem = document.getElementById('mensagem-sacola');

  img.src = imgProduto;
  img.alt = nomeProduto;
  mensagem.textContent = `"${nomeProduto}" foi adicionado à sacola com sucesso!`;

  img.classList.remove('img-doce-sacola');
  void img.offsetWidth;
  img.classList.add('img-doce-sacola');

  animacao.style.display = 'flex';
  setTimeout(() => { animacao.style.display = 'none'; }, 3000);
}

window.alterarQuantidade = alterarQuantidade;
window.fecharModal = fecharModal;