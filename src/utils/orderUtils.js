export const PAGE_SIZE = 8;

export const STATUS = [
  "Pedido recebido",
  "Pedido pago",
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
  const arr = i?.imagem_produto || p?.imagem_produto;
  if (Array.isArray(arr) && arr.length > 0) return arr[0];
  if (typeof arr === "string") return arr;
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
    image(s?.foto_loja),
    image(s?.pfp),
    image(s?.fotoPerfil),
    image(s?.foto_perfil),
    image(s?.logo),
    image(s?.imagem),
    image(i?.loja?.foto_loja),
    image(i?.loja?.pfp),
    image(p?.loja?.foto_loja),
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
  if (Array.isArray(raw?.pedidos_loja) && raw.pedidos_loja.length > 0) {
    const extracted = [];
    raw.pedidos_loja.forEach((pl) => {
      const storeInfo = pl.loja || {};
      const subItens = pl.itens_pedido || pl.itens || [];
      subItens.forEach((it) => {
        extracted.push({
          ...it,
          loja: it.loja || storeInfo,
          status_loja: pl.status,
        });
      });
    });
    if (extracted.length > 0) return extracted;
  }

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
  const storeStatus = raw?.pedidos_loja?.[0]?.status;
  const payStatus = raw?.pagamento?.status_pagamento;
  const payLiberado = raw?.pagamento?.liberado;

  const s = first(
    storeStatus,
    payStatus,
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
  const nStore = norm(storeStatus);
  const nPay = norm(payStatus);

  let stage = 0;

  if (
    n.includes("delivered") ||
    n.includes("finished") ||
    n.includes("entregue") ||
    n.includes("finaliz") ||
    n.includes("concluid") ||
    nStore.includes("delivered") ||
    nStore.includes("finished")
  ) {
    stage = 5;
  } else if (
    n.includes("delivering") ||
    n.includes("rota") ||
    n.includes("transito") ||
    n.includes("caminho") ||
    nStore.includes("delivering")
  ) {
    stage = 4;
  } else if (
    n.includes("ready") ||
    n.includes("pronto") ||
    nStore.includes("ready")
  ) {
    stage = 3;
  } else if (
    n.includes("preparing") ||
    n.includes("preparo") ||
    n.includes("process") ||
    nStore.includes("preparing")
  ) {
    stage = 2;
  } else if (
    n.includes("payed") ||
    n.includes("paid") ||
    n.includes("pago") ||
    n.includes("aprovad") ||
    nStore.includes("payed") ||
    nStore.includes("paid") ||
    nPay.includes("aprovad") ||
    nPay.includes("payed") ||
    nPay.includes("paid") ||
    payLiberado === true
  ) {
    stage = 1;
  } else if (n.includes("cancelled") || n.includes("cancelad")) {
    stage = 5;
  }

  return {
    stage: Math.min(5, Math.max(0, stage)),
    label: n.includes("cancelad")
      ? "Cancelado"
      : stage >= 5
      ? "Entregue"
      : stage === 4
      ? "Em rota de entrega"
      : stage === 3
      ? "Pronto para entrega"
      : stage === 2
      ? "Em preparo"
      : stage === 1
      ? "Pedido pago"
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
      first(i.quantidade, i.qtd, i.quantity, 1)
    ) || 1;

    const unit = num(
      first(
        i.valor_unitario,
        i.valorUnitario,
        i.valor_uni,
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
        i.nome_produto,
        i.nomeProduto,
        p.nome,
        p.name,
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
          i.subtotal,
          i.valor_total,
          i.valorTotal,
          i.total,
          unit * q
        )
      ),
      image: imgProduct(i, p),
      storeName: first(
        s.nome_loja,
        s.nomeLoja,
        s.nome,
        i.loja?.nome_loja,
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
      raw.valor_total,
      raw.total,
      raw.valorTotal,
      raw.totalPedido,
      raw.total_pedido,
      raw.precoTotal,
      raw.valor,
      raw.preco,
      items.reduce((a, x) => a + x.total, 0)
    )
  );

  const storeObj = raw.pedidos_loja?.[0]?.loja || raw.loja || {};

  const endObj = raw.endereco_entrega || raw.enderecoEntrega || raw.endereco;
  let formattedAddress = "—";
  if (endObj && typeof endObj === "object") {
    const r = endObj.rua || endObj.logradouro || "";
    const n = endObj.numero ? `, ${endObj.numero}` : "";
    const c = endObj.complemento ? ` (${endObj.complemento})` : "";
    const b = endObj.bairro ? ` — ${endObj.bairro}` : "";
    const cid = endObj.cidade ? `, ${endObj.cidade}` : "";
    const uf = endObj.estado || endObj.uf ? `/${endObj.estado || endObj.uf}` : "";
    formattedAddress = `${r}${n}${c}${b}${cid}${uf}`;
  } else if (typeof endObj === "string") {
    formattedAddress = endObj;
  }

  const pag = raw.pagamento || {};
  const paymentStr = first(
    pag.tipo_pagamento,
    pag.nome,
    pag.descricao,
    raw.formaPagamento,
    raw.forma_pagamento,
    "PIX"
  );

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
      storeObj.nome_loja,
      storeObj.nomeLoja,
      storeObj.nome,
      raw.nomeLoja,
      items[0]?.storeName,
      "Loja Melfy"
    ),
    storeImage: first(
      imgStore(storeObj, items[0], {}),
      items[0]?.storeImage
    ),
    created,
    eta,
    delivered,
    status: st,
    total,
    address: formattedAddress,
    payment: paymentStr,
    paymentLink: pag.link_pagamento || null,
    paymentStatus: pag.status_pagamento || null,
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
    o.status.stage >= 5 ||
    TERMINAL.some((x) => norm(o.status.label).includes(x))
  );
}
