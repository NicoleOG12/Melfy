import { API_URL } from "../constants/api";

async function parseResponse(res) {
  const text = await res.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
    console.log(data);
  } catch {
    data = {};
  }
  if (!res.ok)
    throw new Error(
      data.message || data.mensagem || `Erro ${res.status} na API`,
    );

  return data;
}

let cacheProdutos = null;
let cacheLojas = null;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos

function normalizeUserPayload(payload) {
  if (!payload) return null;

  const user = Array.isArray(payload)
    ? payload[0]
    : payload.user || payload.data?.user || payload.data || payload;

  if (!user || typeof user !== "object") return null;

  return {
    ...user,
    nome: user.nome || user.name || "",
    email: user.email || "",
    cpf: user.cpf || "",
    telefone: user.telefone || user.celular || "",
    celular: user.celular || user.telefone || "",
    data_nasc: user.data_nasc || user.dataNascimento || "",
    dataNascimento: user.dataNascimento || user.data_nasc || "",
    foto: user.foto || user.pfp || user.imagem || user.avatar || "",
    pfp: user.pfp || user.foto || user.imagem || user.avatar || "",
  };
}

export async function fetchProdutos(forceRefresh = false) {
  if (!forceRefresh && cacheProdutos) return cacheProdutos;

  const res = await fetch(`${API_URL}/products`);
  const data = await parseResponse(res);
  const items = Array.isArray(data?.data?.items) ? data.data.items : [];
  cacheProdutos = items;
  return items;
}

export async function fetchLojas(forceRefresh = false) {
  if (!forceRefresh && cacheLojas) return cacheLojas;

  const res = await fetch(`${API_URL}/stores/`);
  const data = await parseResponse(res);
  const stores = Array.isArray(data?.data?.store) ? data.data.store : [];
  cacheLojas = stores;
  return stores;
}

export async function fetchLoja(id) {
  try {
    const res = await fetch(`${API_URL}/stores/${id}`);
    if (res.ok) {
      const data = await parseResponse(res);
      console.log(data);
      if (data?.data) {
        return data.data;
      }
    }
  } catch (err) {
    console.warn("Falha ao buscar detalhes da loja na API:", err);
  }

  const lojas = await fetchLojas();
  const found = lojas.find((l) => String(l.id_loja ?? l.idLoja) === String(id));
  return found
    ? { store: found, produtos: [], rating: { media: 0, total_avaliacoes: 0 } }
    : null;
}

export async function fetchProdutosPorLoja(idLoja) {
  const todos = await fetchProdutos();
  return todos.filter((p) => String(p.id_loja ?? p.idLoja) === String(idLoja));
}

export async function fetchCarrinho(token) {
  const res = await fetch(`${API_URL}/orders/cart`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) return [];
  const data = await parseResponse(res);
  //console.log("CARRINHO", data);
  return Array.isArray(data.data) ? data.data : [];
}

export async function fetchUsuarioMe() {
  const token = localStorage.getItem("tokenCliente");

  if (!token) {
    throw new Error("Usuário não autenticado");
  }

  const res = await fetch(`${API_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await parseResponse(res);
  const user = normalizeUserPayload(data);

  if (!user) {
    throw new Error("Não foi possível carregar o perfil do usuário.");
  }

  return user;
}

export async function adicionarAoCarrinho(id_produto, quantidade = 1) {
  const token = localStorage.getItem("tokenCliente");

  if (!token) throw new Error("não autenticado");
  const res = await fetch(`${API_URL}/orders/cart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id_produto, quantidade }),
  });
  const data = await parseResponse(res);
  window.dispatchEvent(new Event("carrinhoAtualizado"));
  return data;
}

