import { carregarTodosOsDados, produtosPadrao } from '../dicionario.js';
import { rotasConfeiteira } from '../rotas.js';

document.addEventListener('DOMContentLoaded', () => {
  carregarTodosOsDados();

  let produtosExistentes = JSON.parse(localStorage.getItem('Produtos')) || [];
  const nomesExistentes = new Set(produtosExistentes.map(p => p.nome + p.subtitulo));
  const novosProdutos = (produtosPadrao || []).filter(p => !nomesExistentes.has(p.nome + p.subtitulo));

  produtosExistentes = produtosExistentes.concat(novosProdutos);
  localStorage.setItem('Produtos', JSON.stringify(produtosExistentes));  

  const nomeInput = document.getElementById("nome");
  const subtituloInput = document.getElementById("subtitulo");
  const nomeCounter = document.getElementById("nomeCounter");
  const subtituloCounter = document.getElementById("subtituloCounter");
  const pesoInput = document.getElementById("pesoInput");
  const precoInput = document.getElementById("precoInput");
  const pesoCounter = document.getElementById("pesoCounter");
  const precoCounter = document.getElementById("precoCounter");

  let pesoGramas = 0;
  let preco = 0.00;

  function updateCounter(input, counterElement, maxLength) {
    const currentLength = input.value.length;
    counterElement.textContent = `${currentLength} / ${maxLength}`;

    if (currentLength > maxLength) {
      counterElement.classList.add("red");
      input.value = input.value.substring(0, maxLength);
    } else {
      counterElement.classList.remove("red");
    }
  }

  nomeInput.addEventListener("input", () => {
    updateCounter(nomeInput, nomeCounter, 21);
  });

  subtituloInput.addEventListener("input", () => {
    updateCounter(subtituloInput, subtituloCounter, 35);
  });

  function updatePrecoCounter() {
    precoCounter.textContent = `R$ ${preco.toFixed(2).replace('.', ',')}`;
  }

  function updatePesoCounter() {
    if (pesoGramas >= 1000) {
      let pesoKg = pesoGramas / 1000;
      pesoCounter.textContent = `${pesoKg.toFixed(2)} kg`;
    } else {
      pesoCounter.textContent = `${pesoGramas} g`;
    }
  }

  function validarPesoInput(value) {
    return (value < 0 || isNaN(value)) ? 0 : value;
  }

  function validarPrecoInput(value) {
    return (value < 0 || isNaN(value)) ? 0 : value;
  }

  pesoInput.addEventListener("input", () => {
    pesoGramas = validarPesoInput(parseFloat(pesoInput.value));
    updatePesoCounter();
  });

  precoInput.addEventListener("input", () => {
    preco = validarPrecoInput(parseFloat(precoInput.value));
    updatePrecoCounter();
  });

  document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();

    let nomeProduto = nomeInput.value.trim();
    let subtitulo = subtituloInput.value.trim();
    const categoria = document.getElementById("categoria").value.trim();
    const descricao = document.getElementById("detalhes").value.trim();

    if (nomeProduto.length > 21) {
      alert("O nome do produto deve ter no máximo 21 caracteres.");
      return;
    }

    if (subtitulo.length > 35) {
      alert("O subtítulo deve ter no máximo 35 caracteres.");
      return;
    }
    
    if (!categoria) {
      alert("Por favor, selecione uma categoria.");
      return;
    }

    if (preco <= 0) {
      alert("O preço deve ser maior que zero.");
      return;
    }

    if (pesoGramas <= 0) {
      alert("O peso deve ser maior que zero.");
      return;
    }

    const novoProduto = {
      nome: nomeProduto,
      subtitulo: subtitulo,
      categoria: categoria,
      descricao: descricao,
      peso: pesoGramas,
      preco: preco,
      foto: document.getElementById("imagemExibida").src,
      idLoja: localStorage.getItem('idLojaAtual'),
      idConfeiteira: localStorage.getItem('idConfeiteiraAtual')
    };

    const idProduto = gerarIdProduto();
    novoProduto.idProduto = idProduto;

    let produtos = JSON.parse(localStorage.getItem('Produtos')) || [];
    produtos.push(novoProduto);

    localStorage.setItem('Produtos', JSON.stringify(produtos));

    alert("Produto adicionado com sucesso!");
    window.location.href = rotasConfeiteira.meusProdutos
  });

  updatePesoCounter();
  updatePrecoCounter();
  updateCounter(nomeInput, nomeCounter, 21);
  updateCounter(subtituloInput, subtituloCounter, 35);
});

function gerarIdProduto() {
  let produtos = JSON.parse(localStorage.getItem('Produtos')) || [];
  return produtos.length > 0 ? Math.max(...produtos.map(p => p.idProduto)) + 1 : 1;
}

window.exibirImagem = function(event) {
  const input = event.target;
  const arquivo = input.files[0];

  if (arquivo) {
    const leitor = new FileReader();
    leitor.onload = function(e) {
      const imagemExibida = document.getElementById('imagemExibida');
      imagemExibida.src = e.target.result;
      imagemExibida.style.display = 'block';
    };
    leitor.readAsDataURL(arquivo);
  }
};
