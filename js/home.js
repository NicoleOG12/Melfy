import { openModal, adicionarNaSacola } from "./modal.js";

const API_URL = "https://melfy-backend-production.up.railway.app";
const baseURL = window.location.origin + "/";

const rotasCliente = {
  carrinho: `${baseURL}pages/cliente/carrinho.html`,
  doces: `${baseURL}pages/cliente/doces.html`,
  loja: `${baseURL}pages/cliente/loja.html`,
  pedidos: `${baseURL}pages/cliente/pedidos.html`,
  perfil: `${baseURL}pages/cliente/perfil.html`,
};

let lojas = [];

//---------------------------------------------- HELPERS -----------------------------------------

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

//---------------------------------------------- FETCH PRODUTOS -----------------------------------------

async function fetchProdutos(params = "") {
  try {
    // Buscar lojas primeiro (necessário para o modal)
    try {
      const resLojas = await fetch(`${API_URL}/lojas/fetchAll`);
      const dataLojas = await resLojas.json();
      lojas = dataLojas.result || [];
    } catch (e) {
      console.error("Erro ao buscar lojas:", e);
    }

    const res = await fetch(`${API_URL}/produtos${params}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Erro ao buscar produtos: " + res.status);
    }

    const data = await res.json();
    console.log("Produtos recebidos:", data.result);

    const carouselTrack = document.getElementById("carousel-track");
    const productsGrid = document.getElementById("products-grid");

    carouselTrack.innerHTML = "";
    productsGrid.innerHTML = "";

    if (!data.result || data.result.length === 0) {
      carouselTrack.innerHTML =
        "<p class='text-center w-full py-8'>Nenhum produto encontrado.</p>";
      productsGrid.innerHTML =
        "<p class='text-center col-span-full py-8'>Nenhum produto encontrado.</p>";
      return;
    }

    // LIMITAR A 4 PRODUTOS
    const produtosLimitados = data.result.slice(0, 4);

  // Função para criar um card de produto idêntico ao da seção de doces
  function criarCardProduto(produto, container) {
    const loja = {
      id: produto.id_loja,
      nome: produto.loja_nome,
      pfp: produto.pfp,
    };

    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <div class="headerNovidade">
        <img src="${loja?.pfp || ""}" alt="Logo da Loja" class="logoLoja" id="logoLoja-home-${produto.id_produto}-${container}"/>
      </div>
      <div class="border-card">
        <img src="${produto.midia?.imagens?.[0]?.path || produto.foto || ""}" alt="${produto.nome}" class="imagem-produto" />
        <div class="descricao">
          <h3>${produto.nome}</h3>
          <p>${limitarDescricao(produto.descricao || produto.subtitulo || "")}</p>
        </div>
        <div class="footerNovidades">
          <div class="preco">
            <span class="icone-preco">R$</span>
            <span class="valor">${formatarPreco(produto.valor_uni || produto.preco || 0)}</span>
          </div>
        </div>
        <button class="btn-carrinho add-carrinho-btn" data-id="${produto.id_produto}">
          <span>Adicionar ao carrinho</span>
          <i class="fas fa-shopping-bag"></i>
        </button>
      </div>
    `;

    // Clicar na logo da loja redireciona para a página da loja
    const logoEl = card.querySelector(`#logoLoja-home-${produto.id_produto}-${container}`);
    if (logoEl) {
      logoEl.addEventListener("click", (e) => {
        e.stopPropagation();
        window.location.href = `${rotasCliente.loja}?id=${loja.id}`;
      });
    }

    // Clicar no card abre o modal (igual à seção de doces)
    card.addEventListener("click", (e) => {
      if (!e.target.closest(".headerNovidade") && !e.target.closest(".btn-carrinho")) {
        openModal(produto, lojas, rotasCliente);
      }
    });

    // Botão adicionar ao carrinho
    const btnCarrinho = card.querySelector(".add-carrinho-btn");
    if (btnCarrinho) {
      btnCarrinho.addEventListener("click", (e) => {
        e.stopPropagation();
        adicionarAoCarrinhoHome(produto.id_produto);
      });
    }

    return card;
  }

  // Renderizar produtos no carrossel (mobile)
  produtosLimitados.forEach((produto) => {
    const slide = document.createElement("div");
    slide.classList.add("carousel-slide");
    slide.appendChild(criarCardProduto(produto, "carousel"));
    carouselTrack.appendChild(slide);
  });

  // Renderizar produtos na grid (desktop)
  produtosLimitados.forEach((produto) => {
    productsGrid.appendChild(criarCardProduto(produto, "grid"));
  });

    console.log(
      "Produtos carregados com sucesso!",
      produtosLimitados.length,
      "itens exibidos."
    );
  } catch (erro) {
    console.error("Erro no fetchProdutos:", erro);

    const carouselTrack = document.getElementById("carousel-track");
    const productsGrid = document.getElementById("products-grid");

    carouselTrack.innerHTML =
      "<p class='text-center w-full py-8'>Erro ao carregar produtos. Tente novamente mais tarde.</p>";
    productsGrid.innerHTML =
      "<p class='text-center col-span-full py-8'>Erro ao carregar produtos. Tente novamente mais tarde.</p>";
  }
}

