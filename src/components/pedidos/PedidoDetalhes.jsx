import { dateTime, money } from "../../utils/orderUtils";
import PedidoImagem from "./PedidoImagem";
import PedidoProgresso from "./PedidoProgresso";
import PedidoMapa from "./PedidoMapa";

export default function PedidoDetalhes({ o, history = false }) {
  return (
    <div className="m-details">
      <div className="m-detail-head">
        <div>
          <span className="m-kicker">
            DETALHES DO PEDIDO
          </span>

          <h3>Pedido #{o.code}</h3>

          <p>Realizado em {dateTime(o.created)}</p>
        </div>

        <strong>{money(o.total)}</strong>
      </div>

      <PedidoProgresso stage={o.status.stage} />

      <div className="m-info-grid">
        <div>
          <i className="fa-regular fa-clock" />

          <span>
            Pedido realizado
            <b>{dateTime(o.created)}</b>
          </span>
        </div>

        <div>
          <i className="fa-solid fa-calendar-check" />

          <span>
            Previsão de entrega
            <b>{dateTime(o.eta)}</b>
          </span>
        </div>

        <div>
          <i className="fa-solid fa-house-circle-check" />

          <span>
            Entregue em
            <b>
              {o.delivered
                ? dateTime(o.delivered)
                : "Ainda não entregue"}
            </b>
          </span>
        </div>

        <div>
          <i className="fa-solid fa-credit-card" />

          <span>
            Pagamento
            <b>{o.payment}</b>
          </span>
        </div>

        <div className="wide">
          <i className="fa-solid fa-location-dot" />

          <span>
            Endereço de entrega
            <b>{o.address}</b>
          </span>
        </div>
      </div>

      <div className="m-products">
        <div className="m-block-title">
          <h4>Itens do pedido</h4>

          <span>
            {o.items.length}{" "}
            {o.items.length === 1 ? "item" : "itens"}
          </span>
        </div>

        {o.items.map((i) => (
          <div className="m-product-row" key={i.id}>
            <PedidoImagem src={i.image} alt={i.name} />

            <div>
              <strong>{i.name}</strong>

              {i.description && (
                <small>{i.description}</small>
              )}

              <span>
                {i.quantity} × {money(i.unit)}
              </span>
            </div>

            <b>{money(i.total)}</b>
          </div>
        ))}
      </div>

      <div className="m-total">
        <span>
          Subtotal <b>{money(o.total - o.fee)}</b>
        </span>

        <span>
          Entrega <b>{o.fee ? money(o.fee) : "Grátis"}</b>
        </span>

        <strong>
          Total <b>{money(o.total)}</b>
        </strong>
      </div>

      {o.status.stage === 3 && (
        <div className="m-tracking">
          <div className="m-track-copy">
            <div>
              <span className="m-live-dot" /> ENTREGA EM
              TEMPO REAL
            </div>

            <h4>{o.courierName} está a caminho</h4>

            <p>
              Estamos acompanhando sua entrega. A posição é
              atualizada automaticamente.
            </p>

            {o.courierPhone && (
              <span className="m-phone">
                <i className="fa-solid fa-phone" />{" "}
                {o.courierPhone}
              </span>
            )}
          </div>

          <PedidoMapa o={o} />
        </div>
      )}

      {history && (
        <button className="m-repeat">
          <i className="fa-solid fa-rotate-right" /> Pedir
          novamente
        </button>
      )}
    </div>
  );
}
