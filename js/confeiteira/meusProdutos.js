const API_URL = "https://melfy-backend-production.up.railway.app";

function limitarDescricao(texto, limite = 45) {
  if (!texto) return "";
  const clean = texto.normalize("NFC");
  const arr = [...clean];
  const textoCortado = arr.slice(0, limite).join("");
  return arr.length > limite ? `${textoCortado}... <strong>ver mais</strong>` : texto;
}

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
                <img id="imagemExibida" src="" alt="" />
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
                  <select id="categoria" required></select>
                  <label>Categoria</label>
                </div><br>
                <div class="floating-input">
                  <textarea id="descricao" required></textarea>
                  <label>Descrição</label>
                </div><br>
                <div class="floating-input">
                  <input type="text" id="prazoInput" required />
                  <label>Prazo</label>
                  <span id="prazoCounter">0</span>
                </div><br>
                <div class="floating-input">
                  <input type="number" id="precoInput" required step="0.01" min="0" max="999.99"/>
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

async function carregarCategorias(selecionarId = null) {
  try {
    const res = await fetch(`${API_URL}/categorias`);
    const data = await res.json();
    const select = document.querySelector("#categoria");

    select.innerHTML = `<option value="" disabled ${!selecionarId ? "selected" : ""}>Selecione a categoria</option>`;

    (data.result || []).forEach(cat => {
      const option = document.createElement("option");
      option.value = cat.id_categoria;
      option.textContent = cat.nome;
      if (selecionarId && Number(cat.id_categoria) === Number(selecionarId)) {
        option.selected = true;
      }
      select.appendChild(option);
    });
  } catch (err) {
    console.error("Erro ao carregar categorias:", err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderizarModalEdicao();

  const cardsWrapper = document.querySelector(".cards-wrapper");
  let produtos = [];
  const lojaLogada = JSON.parse(localStorage.getItem("infoLoja") || "null");
  const idLojaLogada = lojaLogada?.[0]?.id_loja;

  async function carregarProdutos() {
    if (!idLojaLogada) {
      cardsWrapper.innerHTML = "<p>Loja não logada</p>";
      return;
    }

    try {
      const token = localStorage.getItem("tokenLoja");
      if (!token) {
        cardsWrapper.innerHTML = "<p>Usuário não autenticado</p>";
        return;
      }

      const res = await fetch(`${API_URL}/produtos`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      const data = await res.json();
      produtos = (data.result || []).filter(p => p.id_loja === idLojaLogada);
      renderizarCards();
    } catch {
      cardsWrapper.innerHTML = "<p>Erro ao carregar produtos</p>";
    }
  }

  function formatarPreco(valor) {
    return parseFloat(valor || 0).toFixed(2).replace(".", ",");
  }

  function renderizarCards() {
    cardsWrapper.innerHTML = "";
    if (!produtos.length) {
      cardsWrapper.innerHTML = "<p>Nenhum produto encontrado.</p>";
      return;
    }

    produtos.forEach(produto => {
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
          <img src="${produto.midia?.imagens?.[0]?.path || produto.foto}" class="imagem-produto" />
          <div class="descricao">
            <h3>${produto.nome}</h3>
            <p>${limitarDescricao(produto.descricao || "")}</p>
          </div>
          <div class="footerNovidades">
            <div class="preco">
              <span class="icone-preco">R$</span>
              <span class="valor">${formatarPreco(produto.valor || produto.valor_uni || produto.preco)}</span>
            </div>
          </div>
        </div>
      `;

      const menuBtn = card.querySelector(".menu-btn");
      const menu = card.querySelector(".menu");

      menuBtn.addEventListener("click", e => {
        e.stopPropagation();
        document.querySelectorAll(".menu").forEach(m => { if (m !== menu) m.style.display = "none"; });
        menu.style.display = menu.style.display === "block" ? "none" : "block";
      });

      document.addEventListener("click", () => { menu.style.display = "none"; });

      card.querySelector(".editar-produto").onclick = () => abrirModalEdicao(produto);
      card.querySelector(".excluir-produto").onclick = () => excluirProduto(produto.id_produto);

      cardsWrapper.appendChild(card);
    });
  }
  
  async function abrirModalEdicao(produto = null) {
    const modal = document.getElementById("editModal");
    const backdrop = document.getElementById("modalBackdrop");
    const imgExibida = document.getElementById("imagemExibida");
    const buttonSave = document.querySelector(".button-save");
    buttonSave.disabled = false;
    buttonSave.innerHTML = "Salvar";

    let categorias = [];
    try {
      const res = await fetch(`${API_URL}/categorias`);
      const data = await res.json();
      categorias = data.result || [];
    } catch (err) {
      console.error("Erro ao carregar categorias:", err);
    }

    let categoriaId = null;
    if (produto?.categorias?.length) {
      const catNome = produto.categorias[0];
      const catEncontrada = categorias.find(c => c.nome === catNome);
      if (catEncontrada) categoriaId = catEncontrada.id_categoria;
    }

    const select = document.querySelector("#categoria");
    select.innerHTML = `<option value="" disabled ${!categoriaId ? "selected" : ""}>Selecione a categoria</option>`;
    categorias.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat.id_categoria;
      option.textContent = cat.nome;
      if (Number(cat.id_categoria) === Number(categoriaId)) option.selected = true;
      select.appendChild(option);
    });

    modal.showModal();
    backdrop.hidden = false;

    document.querySelector("#nome").value = produto?.nome || "";
    document.querySelector("#descricao").value = produto?.descricao || "";
    document.querySelector("#prazoInput").value = produto?.prazo || "";
    document.querySelector("#precoInput").value = produto?.valor || produto?.valor_uni || "";
    imgExibida.src = produto?.midia?.imagens?.[0]?.path || produto?.foto || "";
    imgExibida.style.display = imgExibida.src ? "block" : "none";

    atualizarTudo();

    let novaImagem = null;
    const fotoInput = document.querySelector("#foto");
    fotoInput.value = "";
    fotoInput.onchange = e => {
      novaImagem = e.target.files[0];
      const reader = new FileReader();
      reader.onload = ev => { imgExibida.src = ev.target.result; imgExibida.style.display = "block"; };
      reader.readAsDataURL(novaImagem);
    };

    buttonSave.onclick = async e => {
      e.preventDefault();
      if (buttonSave.disabled) return;

      buttonSave.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin btn-loading-icon"></i>
        <span class="btn-loading-text">Salvando...</span>
      `;
      buttonSave.disabled = true;

      const token = localStorage.getItem("tokenLoja");
      if (!token) return alert("Usuário não autenticado");

      const categoria = select.value;
      if (!categoria) return alert("Selecione uma categoria válida");

      const formData = new FormData();
      formData.append("nome", document.querySelector("#nome").value);
      formData.append("descricao", document.querySelector("#descricao").value);
      formData.append("prazo", document.querySelector("#prazoInput").value);

      let valor = parseFloat(document.querySelector("#precoInput").value) || 0;
      if (valor > 999.99) valor = 999.99;
      formData.append("valor", valor.toFixed(2));
      formData.append("categoria", categoria);
      formData.append("id_loja", idLojaLogada);

      if (novaImagem) formData.append("img", novaImagem);

      try {
        const resp = await fetch(`${API_URL}/produtos`, {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}` },
          body: formData
        });
        if (!resp.ok) throw new Error(await resp.text());

        await carregarProdutos();
        modal.close();
        backdrop.hidden = true;
      } catch (err) {
        alert("Erro ao criar produto: " + err.message);
        buttonSave.innerHTML = "Salvar";
        buttonSave.disabled = false;
      }
    };

    document.querySelector(".modal-close").onclick = () => { modal.close(); backdrop.hidden = true; };
    backdrop.onclick = () => { modal.close(); backdrop.hidden = true; };
  }

  async function excluirProduto(id_produto) {
    const token = localStorage.getItem("tokenLoja");
    if (!token) return alert("Usuário não autenticado");
    if (!confirm("Deseja excluir este produto?")) return;

    try {
      const resp = await fetch(`${API_URL}/produtos?id=${id_produto}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const text = await resp.text();
      if (!resp.ok) throw new Error(text || "Erro desconhecido");
      await carregarProdutos();
    } catch (err) {
      alert("Erro ao excluir produto: " + err.message);
    }
  }

  document.querySelector(".create-product-btn").onclick = () => abrirModalEdicao();

  function atualizarTudo() {
    updateCounter("#nome", "#nomeCounter", 21);
    updatePrazoCounter();
    updatePrecoCounter();
    document.querySelector("#nome").oninput = () => updateCounter("#nome", "#nomeCounter", 21);
    document.querySelector("#prazoInput").oninput = updatePrazoCounter;
    document.querySelector("#precoInput").oninput = updatePrecoCounter;
  }

  function updateCounter(inputSel, counterSel, maxLength) {
    const input = document.querySelector(inputSel);
    const counter = document.querySelector(counterSel);
    const len = input.value.length;
    counter.textContent = `${len} / ${maxLength}`;
    counter.classList.toggle("red", len > maxLength);
  }

  function updatePrazoCounter() {
    const prazo = document.querySelector("#prazoInput").value || "";
    document.querySelector("#prazoCounter").textContent = prazo;
  }

  function updatePrecoCounter() {
    const preco = parseFloat(document.querySelector("#precoInput").value) || 0;
    document.querySelector("#precoCounter").textContent = `R$ ${preco.toFixed(2)}`;
  }

  carregarProdutos();
});