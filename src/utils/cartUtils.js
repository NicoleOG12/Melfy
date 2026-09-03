export function formatarPreco(valor) {
  return Number.parseFloat(valor || 0).toFixed(2).replace(".", ",");
}

export function limitarDescricao(texto, limite = 45) {
  if (!texto) return "";
  const arr = [...String(texto).normalize("NFC")];
  return arr.length > limite
    ? `${arr.slice(0, limite).join("")}... <strong>ver mais</strong>`
    : String(texto);
}

export function imagemProduto(produto) {
  return produto?.imagem || produto?.midia?.imagens?.[0]?.path || produto?.foto || "";
}

export function imagemLoja(loja, produto) {
  return (
    loja?.pfp ||
    loja?.logoLoja ||
    loja?.logo_loja ||
    produto?.pfp ||
    produto?.logoLoja ||
    produto?.logo_loja ||
    ""
  );
}
