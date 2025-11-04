//---------------------------------------------- FETCH PRODUTOS -----------------------------------------

async function fetchProdutos(params = "") {
  try {
    // Permite busca por ?busca=, ?loja=, ?categoria= etc.
    const res = await fetch(
      `https://melfy-backend-production.up.railway.app/produtos${params}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error("Erro ao buscar produtos: " + res.status);
    }

    const data = await res.json();
    console.log("Produtos recebidos:", data.result);

    const carouselTrack = document.getElementById("carousel-track");
    const productsGrid = document.getElementById("products-grid");

    // Limpar containers
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

    // Função para renderizar um card de produto (usada no carrossel e na grid)
    function criarCardProduto(produto) {
      const categorias = produto.categorias
        ? produto.categorias.join(", ")
        : "";
      const imagem =
        produto.midia?.imagens?.[0]?.path ||
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=80";

      return `
        <div class="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2 relative group product-card">
          <div class="relative overflow-hidden card-content">
            <img src="${imagem}"
                alt="${produto.nome}"
                class="w-full object-cover transition-transform duration-500 group-hover:scale-105 product-image">
            <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50"></div>
            <div class="absolute bottom-4 left-4">
              <span class="bg-mellow-yellow-400 text-cosy-brown-700 px-3 py-1 rounded-full text-sm font-bold">${categorias || "Doces"}</span>
            </div>
            <button class="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center text-cosy-brown-700 shadow-md hover:bg-mellow-yellow-400 transition-colors heart-beat">
              <i class="fas fa-heart"></i>
            </button>
          </div>
          <div class="p-4 card-content">
            <h3 class="text-lg font-bold mb-2 text-cosy-brown-700 line-clamp-2">${produto.nome}</h3>
            <p class="text-cosy-brown-600 mb-3 text-sm line-clamp-2">${produto.descricao || "Delicioso doce artesanal feito com carinho."}</p>
            <div class="flex items-center mb-3">
              <div class="flex text-mellow-yellow-500 mr-2">
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star-half-alt"></i>
              </div>
              <span class="text-sm text-cosy-brown-600">(${Math.floor(Math.random() * 50) + 10} avaliações)</span>
            </div>
            <div class="flex justify-between items-center mb-4">
              <span class="text-xl font-bold text-cosy-brown-700">R$ ${produto.valor_uni || "45,00"}</span>
              <div class="flex items-center">
                <img src="https://randomuser.me/api/portraits/women/${
                  Math.floor(Math.random() * 90) + 10
                }.jpg" alt="Confeiteira" class="w-6 h-6 rounded-full border-2 border-mellow-yellow-400">
                <span class="ml-2 text-xs">${produto.nome_confeiteira || "Confeiteira"}</span>
              </div>
            </div>
          </div>
          <div class="p-4 pt-0 card-button">
            <button class="w-full py-2 bg-cosy-brown-600 hover:bg-cosy-brown-700 text-white rounded-lg font-bold transition-colors flex items-center justify-center btn-add-carrinho" data-id="${produto.id_produto}">
              <i class="fas fa-shopping-bag mr-2"></i> Adicionar ao carrinho
            </button>
          </div>
        </div>
      `;
    }

    // Renderizar produtos no carrossel (mobile)
    produtosLimitados.forEach((produto) => {
      const slide = document.createElement("div");
      slide.classList.add("carousel-slide");
      slide.innerHTML = criarCardProduto(produto);
      carouselTrack.appendChild(slide);
    });

    // Renderizar produtos na grid (desktop)
    produtosLimitados.forEach((produto) => {
      const card = document.createElement("div");
      card.innerHTML = criarCardProduto(produto);
      productsGrid.appendChild(card);
    });

    // Eventos de adicionar ao carrinho
    document.querySelectorAll(".btn-add-carrinho").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const idProduto = e.currentTarget.getAttribute("data-id");
        await adicionarAoCarrinho(idProduto);
      });
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
      "https://melfy-backend-production.up.railway.app/lojas",
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
            <img src="https://images.unsplash.com/photo-1608198093002-ad4e005484b7?auto=format&fit=crop&w=800&q=80" 
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

async function adicionarAoCarrinho(idProduto) {
  console.log("Adicionando produto ao carrinho:", idProduto);

  try {
    const res = await fetch(
      "https://melfy-backend-production.up.railway.app/carrinho?id=" +
        idProduto,
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
      alert(data.message || "Produto adicionado ao carrinho!");
    } else {
      alert("Para adicionar produtos ao carrinho, faça login primeiro.");
    }
  } catch (erro) {
    console.error("Erro em adicionarAoCarrinho:", erro);
    alert("Faça login para adicionar produtos ao carrinho.");
  }
}

//---------------------------------------------- INICIALIZAÇÃO -----------------------------------------

document.addEventListener("DOMContentLoaded", function () {
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
