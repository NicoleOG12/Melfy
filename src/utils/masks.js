/**
 * Utilitários de máscaras e formatação de dados cadastrais
 */

export function formatarCelular(v) {
  if (!v) return "";
  v = String(v).replace(/\D/g, "");
  v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
  v = v.replace(/(\d)(\d{4})$/, "$1-$2");
  return v.substring(0, 15);
}

export function formatarCPF(v) {
  if (!v) return "";
  v = String(v).replace(/\D/g, "");
  v = v.replace(/(\d{3})(\d)/, "$1.$2");
  v = v.replace(/(\d{3})(\d)/, "$1.$2");
  v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  return v.substring(0, 14);
}

/**
 * Apenas para exibição (também enquanto digita): oculta os 6 dígitos do meio.
 * 12345678909 -> 123.***.***-09
 */
export function ocultarCPF(v) {
  const digitos = String(v || "").replace(/\D/g, "").slice(0, 11);
  if (!digitos) return "";
  return digitos
    .replace(/\d/g, (c, i) => (i >= 3 && i <= 8 ? "*" : c))
    .replace(/([\d*]{3})([\d*])/, "$1.$2")
    .replace(/([\d*]{3})([\d*])/, "$1.$2")
    .replace(/([\d*]{3})([\d*]{1,2})$/, "$1-$2");
}

/**
 * Converte o que foi digitado no campo oculto de volta para o CPF real formatado.
 * - digitar no fim: acrescenta ao CPF real;
 * - apagar no fim: remove do CPF real;
 * - qualquer outra edição (meio, colar): usa só os dígitos digitados, sem os "*".
 */
export function lerCPFOculto(cpfAtual, digitado) {
  const atual = String(cpfAtual || "").replace(/\D/g, "");
  const exibido = ocultarCPF(atual).replace(/[^\d*]/g, "");
  const bruto = String(digitado || "").replace(/[^\d*]/g, "");

  if (bruto.startsWith(exibido)) return formatarCPF((atual + bruto.slice(exibido.length)).slice(0, 11));
  if (exibido.startsWith(bruto)) return formatarCPF(atual.slice(0, bruto.length));
  return formatarCPF(bruto.replace(/\*/g, ""));
}

export function formatarCEP(v) {
  if (!v) return "";
  v = String(v).replace(/\D/g, "");
  if (v.length > 5) v = v.replace(/^(\d{5})(\d)/, "$1-$2");
  return v.substring(0, 9);
}

export function formatarCartao(v) {
  if (!v) return "";
  v = String(v).replace(/\D/g, "");
  return v.replace(/(\d{4})(?=\d)/g, "$1 ").trim().substring(0, 19);
}

export function formatarValidade(v) {
  if (!v) return "";
  v = String(v).replace(/\D/g, "");
  if (v.length > 2) v = v.replace(/^(\d{2})(\d)/, "$1/$2");
  return v.substring(0, 5);
}

export function dataISO(dataStr) {
  if (!dataStr) return "";
  if (typeof dataStr === "string" && dataStr.includes("/") && dataStr.length === 10) {
    return dataStr;
  }
  const data = new Date(dataStr);
  if (isNaN(data.getTime())) return String(dataStr);
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
}
