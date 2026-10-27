import { API_URL } from "../constants/api";

function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

async function fetchComRetry(url, options = {}, tentativas = 3) {
  for (let i = 0; i < tentativas; i++) {
    try {
      const res = await fetch(url, options);
      if (res.status === 429 && i < tentativas - 1) {
        const retryAfter = res.headers?.get?.("retry-after");
        const retrySec = retryAfter ? parseInt(retryAfter, 10) : null;
        const delay = Number.isFinite(retrySec) && retrySec > 0
          ? retrySec * 1000
          : (1500 * (i + 1)) + Math.floor(Math.random() * 500);

        await sleep(delay);
        continue;
      }
      return res;
    } catch (err) {
      if (i === tentativas - 1) throw err;
      await sleep(1000 * (i + 1));
    }
  }
  return fetch(url, options);
}

async function parseResponse(res) {
  const text = await res.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = {};
  }
  if (!res.ok)
    throw new Error(
      data.message || data.mensagem || `Erro ${res.status} na API`,
    );

  return data;
}

export async function checkoutPedidoAPI(pedido) {
  const token = localStorage.getItem("tokenCliente");
  if (!token) throw new Error("não autenticado");

  const itens = Array.isArray(pedido.itens)
    ? pedido.itens.map((item) => ({
        id_produto: Number(item.id_produto),
        quantidade: Number(item.quantidade ?? item.qtd ?? 1),
      }))
    : [];

  if (
    !itens.length ||
    itens.some(
      (item) =>
        !Number.isInteger(item.id_produto) ||
        item.id_produto <= 0 ||
        !Number.isInteger(item.quantidade) ||
        item.quantidade <= 0,
    )
  ) {
    throw new Error("Os itens do pedido são inválidos.");
  }

  const idEndereco = Number(pedido.id_endereco_entrega);
  if (!Number.isInteger(idEndereco) || idEndereco <= 0) {
    throw new Error("Selecione um endereço de entrega válido.");
  }

  const metodo = String(pedido.metodo ?? "").toUpperCase();
  if (!["CARD", "PIX"].includes(metodo)) {
    throw new Error("Selecione uma forma de pagamento válida.");
  }
  if (!pedido.payment || typeof pedido.payment !== "object") {
    throw new Error("Os dados do pagamento estão incompletos.");
  }

  const body = {
    id_endereco_entrega: idEndereco,
    metodo,
    itens,
    payment: pedido.payment,
  };

  const res = await fetch(`${API_URL}/orders/checkout-api`, {
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

export async function fetchStatusPagamento(id, signal) {
  if (id === undefined || id === null || String(id).trim() === "") {
    throw new Error("Identificador do pagamento inválido.");
  }

  const token = localStorage.getItem("tokenCliente");
  if (!token) throw new Error("não autenticado");

  const res = await fetch(
    `${API_URL}/orders/payments/${encodeURIComponent(id)}/status`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      signal,
    },
  );

  return parseResponse(res);
}

export async function fetchPedidoDetalhesAPI(id, signal) {
  const pedidoId = String(id ?? "").trim();
  if (!pedidoId) throw new Error("Identificador do pedido inválido.");

  const token = localStorage.getItem("tokenCliente");
  if (!token) throw new Error("Usuário não autenticado.");

  const res = await fetch(`${API_URL}/orders/${encodeURIComponent(pedidoId)}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
    signal,
  });

  return parseResponse(res);
}

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos de cache

let cacheProdutos = null;
let cacheProdutosTimestamp = 0;
let pendingProdutosPromise = null;

let cacheLojas = null;
let cacheLojasTimestamp = 0;
let pendingLojasPromise = null;

function loadFromStorage(key) {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && parsed.timestamp && Date.now() - parsed.timestamp < CACHE_TTL_MS) {
      return parsed.data;
    }
  } catch {}
  return null;
}

function saveToStorage(key, data) {
  try {
    sessionStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {}
}

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
  const agora = Date.now();
  if (!forceRefresh) {
    if (cacheProdutos && agora - cacheProdutosTimestamp < CACHE_TTL_MS) {
      return cacheProdutos;
    }
    const stored = loadFromStorage("melfy_cache_produtos");
    if (stored && Array.isArray(stored) && stored.length > 0) {
      cacheProdutos = stored;
      cacheProdutosTimestamp = agora;
      return stored;
    }
    if (pendingProdutosPromise) {
      return pendingProdutosPromise;
    }
  }

  pendingProdutosPromise = (async () => {
    try {
      const res = await fetchComRetry(`${API_URL}/products?limit=1000&offset=0`);
      if (res.status === 429) {
        const fallback = cacheProdutos || loadFromStorage("melfy_cache_produtos");
        if (fallback) {
          console.warn("API retornou 429 (Rate Limit). Utilizando cache de produtos.");
          return fallback;
        }
      }
      const data = await parseResponse(res);
      const items = Array.isArray(data?.data?.items) ? data.data.items : [];
      cacheProdutos = items;
      cacheProdutosTimestamp = Date.now();
      saveToStorage("melfy_cache_produtos", items);
      return items;
    } catch (err) {
      const fallback = cacheProdutos || loadFromStorage("melfy_cache_produtos");
      if (fallback) {
        console.warn("Falha na requisição de produtos. Utilizando cache:", err);
        return fallback;
      }
      throw err;
    } finally {
      pendingProdutosPromise = null;
    }
  })();

  return pendingProdutosPromise;
}

export async function fetchLojas(forceRefresh = false) {
  const agora = Date.now();
  if (!forceRefresh) {
    if (cacheLojas && agora - cacheLojasTimestamp < CACHE_TTL_MS) {
      return cacheLojas;
    }
    const stored = loadFromStorage("melfy_cache_lojas");
    if (stored && Array.isArray(stored) && stored.length > 0) {
      cacheLojas = stored;
      cacheLojasTimestamp = agora;
      return stored;
    }
    if (pendingLojasPromise) {
      return pendingLojasPromise;
    }
  }

  pendingLojasPromise = (async () => {
    try {
      const res = await fetchComRetry(`${API_URL}/stores/`);
      if (res.status === 429) {
        const fallback = cacheLojas || loadFromStorage("melfy_cache_lojas");
        if (fallback) {
          console.warn("API retornou 429 (Rate Limit). Utilizando cache de lojas.");
          return fallback;
        }
      }
      const data = await parseResponse(res);
      const stores = Array.isArray(data?.data?.store) ? data.data.store : [];
      cacheLojas = stores;
      cacheLojasTimestamp = Date.now();
      saveToStorage("melfy_cache_lojas", stores);
      return stores;
    } catch (err) {
      const fallback = cacheLojas || loadFromStorage("melfy_cache_lojas");
      if (fallback) {
        console.warn("Falha na requisição de lojas. Utilizando cache:", err);
        return fallback;
      }
      throw err;
    } finally {
      pendingLojasPromise = null;
    }
  })();

  return pendingLojasPromise;
}

export async function fetchLoja(id) {
  try {
    const res = await fetch(`${API_URL}/stores/${id}`);
    if (res.ok) {
      const data = await parseResponse(res);
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
  } catch {
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
