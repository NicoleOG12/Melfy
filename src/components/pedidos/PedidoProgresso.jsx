import { STATUS } from "../../utils/orderUtils";

export default function PedidoProgresso({ stage }) {
  return (
    <div className="m-progress">
      {STATUS.map((s, i) => (
        <div
          className={`m-progress-step ${
            i <= stage ? "is-done" : ""
          } ${i === stage ? "is-current" : ""}`}
          key={s}
        >
          <span>
            {i < stage ? (
              <i className="fa-solid fa-check" />
            ) : (
              i + 1
            )}
          </span>

          <small>{s}</small>
        </div>
      ))}
    </div>
  );
}
