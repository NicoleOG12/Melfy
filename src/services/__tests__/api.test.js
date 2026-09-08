import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  fetchProdutos,
  fetchLojas,
  fetchLoja,
  fetchProdutosPorLoja,
  fetchCarrinho,
  adicionarAoCarrinho,
  removerDoCarrinho,
  criarPedido,
  fetchPedidos,
} from "../api";

// Mock da constante API_URL
vi.mock("../../constants/api", () => ({
  API_URL: "https://api.melfy.test",
}));

// Helper para montar um Response fake
function makeResponse(body, { ok = true, status = 200 } = {}) {
  return {
    ok,
    status,
    text: () => Promise.resolve(JSON.stringify(body)),
  };
}

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn());
  vi.stubGlobal("localStorage", {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  });
  vi.stubGlobal("window", {
    dispatchEvent: vi.fn(),
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

// ---------------------------------------------------------------------------
// fetchProdutos
// ---------------------------------------------------------------------------
describe("fetchProdutos", () => {
  it("retorna a lista de produtos quando a API responde com sucesso", async () => {
    const produtos = [{ id: 1, nome: "Brigadeiro" }, { id: 2, nome: "Trufa" }];
    fetch.mockResolvedValueOnce(makeResponse({ result: produtos }));

    const result = await fetchProdutos();

    expect(fetch).toHaveBeenCalledWith("https://api.melfy.test/produtos");
    expect(result).toEqual(produtos);
  });

  it("retorna array vazio quando result não é array", async () => {
    fetch.mockResolvedValueOnce(makeResponse({ result: null }));

    const result = await fetchProdutos();
    expect(result).toEqual([]);
  });

  it("lança erro quando a API retorna status de erro", async () => {
    fetch.mockResolvedValueOnce(
      makeResponse({ message: "Erro interno" }, { ok: false, status: 500 })
    );

    await expect(fetchProdutos()).rejects.toThrow("Erro interno");
  });
});

// ---------------------------------------------------------------------------
// fetchLojas
// ---------------------------------------------------------------------------
describe("fetchLojas", () => {
  it("retorna a lista de lojas", async () => {
    const lojas = [{ id_loja: 1, nome: "Doceria da Maria" }];
    fetch.mockResolvedValueOnce(makeResponse({ result: lojas }));

    const result = await fetchLojas();

    expect(fetch).toHaveBeenCalledWith("https://api.melfy.test/lojas/fetchAll");
    expect(result).toEqual(lojas);
  });

  it("retorna array vazio quando result não é array", async () => {
    fetch.mockResolvedValueOnce(makeResponse({}));
    const result = await fetchLojas();
    expect(result).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// fetchLoja
// ---------------------------------------------------------------------------
describe("fetchLoja", () => {
  it("retorna a loja pelo id_loja", async () => {
    const lojas = [
      { id_loja: 1, nome: "Doceria A" },
      { id_loja: 2, nome: "Doceria B" },
    ];
    fetch.mockResolvedValueOnce(makeResponse({ result: lojas }));

    const loja = await fetchLoja(1);
    expect(loja).toEqual({ id_loja: 1, nome: "Doceria A" });
  });

  it("retorna a loja pelo idLoja (camelCase)", async () => {
    const lojas = [{ idLoja: 10, nome: "Doceria C" }];
    fetch.mockResolvedValueOnce(makeResponse({ result: lojas }));

    const loja = await fetchLoja(10);
    expect(loja).toEqual({ idLoja: 10, nome: "Doceria C" });
  });

  it("retorna null quando a loja não existe", async () => {
    fetch.mockResolvedValueOnce(makeResponse({ result: [] }));

    const loja = await fetchLoja(999);
    expect(loja).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// fetchProdutosPorLoja
// ---------------------------------------------------------------------------
describe("fetchProdutosPorLoja", () => {
  it("filtra corretamente os produtos pelo id_loja", async () => {
    const produtos = [
      { id: 1, nome: "Brigadeiro", id_loja: 5 },
      { id: 2, nome: "Trufa", id_loja: 7 },
      { id: 3, nome: "Beijinho", id_loja: 5 },
    ];
    fetch.mockResolvedValueOnce(makeResponse({ result: produtos }));

    const result = await fetchProdutosPorLoja(5);
    expect(result).toHaveLength(2);
    expect(result.map((p) => p.id)).toEqual([1, 3]);
  });

  it("filtra por idLoja (camelCase)", async () => {
    const produtos = [
      { id: 1, nome: "Brigadeiro", idLoja: 3 },
      { id: 2, nome: "Trufa", idLoja: 4 },
    ];
    fetch.mockResolvedValueOnce(makeResponse({ result: produtos }));

    const result = await fetchProdutosPorLoja(3);
    expect(result).toHaveLength(1);
    expect(result[0].nome).toBe("Brigadeiro");
  });

  it("retorna array vazio quando nenhum produto pertence à loja", async () => {
    fetch.mockResolvedValueOnce(makeResponse({ result: [] }));
    const result = await fetchProdutosPorLoja(99);
    expect(result).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// fetchCarrinho
// ---------------------------------------------------------------------------
describe("fetchCarrinho", () => {
  it("retorna os itens do carrinho via result", async () => {
    const items = [{ id: 1, qtd: 2 }];
    fetch.mockResolvedValueOnce(makeResponse({ result: items }));

    const result = await fetchCarrinho("token-abc");
    expect(result).toEqual(items);
    expect(fetch).toHaveBeenCalledWith(
      "https://api.melfy.test/carrinho",
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: "Bearer token-abc" }),
      })
    );
  });

  it("retorna os itens do carrinho via items", async () => {
    const items = [{ id: 2, qtd: 1 }];
    fetch.mockResolvedValueOnce(makeResponse({ items }));

    const result = await fetchCarrinho("token-xyz");
    expect(result).toEqual(items);
  });

  it("retorna array vazio quando a resposta não é ok", async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 401, text: () => Promise.resolve("") });

    const result = await fetchCarrinho("token-invalido");
    expect(result).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// adicionarAoCarrinho
// ---------------------------------------------------------------------------
describe("adicionarAoCarrinho", () => {
  it("lança erro quando não há token", async () => {
    localStorage.getItem.mockReturnValue(null);
    await expect(adicionarAoCarrinho(1)).rejects.toThrow("não autenticado");
  });

  it("faz POST e retorna data quando autenticado", async () => {
    localStorage.getItem.mockReturnValue("meu-token");
    const responseData = { success: true };
    fetch.mockResolvedValueOnce(makeResponse(responseData));

    const result = await adicionarAoCarrinho(5, 2);

    expect(fetch).toHaveBeenCalledWith(
      "https://api.melfy.test/carrinho?id=5",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ Authorization: "Bearer meu-token" }),
        body: JSON.stringify({ qtd: 2 }),
      })
    );
    expect(result).toEqual(responseData);
    expect(window.dispatchEvent).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// removerDoCarrinho
// ---------------------------------------------------------------------------
describe("removerDoCarrinho", () => {
  it("lança erro quando não há token", async () => {
    localStorage.getItem.mockReturnValue(null);
    await expect(removerDoCarrinho(1, 1)).rejects.toThrow("não autenticado");
  });

  it("faz DELETE e dispara evento de atualização", async () => {
    localStorage.getItem.mockReturnValue("meu-token");
    fetch.mockResolvedValueOnce(makeResponse({ removed: true }));

    const result = await removerDoCarrinho(3, 1);

    expect(fetch).toHaveBeenCalledWith(
      "https://api.melfy.test/carrinho?id=3",
      expect.objectContaining({ method: "DELETE" })
    );
    expect(result).toEqual({ removed: true });
    expect(window.dispatchEvent).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// criarPedido
// ---------------------------------------------------------------------------
describe("criarPedido", () => {
  it("lança erro quando não há token", async () => {
    localStorage.getItem.mockReturnValue(null);
    await expect(criarPedido({})).rejects.toThrow("não autenticado");
  });

  it("faz POST com o corpo do pedido e retorna a resposta", async () => {
    localStorage.getItem.mockReturnValue("token-pedido");
    const pedido = { itens: [{ id: 1, qtd: 1 }], total: 10.0 };
    fetch.mockResolvedValueOnce(makeResponse({ id_pedido: 42 }));

    const result = await criarPedido(pedido);

    expect(fetch).toHaveBeenCalledWith(
      "https://api.melfy.test/pedidos",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(pedido),
      })
    );
    expect(result).toEqual({ id_pedido: 42 });
    expect(window.dispatchEvent).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// fetchPedidos
// ---------------------------------------------------------------------------
describe("fetchPedidos", () => {
  it("lança erro quando não há token", async () => {
    await expect(fetchPedidos(null)).rejects.toThrow(
      "Você precisa estar logado para consultar seus pedidos."
    );
  });

  it("retorna pedidos a partir de result", async () => {
    const pedidos = [
      { id_pedido: 1, status: "confirmado" },
      { id_pedido: 2, status: "entregue" },
    ];
    fetch.mockResolvedValueOnce(makeResponse({ result: pedidos }));

    const result = await fetchPedidos("token-valido");
    expect(result).toHaveLength(2);
    expect(result[0].id_pedido).toBe(1);
  });

  it("retorna pedidos a partir de payload aninhado (collectOrderArrays)", async () => {
    const pedidos = [
      { id_pedido: 10, status: "pendente" },
      { id_pedido: 11, status: "confirmado" },
    ];
    fetch.mockResolvedValueOnce(makeResponse({ data: { lista: pedidos } }));

    const result = await fetchPedidos("token-valido");
    expect(result).toHaveLength(2);
  });

  it("remove pedidos duplicados", async () => {
    const pedido = { id_pedido: 5, status: "entregue" };
    fetch.mockResolvedValueOnce(makeResponse({ result: [pedido, pedido] }));

    const result = await fetchPedidos("token-valido");
    expect(result).toHaveLength(1);
  });

  it("usa token do localStorage quando não passado como argumento", async () => {
    localStorage.getItem.mockReturnValue("token-do-storage");
    fetch.mockResolvedValueOnce(makeResponse({ result: [] }));

    const result = await fetchPedidos();
    expect(fetch).toHaveBeenCalledWith(
      "https://api.melfy.test/pedidos",
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: "Bearer token-do-storage" }),
      })
    );
    expect(result).toEqual([]);
  });
});
