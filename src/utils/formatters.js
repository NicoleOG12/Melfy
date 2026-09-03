/**
 * Formata um valor numérico para preço no padrão brasileiro.
 * Ex: 12.5 → "12,50"
 */
export function formatarPreco(valor) {
  return parseFloat(valor || 0).toFixed(2).replace(".", ",");
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
