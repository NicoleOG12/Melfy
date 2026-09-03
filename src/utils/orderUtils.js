export const PAGE_SIZE = 8;

export const STATUS = [
  "Pedido recebido",
  "Em preparo",
  "Pronto para entrega",
  "Em rota",
  "Entregue",
];

export const TERMINAL = [
  "entregue",
  "finalizado",
  "concluido",
  "concluida",
  "cancelado",
  "recusado",
];

export const first = (...v) =>
  v.find((x) => x !== undefined && x !== null && x !== "");

export const norm = (v) =>
  String(v ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export const num = (v) => Number(v) || 0;

export const money = (v) =>
  num(v).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

export const getId = (v) =>
  typeof v === "object" && v
    ? first(
        v.id,
        v.id_produto,
        v.idProduto,
        v.id_loja,
        v.idLoja
      )
    : v;

export function date(v) {
  if (!v) return null;
  const d = v instanceof Date ? v : new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function dateTime(v) {
  const d = date(v);
  return d
    ? d.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }) +
        " • " +
        d.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        })
    : "—";
}

export function onlyTime(v) {
  const d = date(v);
  return d
    ? d.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";
}

export function image(v) {
  if (!v) return "";
  if (typeof v === "string") return v;
  return first(
    v.path,
    v.url,
    v.src,
    v.link,
    v.location,
    v.imagem
  );
}

export function imgProduct(i, p) {
  return first(
    image(i?.midia?.imagens?.[0]),
    image(i?.imagem),
    image(i?.foto),
    image(p?.midia?.imagens?.[0]),
    image(p?.imagem),
    image(p?.foto),
    image(p?.image)
  );
}

export function imgStore(s, i, p) {
  return first(
    image(s?.pfp),
    image(s?.fotoPerfil),
    image(s?.foto_perfil),
    image(s?.logo),
    image(s?.imagem),
    image(i?.loja?.pfp),
    image(p?.loja?.pfp)
  );
}

export function productId(i) {
  return first(
    i?.id_produto,
    i?.idProduto,
    i?.produto?.id_produto,
    i?.produto?.idProduto,
    i?.produto?.id
  );
}

export function storeId(raw, i, p) {
  return first(
    raw?.id_loja,
    raw?.idLoja,
    raw?.loja?.id_loja,
    raw?.loja?.idLoja,
    i?.id_loja,
    i?.idLoja,
    i?.loja?.id_loja,
    i?.loja?.idLoja,
    p?.id_loja,
    p?.idLoja
  );
}

export function itemsOf(raw) {
  const s = first(
    raw?.itens,
    raw?.items,
    raw?.pedidoItens,
    raw?.itensPedido,
    raw?.produtos,
    raw?.detalhes,
    []
  );

  return Array.isArray(s)
    ? s
    : s && typeof s === "object"
    ? Object.values(s)
    : [];
}

export function statusOf(raw) {
  const s = first(
    raw?.status,
    raw?.statusPedido,
    raw?.nomeStatus,
    raw?.status_nome,
    raw?.situacao,
    raw?.estado,
    raw?.id_status,
    raw?.status?.nome,
    0
  );

  const n = norm(s);
  let stage = Number(s) || 0;

  if (
    n.includes("rota") ||
    n.includes("transito") ||
    n.includes("caminho")
  ) {
    stage = 3;
  } else if (n.includes("entregue") || n.includes("finaliz")) {
    stage = 4;
  } else if (n.includes("pronto")) {
    stage = 2;
  } else if (n.includes("preparo") || n.includes("process")) {
    stage = 1;
  }

  return {
    stage: Math.min(4, Math.max(0, stage)),
    label:
      stage >= 4
        ? "Entregue"
        : stage === 3
        ? "Em rota de entrega"
        : stage === 2
        ? "Pronto para entrega"
        : stage === 1
        ? "Em preparo"
        : "Pedido recebido",
  };
}

