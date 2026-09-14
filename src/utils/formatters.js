/**
 * Formata um valor numérico para preço no padrão brasileiro.
 * Ex: 12.5 → "12,50"
 */
export function formatarPreco(valor) {
  return parseFloat(valor || 0)
    .toFixed(2)
    .replace(".", ",");
}

export function getOfertaAtiva(produto) {
  const ofertas = Array.isArray(produto?.ofertas) ? produto.ofertas : [];

  if (!ofertas.length) return null;

  const agora = Date.now();

  const ofertaAtiva = ofertas.find((oferta) => {
    if (oferta?.ativo === false) return false;

    const inicio = oferta?.data_inicio || oferta?.dataInicio;
    const fim = oferta?.data_fim || oferta?.dataFim;

    if (inicio && new Date(inicio).getTime() > agora) return false;
    if (fim && new Date(fim).getTime() < agora) return false;

    return true;
  });

  return ofertaAtiva || ofertas[0] || null;
}

export function getPrecoProduto(produto) {
  const oferta = getOfertaAtiva(produto);
  const precoBase = Number(
    produto?.valor_uni ?? produto?.preco ?? produto?.valor ?? 0,
  );
  const precoOferta = Number(
    oferta?.valor_oferta ??
      oferta?.valor ??
      oferta?.preco_oferta ??
      oferta?.preco ??
      oferta?.precoPromocional ??
      0,
  );

  const temOferta =
    !!oferta && precoOferta > 0 && (!precoBase || precoOferta < precoBase);

  return {
    oferta,
    temOferta,
    precoBase,
    precoOferta: temOferta ? precoOferta : precoBase,
  };
}

/**
 * Trunca um texto em `limite` caracteres, preservando emojis e acentos.
 */
export function limitarDescricao(texto, limite = 45) {
  if (!texto) return "";
  const arr = [...texto.normalize("NFC")];
  if (arr.length <= limite) return texto;
  return arr.slice(0, limite).join("") + "... <strong>ver mais</strong>";
}

/**
 * Normaliza texto para comparação: lowercase + sem acentos.
 */
export function normalizar(texto) {
  return (texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
