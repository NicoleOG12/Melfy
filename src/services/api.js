import { API_URL } from "../constants/api";

async function parseResponse(res) {
  const text = await res.text();
  let data = {};
  try { data = text ? JSON.parse(text) : {}; } catch { data = {}; }
  if (!res.ok) throw new Error(data.message || data.mensagem || `Erro ${res.status} na API`);
  return data;
}

export async function fetchProdutos() {
  const res = await fetch(`${API_URL}/produtos`);
  const data = await parseResponse(res);
  return Array.isArray(data.result) ? data.result : [];
}

export async function fetchLojas() {
  const res = await fetch(`${API_URL}/lojas/fetchAll`);
  const data = await parseResponse(res);
  return Array.isArray(data.result) ? data.result : [];
}

export async function fetchLoja(id) {
  const lojas = await fetchLojas();
  return lojas.find((l) => String(l.id_loja ?? l.idLoja) === String(id)) ?? null;
}

export async function fetchProdutosPorLoja(idLoja) {
  const todos = await fetchProdutos();
  return todos.filter(
    (p) => String(p.id_loja ?? p.idLoja) === String(idLoja)
  );
}

export async function fetchCarrinho(token) {
  const res = await fetch(`${API_URL}/carrinho`, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });
  if (!res.ok) return [];
  const data = await parseResponse(res);
  return Array.isArray(data.result) ? data.result : Array.isArray(data.items) ? data.items : [];
}

export async function adicionarAoCarrinho(idProduto, qtd = 1) {
  const token = localStorage.getItem("tokenCliente");
  if (!token) throw new Error("não autenticado");
  const res = await fetch(`${API_URL}/carrinho?id=${idProduto}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ qtd }),
  });
  const data = await parseResponse(res);
  window.dispatchEvent(new Event("carrinhoAtualizado"));
  return data;
}

export async function removerDoCarrinho(idProduto, qtd) {
  const token = localStorage.getItem("tokenCliente");
  if (!token) throw new Error("não autenticado");
  const res = await fetch(`${API_URL}/carrinho?id=${idProduto}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ qtd }),
  });
  const data = await parseResponse(res);
  window.dispatchEvent(new Event("carrinhoAtualizado"));
  return data;
}

export async function criarPedido(pedido) {
  const token = localStorage.getItem("tokenCliente");
  if (!token) throw new Error("não autenticado");
  const res = await fetch(`${API_URL}/pedidos`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(pedido),
  });
  const data = await parseResponse(res);
  window.dispatchEvent(new Event("carrinhoAtualizado"));
  return data;
}

function collectOrderArrays(value, found = []) {
  if (!value || typeof value !== "object") return found;
  if (Array.isArray(value)) {
    if (value.some((item) => item && typeof item === "object" && (
      "id_pedido" in item || "idPedido" in item || "status" in item || "id_status" in item || "datahora" in item || "dataPedido" in item
    ))) found.push(...value);
    value.forEach((item) => collectOrderArrays(item, found));
    return found;
  }
  Object.values(value).forEach((item) => collectOrderArrays(item, found));
  return found;
}

export async function fetchPedidos(token = localStorage.getItem("tokenCliente")) {
  if (!token) throw new Error("Você precisa estar logado para consultar seus pedidos.");
  const res = await fetch(`${API_URL}/pedidos`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    cache: "no-store",
  });
  const data = await parseResponse(res);

  const candidates = collectOrderArrays(data);
  if (candidates.length) {
    const seen = new Set();
    return candidates.filter((pedido) => {
      const id = pedido?.id_pedido ?? pedido?.idPedido ?? pedido?.id ?? JSON.stringify(pedido);
      if (seen.has(String(id))) return false;
      seen.add(String(id));
      return true;
    });
  }

  const result = data.result ?? data.pedidos ?? data.orders ?? data.data;
  if (Array.isArray(result)) return result;
  if (result && typeof result === "object") return Object.values(result).filter((v) => v && typeof v === "object");
  return [];
}