export function normalize(raw, products = [], stores = []) {
  const items = itemsOf(raw).map((i, index) => {
    const pid = productId(i);

    const p =
      products.find(
        (x) =>
          String(first(x.id_produto, x.idProduto, x.id)) ===
          String(pid)
      ) ||
      i.produto ||
      i.product ||
      {};

    const sid = storeId(raw, i, p);

    const s =
      stores.find(
        (x) =>
          String(first(x.id_loja, x.idLoja, x.id)) ===
          String(sid)
      ) ||
      raw.loja ||
      i.loja ||
      p.loja ||
      {};

    const q = num(
      first(i.qtd, i.quantidade, i.quantity, 1)
    ) || 1;

    const unit = num(
      first(
        i.valor_uni,
        i.valorUnitario,
        i.valor_unitario,
        i.preco,
        p.valor_uni,
        p.preco,
        p.preco_unitario
      )
    );

    return {
      id: first(
        i.id_item_pedido,
        i.id_item,
        i.id,
        `${pid || "item"}-${index}`
      ),
      name: first(
        p.nome,
        p.name,
        i.nomeProduto,
        i.nome_produto,
        i.nome,
        "Produto"
      ),
      description: first(
        p.descricao,
        p.subtitulo,
        i.descricao,
        ""
      ),
      quantity: q,
      unit,
      total: num(
        first(
          i.valor_total,
          i.valorTotal,
          i.total,
          unit * q
        )
      ),
      image: imgProduct(i, p),
      storeName: first(
        s.nomeLoja,
        s.nome_loja,
        s.nome,
        i.nomeLoja,
        raw.nomeLoja,
        "Loja Melfy"
      ),
      storeImage: imgStore(s, i, p),
    };
  });

  const st = statusOf(raw);

  const created = first(
    raw.datahora,
    raw.dataHora,
    raw.dataPedido,
    raw.data_pedido,
    raw.createdAt,
    raw.created_at,
    raw.data,
    raw.dt_pedido,
    raw.horario
  );

  const delivered = first(
    raw.dataEntrega,
    raw.data_entrega,
    raw.dataEntregaRealizada,
    raw.data_entrega_realizada,
    raw.entregueEm,
    raw.entregue_em,
    raw.deliveryDate,
    raw.delivery_date
  );

  const eta = first(
    raw.previsaoEntrega,
    raw.previsao_entrega,
    raw.horarioPrevisao,
    raw.horario_previsao,
    raw.dataEntregaPrevista,
    raw.data_entrega_prevista,
    raw.eta,
    raw.tempoEstimado,
    raw.tempo_estimado
  );

  const courier = first(
    raw.entregador,
    raw.deliveryman,
    raw.delivery,
    raw.motorista,
    {}
  );

  const lat = Number(
    first(
      raw.latitudeEntregador,
      raw.latitude_entregador,
      raw.entregadorLatitude,
      raw.latEntregador,
      raw.latitude,
      courier?.latitude,
      courier?.lat
    )
  );

  const lng = Number(
    first(
      raw.longitudeEntregador,
      raw.longitude_entregador,
      raw.entregadorLongitude,
      raw.lngEntregador,
      raw.longitude,
      courier?.longitude,
      courier?.lng,
      courier?.lon
    )
  );

  const total = num(
    first(
      raw.total,
      raw.valorTotal,
      raw.valor_total,
      raw.totalPedido,
      raw.total_pedido,
      raw.precoTotal,
      raw.valor,
      raw.preco,
      items.reduce((a, x) => a + x.total, 0)
    )
  );

  const store = raw.loja || {};

  return {
    raw,
    id: first(
      raw.id_pedido,
      raw.idPedido,
      raw.id,
      raw.codigo_pedido,
      raw.codigoPedido,
      Math.random().toString(36).substring(2, 9)
    ),
    code: first(
      raw.codigoPedido,
      raw.codigo_pedido,
      raw.codigo,
      raw.id_pedido,
      raw.idPedido,
      raw.id,
      "—"
    ),
    items,
    storeName: first(
      store.nomeLoja,
      store.nome_loja,
      store.nome,
      raw.nomeLoja,
      items[0]?.storeName,
      "Loja Melfy"
    ),
    storeImage: first(
      imgStore(store, items[0], {}),
      items[0]?.storeImage
    ),
    created,
    eta,
    delivered,
    status: st,
    total,
    address: first(
      raw.enderecoEntrega,
      raw.endereco_entrega,
      raw.endereco?.enderecoCompleto,
      raw.endereco?.logradouro,
      raw.endereco,
      "—"
    ),
    payment: first(
      raw.pagamento?.nome,
      raw.pagamento?.descricao,
      raw.formaPagamento,
      raw.forma_pagamento,
      raw.pagamento,
      "Pagamento"
    ),
    fee: num(
      first(
        raw.taxaEntrega,
        raw.taxa_entrega,
        raw.valorEntrega,
        raw.valor_entrega
      )
    ),
    courierName: first(
      courier?.nome,
      courier?.name,
      raw.nomeEntregador,
      raw.nome_entregador,
      "Entregador Melfy"
    ),
    courierPhone: first(
      courier?.telefone,
      courier?.phone,
      raw.telefoneEntregador,
      raw.telefone_entregador,
      ""
    ),
    lat: Number.isFinite(lat) ? lat : null,
    lng: Number.isFinite(lng) ? lng : null,
  };
}

export function finished(o) {
  return (
    o.status.stage >= 4 ||
    TERMINAL.some((x) => norm(o.status.label).includes(x))
  );
}
