function renderizarModalEdicao() {
  if (document.getElementById("editModal")) return;

  const modalHTML = `
<div class="modal-backdrop" id="modalBackdrop" hidden></div>

<dialog id="editModal" class="modal-container">
  <button class="modal-close" aria-label="Fechar modal">×</button>

  <section class="container">
      <div class="container-box">
          <div class="form-container-split">

              <div class="upload-section">
                <label for="foto" class="upload-box">
                    <i class="fas fa-camera-retro"></i>
                    <p>Carregar Imagem</p>
                    <input type="file" id="foto" hidden />
                    <img id="imagemExibida" src="" alt="Imagem Selecionada" />
                </label>
              </div>

              <div class="info-section">
                  <form id="formEdicao">
                      
                      <div class="floating-input">
                        <input type="text" id="nome" required />
                        <label>Nome do Produto</label>
                        <span id="nomeCounter">0 / 21</span>
                      </div><br>

                      <div class="floating-input">
                        <input type="text" id="subtitulo" required />
                        <label>Subtítulo</label>
                        <span id="subtituloCounter">0 / 35</span>
                      </div><br>

                      <div class="floating-input">
                        <select id="categoria" required>
                          <option value="" disabled selected hidden></option>
                          <option value="Bolo">Bolo</option>
                          <option value="Cookies">Cookies</option>
                          <option value="Alfajor">Alfajor</option>
                          <option value="Cupcakes">Cupcakes</option>
                          <option value="Tortas">Tortas</option>
                          <option value="Petit Gateau">Petit Gateau</option>
                          <option value="Olho de sogra">Olho de sogra</option>
                          <option value="Cajuzinho">Cajuzinho</option>
                          <option value="Mousse">Mousse</option>
                          <option value="Açaí">Açaí</option>
                          <option value="Pamonha doce">Pamonha doce</option>
                          <option value="Copo da felicidade">Copo da felicidade</option>
                          <option value="Geladinho Gourmet">Geladinho Gourmet</option>
                          <option value="Donuts">Donuts</option>
                          <option value="Coxinha Doce">Coxinha Doce</option>
                          <option value="Palha Italiana">Palha Italiana</option>
                          <option value="Trufas Recheadas">Trufas Recheadas</option>
                          <option value="Éclairs">Éclairs</option>
                          <option value="Bombons">Bombons</option>
                          <option value="Brigadeiros">Brigadeiros</option>
                          <option value="Brownie">Brownie</option>
                          <option value="Pudim">Pudim</option>
                          <option value="Sonhos">Mini Sonhos</option>
                          <option value="Cheescake">Cheescake</option>
                          <option value="Pavê">Pavê</option>
                          <option value="Romcabole">Romcabole</option>
                        </select>
                        <label>Categoria</label>
                      </div><br>

                      <div class="floating-input">
                        <textarea id="descricao" required></textarea>
                        <label>Descrição</label>
                      </div><br>

                      <div class="floating-input">
                        <input type="number" id="pesoInput" required />
                        <label>Peso</label>
                        <span id="pesoCounter">0 g</span>
                      </div><br>

                      <div class="floating-input">
                        <input type="number" id="precoInput" required />
                        <label>Preço</label>
                        <span id="precoCounter">R$ 0,00</span>
                      </div><br><br>

                      <div class="buttons">
                        <button type="submit" class="button-save">Salvar</button>
                      </div>
                  </form>
              </div>
          </div>
      </div>
  </section>

</dialog>
`;

  document.body.insertAdjacentHTML("beforeend", modalHTML);
}

document.addEventListener("DOMContentLoaded", () => {
  renderizarModalEdicao();

  let produtos = JSON.parse(localStorage.getItem('Produtos')) || [];
  const idLojaAtual = parseInt(localStorage.getItem('idLojaAtual'));

  const cardsWrapper = document.querySelector('.cards-wrapper');

  function formatarPreco(valor) {
    return parseFloat(valor).toFixed(2).replace('.', ',');
  }

  const produtosDaLoja = produtos.filter(p => parseInt(p.idLoja) === idLojaAtual);

  if (produtosDaLoja.length === 0) {
    cardsWrapper.innerHTML = "<p>Nenhum produto encontrado.</p>";
    return;
  }

  produtosDaLoja.forEach(produto => {
    const card = document.createElement("div");
    card.classList.add("cardP");

    card.innerHTML = `
      <div class="border-card">
        <button class="menu-btn">⋮</button>
        <div class="menu">
          <ul>
            <li class="editar-produto">Editar Produto</li>
            <li class="excluir-produto">Excluir Produto</li>
          </ul>
        </div>

        <img src="${produto.foto}" class="imagem-produto" />
        <div class="descricao">
          <h3>${produto.nome}</h3>
          <p>${produto.subtitulo}</p>
        </div>

        <div class="footerNovidades">
          <div class="preco">
            <span class="icone-preco">R$</span>
            <span class="valor">${formatarPreco(produto.preco)}</span>
          </div>
        </div>
      </div>
    `;

    const menuBtn = card.querySelector(".menu-btn");
    const menu = card.querySelector(".menu");

    menuBtn.addEventListener("click", e => {
      e.stopPropagation();
      document.querySelectorAll(".menu").forEach(m => {
        if (m !== menu) m.style.display = "none";
      });
      menu.style.display = menu.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", () => {
      menu.style.display = "none";
    });

    card.querySelector(".editar-produto").onclick = () => abrirModalEdicao(produto);

    card.querySelector(".excluir-produto").onclick = () => {
      if (confirm("Excluir este produto?")) {
        let produtos = JSON.parse(localStorage.getItem("Produtos")) || [];
        produtos = produtos.filter(p => p.idProduto !== produto.idProduto);
        localStorage.setItem("Produtos", JSON.stringify(produtos));
        location.reload();
      }
    };

    cardsWrapper.appendChild(card);
  });

  document.querySelector(".create-product-btn").onclick = abrirModalCriacao;
});

