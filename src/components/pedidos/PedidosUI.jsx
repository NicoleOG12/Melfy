import React from "react";
import { onlyTime } from "../../utils/orderUtils";

export function SyncBar({ updated, onRefresh }) {
  return (
    <div className="m-sync">
      <span>
        <i className="fa-solid fa-rotate" /> Atualização automática
      </span>

      {updated && (
        <span>Última atualização às {onlyTime(updated)}</span>
      )}

      <button onClick={onRefresh}>
        <i className="fa-solid fa-arrows-rotate" /> Atualizar agora
      </button>
    </div>
  );
}

export function ErrorBanner({ message, onRetry }) {
  return (
    <div className="m-error">
      <i className="fa-solid fa-circle-exclamation" />
      {message}
      <button onClick={onRetry}>Tentar novamente</button>
    </div>
  );
}

export function LoadingSpinner() {
  return (
    <div className="m-loading">
      <div />
      <strong>Buscando seus pedidos...</strong>
      <span>Só um minutinho 💛</span>
    </div>
  );
}

export function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <div className="m-section-heading">
      <div>
        <span>{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      <p>{subtitle}</p>
    </div>
  );
}

export function EmptyState({ emoji, title, description, small = false }) {
  return (
    <div className={`m-empty${small ? " small" : ""}`}>
      <div>{emoji}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
