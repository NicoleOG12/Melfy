import { rotasCliente } from "../rotas.js";
import { openModal, adicionarNaSacola } from "../modal.js";

document.addEventListener("DOMContentLoaded", async function () {
  function verificarParametroPagamento() {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("payment");

    if (status === "error") {
      alert("Seu pagamento não foi concluído");
    } else if (status === "success" || status === "sucess") {
      alert("Your payment is being processed");
    }
  }

  const API_URL = "http://localhost:38791";

  verificarParametroPagamento();

  const cardsWrapper = document.querySelector(".cards-wrapper");
  const inputPesquisa = document.getElementById("search-input");
  const botaoPesquisa = document.getElementById("search-button");

  let produtos = [];
  let lojas = [];

  try {
    const resProdutos = await fetch(`${API_URL}/produtos`);
    const dataProdutos = await resProdutos.json();
    produtos = dataProdutos.result || [];

    const resLojas = await fetch(`${API_URL}/lojas/fetchAll`);
    const dataLojas = await resLojas.json();
    lojas = dataLojas.result || [];
  } catch (erro) {
    console.error("Erro ao carregar API:", erro);
  }

  function embaralhar(lista) {
    return lista
      .map((x) => ({ x, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map((obj) => obj.x);
  }

  produtos.sort((a, b) => new Date(a.datahora) - new Date(b.datahora));
  const maisAntigos = produtos.slice(0, 45);
  const restantes = produtos.slice(45);
  const antigosAleatorios = embaralhar(maisAntigos);
  restantes.sort((a, b) => new Date(b.datahora) - new Date(a.datahora));
  const produtosOrdenados = [...antigosAleatorios, ...restantes];

  function limitarDescricao(texto, limite = 45) {
    if (!texto) return "";
    const clean = texto.normalize("NFC");
    const arr = [...clean];
    const textoCortado = arr.slice(0, limite).join("");
    return arr.length > limite
      ? `${textoCortado}... <strong>ver mais</strong>`
      : texto;
  }

  function formatarPreco(valor) {
    return parseFloat(valor).toFixed(2).replace(".", ",");
  }

  function normalizar(texto) {
    return (texto || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function filtrarProdutos(lista, termoInput) {
    const termo = normalizar(termoInput).trim();
    if (!termo) return lista;

    const palavras = termo.split(" ");

    return lista.filter((produto) => {
      const texto = normalizar(
        (produto.nome || "") + " " + (produto.descricao || ""),
      );

      return palavras.every((p) => texto.includes(p));
    });
  }

  function renderizarProdutos(listaProdutos) {
    cardsWrapper.innerHTML = "";
    if (listaProdutos.length === 0) {
      cardsWrapper.innerHTML = "<p>Nenhum produto encontrado.</p>";
      return;
    }

    [...listaProdutos].reverse().forEach((produto) => {
      const loja = {
        id: produto.id_loja,
        nome: produto.nome_loja,
        pfp: produto.pfp_loja,
      };

      const card = document.createElement("div");
      card.classList.add("card");

      card.innerHTML = `
        <div class="headerNovidade">
          <img src="${loja?.pfp || ""}" alt="Logo da Loja" class="logoLoja" id="logoLoja${loja.id}"/>
        </div>
        <div class="border-card">
          <img src="${produto.imagens[0] || produto.foto}" alt="${produto.nome}" class="imagem-produto" />
          <div class="descricao">
            <h3>${produto.nome}</h3>
            <p>${limitarDescricao(produto.descricao || produto.subtitulo || "")}</p>
          </div>
          <div class="footerNovidades">
            <div class="preco">
              <span class="icone-preco">R$</span>
              <span class="valor">${formatarPreco(produto.valor_uni || produto.preco)}</span>
            </div>
          </div>
          <button class="btn-carrinho add-carrinho-btn" data-id=${produto._id}>
            <span>Adicionar ao carrinho</span>
            <i class="fas fa-shopping-bag"></i>
          </button>
        </div>
      `;

      card
        .querySelector("#logoLoja" + loja.id)
        .addEventListener("click", (e) => {
          e.stopPropagation();
          window.location.href = `${rotasCliente.loja}?id=${loja.id}`;
        });

      card.addEventListener("click", (e) => {
        if (!e.target.closest(".headerNovidade"))
          console.log("Abrindo modal para produto:", produto);
        openModal(produto, lojas, rotasCliente);
      });

      cardsWrapper.appendChild(card);
    });
  }

  function scrollSuaveComOffset(element, offset = 120) {
    const y = element.getBoundingClientRect().top + window.pageYOffset - offset;

    window.scrollTo({
      top: y,
      behavior: "smooth",
    });
  }

  function executarBusca() {
    const resultado = filtrarProdutos(produtosOrdenados, inputPesquisa.value);
    renderizarProdutos(resultado);
    scrollSuaveComOffset(cardsWrapper);
  }

  renderizarProdutos(produtosOrdenados);

  inputPesquisa.addEventListener("keyup", (e) => {
    if (e.key === "Enter") executarBusca();
  });

  botaoPesquisa.addEventListener("click", executarBusca);

  document.querySelectorAll(".categoria, .doce").forEach((item) => {
    item.addEventListener("click", () => {
      const categoria = item.querySelector("p").textContent.trim();
      const resultado = filtrarProdutos(produtosOrdenados, categoria);
      renderizarProdutos(resultado);
      scrollSuaveComOffset(cardsWrapper);
    });
  });

  document
    .querySelector(".btn-add")
    .addEventListener("click", adicionarNaSacola);

  const container = document.getElementById("lojas-container");
  const slider = document.querySelector(".lojas-scroll");
  container.innerHTML = "";

  [...lojas].reverse().forEach((loja) => {
    const card = document.createElement("div");
    card.classList.add("loja-card");

    card.innerHTML = `
      <img src="${loja.pfp || loja.fotoPerfil}" 
           alt="${loja.nomeLoja || loja.loja_nome || loja.nome}" 
           class="logo-loja">
      <div class="info-loja">
        <h3>${loja.nomeLoja || loja.loja_nome || loja.nome}</h3>
        <p>${loja.descricao || "Confeitaria artesanal"}</p>
        <button class="btn-loja">Ver loja</button>
      </div>
    `;

    card.querySelector(".btn-loja").addEventListener("click", () => {
      window.location.href = `${rotasCliente.loja}?id=${loja.idLoja || loja.id_loja}`;
    });

    container.appendChild(card);
  });

  let isDown = false,
    startX,
    scrollLeft;

  slider.addEventListener("mousedown", (e) => {
    isDown = true;
    slider.classList.add("active");
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });

  slider.addEventListener("mouseleave", () => {
    isDown = false;
    slider.classList.remove("active");
  });

  slider.addEventListener("mouseup", () => {
    isDown = false;
    slider.classList.remove("active");
  });

  slider.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2;
    slider.scrollLeft = scrollLeft - walk;
  });

  slider.addEventListener("touchstart", (e) => {
    isDown = true;
    startX = e.touches[0].pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });

  slider.addEventListener("touchend", () => {
    isDown = false;
  });

  slider.addEventListener("touchmove", (e) => {
    if (!isDown) return;
    const x = e.touches[0].pageX - slider.offsetLeft;
    const walk = (x - startX) * 2;
    slider.scrollLeft = scrollLeft - walk;
  });

  document
    .querySelectorAll(".categoria-click-event-listener")
    .forEach((cat) => {
      cat.addEventListener("click", async () => {
        const id = cat.dataset.id;

        try {
          const resp = await fetch(`${API_URL}/produtos?categoria=${id}`);
          if (resp.status === 204) {
            renderizarProdutos([]);
            return;
          }

          const dataCat = await resp.json();
          const produtosCat = Array.isArray(dataCat.result)
            ? dataCat.result
            : [];
          renderizarProdutos(produtosCat);
          scrollSuaveComOffset(cardsWrapper);
        } catch (error) {
          console.error("Erro ao buscar produtos:", error);
        }
      });
    });

  const botaoVerTodos = document.getElementById("ver-todos");
  botaoVerTodos.addEventListener("click", () => {
    renderizarProdutos(produtosOrdenados);
    scrollSuaveComOffset(cardsWrapper);
  });
});