function abrirModalEdicao(produto) {
  const modal = document.getElementById("editModal");
  const backdrop = document.getElementById("modalBackdrop");

  modal.showModal();
  backdrop.hidden = false;

  document.querySelector("#nome").value = produto.nome;
  document.querySelector("#subtitulo").value = produto.subtitulo;
  document.querySelector("#categoria").value = produto.categoria;
  document.querySelector("#descricao").value = produto.descricao;
  document.querySelector("#pesoInput").value = produto.peso;
  document.querySelector("#precoInput").value = produto.preco;

  const imgExibida = document.querySelector("#imagemExibida");
  imgExibida.src = produto.foto;
  imgExibida.style.display = produto.foto ? "block" : "none";

  atualizarTudo();

  document.querySelector("#foto").onchange = e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = ev => {
      imgExibida.src = ev.target.result;
      imgExibida.style.display = "block";
    };
    reader.readAsDataURL(file);
  };

  document.querySelector(".button-save").onclick = e => {
    e.preventDefault();

    let produtos = JSON.parse(localStorage.getItem("Produtos")) || [];
    const index = produtos.findIndex(p => p.idProduto === produto.idProduto);

    produtos[index] = {
      ...produto,
      nome: document.querySelector("#nome").value,
      subtitulo: document.querySelector("#subtitulo").value,
      categoria: document.querySelector("#categoria").value,
      descricao: document.querySelector("#descricao").value,
      peso: document.querySelector("#pesoInput").value,
      preco: document.querySelector("#precoInput").value,
      foto: imgExibida.src
    };

    localStorage.setItem("Produtos", JSON.stringify(produtos));
    modal.close();
    backdrop.hidden = true;
    location.reload();
  };

  document.querySelector(".modal-close").onclick = () => {
    modal.close();
    backdrop.hidden = true;
  };
}

function abrirModalCriacao() {
  const modal = document.getElementById("editModal");
  const backdrop = document.getElementById("modalBackdrop");

  modal.showModal();
  backdrop.hidden = false;

  document.querySelector("#nome").value = "";
  document.querySelector("#subtitulo").value = "";
  document.querySelector("#categoria").value = "";
  document.querySelector("#descricao").value = "";
  document.querySelector("#pesoInput").value = "";
  document.querySelector("#precoInput").value = "";

  const img = document.getElementById("imagemExibida");
  img.src = "";
  img.style.display = "none";

  atualizarTudo();

  document.querySelector(".button-save").onclick = salvarProdutoNovo;

  document.querySelector(".button-delete").style.display = "none";

  document.querySelector(".modal-close").onclick = () => {
    modal.close();
    backdrop.hidden = true;
  };
}

function salvarProdutoNovo(e) {
  e.preventDefault();

  let produtos = JSON.parse(localStorage.getItem("Produtos")) || [];
  const img = document.getElementById("imagemExibida");

  const novoProduto = {
    idProduto: "P" + Math.floor(Math.random() * 999999),
    idLoja: localStorage.getItem("idLojaAtual"),
    idConfeiteira: localStorage.getItem("idConfeiteiraAtual"),
    nome: document.querySelector("#nome").value,
    subtitulo: document.querySelector("#subtitulo").value,
    categoria: document.querySelector("#categoria").value,
    descricao: document.querySelector("#descricao").value,
    peso: document.querySelector("#pesoInput").value,
    preco: document.querySelector("#precoInput").value,
    foto: img.src || ""
  };

  produtos.push(novoProduto);
  localStorage.setItem("Produtos", JSON.stringify(produtos));

  document.getElementById("editModal").close();
  document.getElementById("modalBackdrop").hidden = true;

  location.reload();
}

function atualizarTudo() {
  updateCounter("#nome", "#nomeCounter", 21);
  updateCounter("#subtitulo", "#subtituloCounter", 35);
  updatePesoCounter();
  updatePrecoCounter();

  document.querySelector("#nome").oninput = () =>
    updateCounter("#nome", "#nomeCounter", 21);

  document.querySelector("#subtitulo").oninput = () =>
    updateCounter("#subtitulo", "#subtituloCounter", 35);

  document.querySelector("#pesoInput").oninput = updatePesoCounter;

  document.querySelector("#precoInput").oninput = updatePrecoCounter;
}

function updateCounter(inputSel, counterSel, maxLength) {
  const input = document.querySelector(inputSel);
  const counter = document.querySelector(counterSel);

  const len = input.value.length;
  counter.textContent = `${len} / ${maxLength}`;
  counter.classList.toggle("red", len > maxLength);
}

function updatePesoCounter() {
  const peso = parseFloat(document.querySelector("#pesoInput").value) || 0;
  const counter = document.querySelector("#pesoCounter");
  counter.textContent = peso >= 1000 ? `${(peso / 1000).toFixed(2)} kg` : `${peso} g`;
}

function updatePrecoCounter() {
  const preco = parseFloat(document.querySelector("#precoInput").value) || 0;
  document.querySelector("#precoCounter").textContent = `R$ ${preco.toFixed(2)}`;
}