import { dateTime, money } from "../../utils/orderUtils";
import PedidoImagem from "./PedidoImagem";
import PedidoDetalhes from "./PedidoDetalhes";

export default function PedidoHistorico({ o, open, setOpen }) {
  return (
    <article
      id={`pedido-${o.id}`}
      className={`m-history-card ${open ? "open" : ""}`}
    >
      <button
        className="m-history-bar"
        onClick={() => setOpen(open ? null : o.id)}
      >
        <PedidoImagem
          src={o.items[0]?.image}
          alt=""
          className="m-history-img"
        />

        <div className="m-history-copy">
          <div>
            <strong>{o.storeName}</strong>

            <span>{dateTime(o.created)}</span>
          </div>

          <p>
            {o.items.length ? o.items[0].name : "Pedido"}

            {o.items.length > 1
              ? ` + ${o.items.length - 1} ${
                  o.items.length - 1 === 1
                    ? "item"
                    : "itens"
                }`
              : ""}
          </p>

          <small>
            {o.items.reduce((a, i) => a + i.quantity, 0)} itens
            • {o.status.label}
          </small>
        </div>

        <b className="m-history-total">
          {money(o.total)}
        </b>

        <span className="m-chevron">
          <i className="fa-solid fa-chevron-down" />
        </span>
      </button>

      {open && <PedidoDetalhes o={o} history />}
    </article>
  );
}
