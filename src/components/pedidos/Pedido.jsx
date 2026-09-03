import { money, onlyTime } from "../../utils/orderUtils";
import PedidoImagem from "./PedidoImagem";
import PedidoDetalhes from "./PedidoDetalhes";

export default function Pedido({ o, open, setOpen }) {
  return (
    <article
      id={`pedido-${o.id}`}
      className={`m-active-card ${open ? "open" : ""}`}
    >
      <button
        className="m-order-bar"
        onClick={() => setOpen(open ? null : o.id)}
      >
        <div className="m-store-avatar">
          <PedidoImagem src={o.storeImage} alt="" />

          <span className="m-store-online" />
        </div>

        <div className="m-order-main">
          <div className="m-store-name">
            <strong>{o.storeName}</strong>

            <span>Pedido #{o.code}</span>
          </div>

          <h3>
            {o.items.length === 1
              ? o.items[0]?.name
              : `${o.items[0]?.name || "Seu pedido"}${
                  o.items.length > 1
                    ? ` + ${o.items.length - 1} ${
                        o.items.length - 1 === 1
                          ? "item"
                          : "itens"
                      }`
                    : ""
                }`}
          </h3>

          <div className="m-order-meta">
            <span>
              <i className="fa-regular fa-clock" />{" "}
              {o.status.stage === 3
                ? `Chega por volta de ${onlyTime(o.eta)}`
                : `Previsão: ${onlyTime(o.eta)}`}
            </span>

            <b>{money(o.total)}</b>
          </div>
        </div>

        <span className="m-chevron">
          <i className="fa-solid fa-chevron-down" />
        </span>
      </button>

      {open && <PedidoDetalhes o={o} />}
    </article>
  );
}