export async function atualizarQuantidadeCarrinho(idItem, qtd) {
  const token = localStorage.getItem("tokenCliente");
  if (!token) throw new Error("não autenticado");
  const res = await fetch(`${API_URL}/orders/cart/${idItem}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ quantidade: qtd }),
  });
  // //console.log(await res.json());
  const data = await parseResponse(res);
  window.dispatchEvent(new Event("carrinhoAtualizado"));
  return data;
}

export async function removerDoCarrinho(idItem) {
  const token = localStorage.getItem("tokenCliente");
  if (!token) throw new Error("não autenticado");
  const res = await fetch(`${API_URL}/orders/cart/${idItem}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await parseResponse(res);
  window.dispatchEvent(new Event("carrinhoAtualizado"));
  return data;
}

// export async function criarPedido(pedido) {
//   const token = localStorage.getItem("tokenCliente");
//   if (!token) throw new Error("não autenticado");
//   const res = await fetch(`${API_URL}/pedidos`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify(pedido),
//   });
//   const data = await parseResponse(res);
//   window.dispatchEvent(new Event("carrinhoAtualizado"));
//   return data;
// }

export async function criarPedido(pedido) {
  const token = localStorage.getItem("tokenCliente");
  if (!token) throw new Error("não autenticado");

  let itens = [];
  if (Array.isArray(pedido.itens)) {
    itens = pedido.itens.map((item) => ({
      id_produto: Number(item.id_produto),
      quantidade: Number(item.quantidade ?? item.qtd ?? 1),
    }));
  } else if (pedido.itens && typeof pedido.itens === "object") {
    Object.values(pedido.itens).forEach((item) => {
      itens.push({
        id_produto: Number(item.id_produto),
        quantidade: Number(item.quantidade ?? item.qtd ?? 1),
      });
    });
  }

  const idEndereco = Number(
    pedido.id_endereco_entrega ?? pedido.id_endereco ?? pedido.id_entrega ?? 1,
  );

  const tipoPagamento = String(
    pedido.tipo_pagamento ?? pedido.tipoPagamento ?? "PIX",
  ).toUpperCase();

  const methods = Array.isArray(pedido.methods)
    ? pedido.methods
    : [tipoPagamento];

  const body = {
    id_endereco_entrega: idEndereco,
    tipo_pagamento: tipoPagamento,
    methods: methods,
    itens: itens,
  };

  //console.log("Payload enviado para /orders:", body);
  const res = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  const data = await parseResponse(res);
  window.dispatchEvent(new Event("carrinhoAtualizado"));
  return data;
}

function collectOrderArrays(value, found = []) {
  if (!value || typeof value !== "object") return found;
  if (Array.isArray(value)) {
    if (
      value.some(
        (item) =>
          item &&
          typeof item === "object" &&
          ("id_pedido" in item ||
            "idPedido" in item ||
            "status" in item ||
            "id_status" in item ||
            "datahora" in item ||
            "dataPedido" in item),
      )
    )
      found.push(...value);
    value.forEach((item) => collectOrderArrays(item, found));
    return found;
  }
  Object.values(value).forEach((item) => collectOrderArrays(item, found));
  return found;
}

export async function fetchPedidos(
  token = localStorage.getItem("tokenCliente"),
) {
  if (!token)
    throw new Error("Você precisa estar logado para consultar seus pedidos.");
  const res = await fetch(`${API_URL}/orders`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Erro ao buscar pedidos");
  const data = await parseResponse(res);

  const items =
    data?.data?.items ??
    data?.items ??
    data?.data ??
    (Array.isArray(data) ? data : []);
  return Array.isArray(items) ? items : [];
}

export async function fetchEnderecosAPI() {
  const token = localStorage.getItem("tokenCliente");
  if (!token) return [];
  try {
    const res = await fetch(`${API_URL}/users/me/addresses`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) return [];
    const data = await parseResponse(res);
    const list =
      data.data ??
      data.addresses ??
      data.enderecos ??
      (Array.isArray(data) ? data : []);
    return Array.isArray(list) ? list : [];
  } catch (err) {
    //console.error("Erro ao buscar endereços:", err);
    return [];
  }
}

export async function criarEnderecoAPI(dados) {
  const token = localStorage.getItem("tokenCliente");
  if (!token) throw new Error("Usuário não autenticado");

  const body = {
    cep: dados.cep || "",
    estado: dados.estado || dados.uf || "",
    cidade: dados.cidade || "",
    bairro: dados.bairro || "",
    rua: dados.rua || "",
    numero: dados.numero || "0",
    principal: dados.principal ?? true,
  };

  const res = await fetch(`${API_URL}/users/me/addresses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  return await parseResponse(res);
}

export async function atualizarEnderecoAPI(id, dados) {
  const token = localStorage.getItem("tokenCliente");
  if (!token) throw new Error("Usuário não autenticado");

  const body = {
    cep: dados.cep || "",
    estado: dados.estado || dados.uf || "",
    cidade: dados.cidade || "",
    bairro: dados.bairro || "",
    rua: dados.rua || "",
    numero: dados.numero || "0",
  };

  const res = await fetch(`${API_URL}/users/me/addresses/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  return await parseResponse(res);
}

export async function removerEnderecoAPI(id) {
  const token = localStorage.getItem("tokenCliente");
  if (!token) throw new Error("Usuário não autenticado");

  const res = await fetch(`${API_URL}/users/me/addresses/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return await parseResponse(res);
}

export async function atualizarPerfilAPI({ nome, telefone, data_nasc, email }) {
  const token = localStorage.getItem("tokenCliente");
  if (!token) throw new Error("Usuário não autenticado");

  const body = {};
  if (nome !== undefined) body.nome = nome;
  if (telefone !== undefined) body.telefone = telefone;
  if (data_nasc !== undefined) body.data_nasc = data_nasc;
  if (email !== undefined) body.email = email;

  const res = await fetch(`${API_URL}/users/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  return await parseResponse(await res);
}

export async function atualizarFotoPerfilAPI(file) {
  const token = localStorage.getItem("tokenCliente");
  if (!token) throw new Error("Usuário não autenticado");
  if (!file) throw new Error("Selecione uma imagem para atualizar a foto.");

  const formData = new FormData();
  formData.append("pfp", file);

  const res = await fetch(`${API_URL}/users/me/pfp`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return await parseResponse(await res);
}
