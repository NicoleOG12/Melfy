const API_URL = "http://localhost:38791";

export function removerAcentos(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export async function filtrarProdutos(
  produtos,
  inputElement,
  renderizarProdutosCallback,
  cardsWrapper,
  rolar = false,
) {
  const termo = removerAcentos(inputElement.value.trim().toLowerCase());

  if (!termo) {
    renderizarProdutosCallback(produtos);
    if (rolar) {
      const offset = 120;
      const topPos =
        cardsWrapper.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: topPos, behavior: "smooth" });
    }
    return;
  }

  try {
    const resposta = await fetch(
      `${API_URL}/produtos?search=${encodeURIComponent(termo)}`,
    );
    if (!resposta.ok) throw new Error("Erro ao buscar produtos na API");
    const data = await resposta.json();
    let produtosFiltrados = Array.isArray(data.result) ? data.result : [];

    produtosFiltrados = produtosFiltrados.filter((p) => {
      const nome = removerAcentos((p.nome || "").toLowerCase());
      const sub = removerAcentos((p.subtitulo || "").toLowerCase());
      const cat = removerAcentos((p.categoria || "").toLowerCase());
      return nome.includes(termo) || sub.includes(termo) || cat.includes(termo);
    });

    renderizarProdutosCallback(produtosFiltrados);
    if (rolar) {
      const offset = 120;
      const topPos =
        cardsWrapper.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: topPos, behavior: "smooth" });
    }
  } catch (erro) {
    console.error("Erro na pesquisa:", erro);
    const filtrados = produtos.filter((p) => {
      const nome = removerAcentos((p.nome || "").toLowerCase());
      const sub = removerAcentos((p.subtitulo || "").toLowerCase());
      const cat = removerAcentos((p.categoria || "").toLowerCase());
      return nome.includes(termo) || sub.includes(termo) || cat.includes(termo);
    });
    renderizarProdutosCallback(filtrados);
    if (rolar) {
      const offset = 120;
      const topPos =
        cardsWrapper.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: topPos, behavior: "smooth" });
    }
  }
}