//---------------------------------------------- FETCH CONFEITARIAS -----------------------------------------

async function fetchConfeitarias() {
  try {
    const res = await fetch(
      `${API_URL}/lojas/fetchAll`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error("Erro ao buscar confeitarias: " + res.status);
    }

    const data = await res.json();
    console.log("Confeitarias recebidas:", data.result);

    const bakersGrid = document.getElementById("bakers-grid");
    bakersGrid.innerHTML = "";

    if (!data.result || data.result.length === 0) {
      bakersGrid.innerHTML =
        "<p class='text-center col-span-full py-8'>Nenhuma confeitaria encontrada.</p>";
      return;
    }

    const confeitariasLimitadas = data.result.slice(0, 3);

    confeitariasLimitadas.forEach((loja) => {
      const bakerCard = document.createElement("div");
      bakerCard.innerHTML = `
        <div class="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full">
          <div class="relative h-48 overflow-hidden">
            <img src="${loja.pfp}" 
                 alt="${loja.nome}" class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div class="absolute bottom-4 left-4 text-white">
              <h3 class="text-xl font-bold">${loja.nome}</h3>
              <div class="flex items-center mt-1">
                <i class="fas fa-star text-mellow-yellow-400 mr-1"></i>
                <span>4.${Math.floor(Math.random() * 9)} (${
        Math.floor(Math.random() * 100) + 50
      } avaliações)</span>
              </div>
            </div>
          </div>
          <div class="p-6 flex flex-col flex-grow">
            <p class="text-cosy-brown-600 mb-6 flex-grow">
              ${
                loja.descricao ||
                "Confeitaria artesanal especializada em doces finos e personalizados."
              }
            </p>
            <div class="flex justify-between items-center mt-auto">
              <span class="text-cosy-brown-700 font-bold">${
                loja.cidade || "São Paulo"
              }, ${loja.estado || "SP"}</span>
              <a href="#" class="px-4 py-2 bg-mellow-yellow-400 hover:bg-mellow-yellow-500 text-cosy-brown-700 rounded-full font-bold text-sm transition-colors flex items-center">
                Ver doces <i class="fas fa-arrow-right ml-1"></i>
              </a>
            </div>
          </div>
        </div>
      `;
      bakersGrid.appendChild(bakerCard);
    });

    console.log(
      "Confeitarias carregadas com sucesso!",
      confeitariasLimitadas.length
    );
  } catch (erro) {
    console.error("Erro no fetchConfeitarias:", erro);
    document.getElementById("bakers-grid").innerHTML =
      "<p class='text-center py-8'>Erro ao carregar confeitarias. Tente novamente mais tarde.</p>";
  }
}

//---------------------------------------------- ADICIONAR AO CARRINHO -----------------------------------------

async function adicionarAoCarrinhoHome(idProduto) {
  console.log("Adicionando produto ao carrinho:", idProduto);

  try {
    const res = await fetch(
      `${API_URL}/carrinho?id=${idProduto}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("tokenCliente"),
        },
        body: JSON.stringify({ qtd: 1 }),
      }
    );

    const data = await res.json();
    console.log(data);

    if (res.ok) {
      alertSuccess(data.message || "Produto adicionado ao carrinho!");
    } else {
      alertWarning("Para adicionar produtos ao carrinho, faça login primeiro.");
    }
  } catch (erro) {
    console.error("Erro em adicionarAoCarrinho:", erro);
    alertWarning("Faça login para adicionar produtos ao carrinho.");
  }
}

//---------------------------------------------- INICIALIZAÇÃO -----------------------------------------

document.addEventListener("DOMContentLoaded", function () {
  // Configurar botão adicionar do modal
  const btnAdd = document.querySelector(".btn-add");
  if (btnAdd) {
    btnAdd.addEventListener("click", adicionarNaSacola);
  }

  fetchProdutos();
  fetchConfeitarias();

  // Arrastar carrossel (desktop e mobile)
  const carousel = document.getElementById("products-carousel");
  let isDown = false;
  let startX;
  let scrollLeft;

  if (carousel) {
    carousel.addEventListener("mousedown", (e) => {
      isDown = true;
      startX = e.pageX - carousel.offsetLeft;
      scrollLeft = carousel.scrollLeft;
    });

    carousel.addEventListener("mouseleave", () => (isDown = false));
    carousel.addEventListener("mouseup", () => (isDown = false));
    carousel.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - carousel.offsetLeft;
      const walk = (x - startX) * 2;
      carousel.scrollLeft = scrollLeft - walk;
    });

    // Suporte a toque (mobile)
    carousel.addEventListener("touchstart", (e) => {
      isDown = true;
      startX = e.touches[0].pageX - carousel.offsetLeft;
      scrollLeft = carousel.scrollLeft;
    });
    carousel.addEventListener("touchend", () => (isDown = false));
    carousel.addEventListener("touchmove", (e) => {
      if (!isDown) return;
      const x = e.touches[0].pageX - carousel.offsetLeft;
      const walk = (x - startX) * 2;
      carousel.scrollLeft = scrollLeft - walk;
    });
  }
});
