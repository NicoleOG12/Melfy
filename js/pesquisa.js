export function removerAcentos(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function filtrarProdutos(produtos, inputElement, renderizarProdutosCallback, cardsWrapper) {
  const termo = removerAcentos(inputElement.value.trim().toLowerCase());
  cardsWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
  if (!termo) return renderizarProdutosCallback(produtos);

  const filtrados = produtos.filter(p => {
    const nome = removerAcentos(p.nome.toLowerCase());
    const sub = removerAcentos(p.subtitulo.toLowerCase());
    const cat = removerAcentos((p.categoria || '').toLowerCase());
    return nome.includes(termo) || sub.includes(termo) || cat.includes(termo);
  });

  renderizarProdutosCallback(filtrados);
}
