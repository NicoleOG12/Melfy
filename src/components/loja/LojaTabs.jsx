import React from "react";

const TABS = [
  { id: "cardapio",   label: "Cardápio",  icon: "fa-utensils"    },
  { id: "sobre",      label: "Sobre",     icon: "fa-info-circle" },
  { id: "avaliacoes", label: "Avaliações", icon: "fa-star"       },
];

export default function LojaTabs({ secaoAtiva, onSelect, mediaAvaliacao }) {
  return (
    <div className="loja-tabs-bar">
      <div className="loja-tabs-inner">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`loja-tab${secaoAtiva === tab.id ? " ativo" : ""}`}
            onClick={() => onSelect(tab.id)}
          >
            <i className={`fas ${tab.icon}`} />
            {tab.label}
            {tab.id === "avaliacoes" && (
              <span className="loja-tab-badge">{mediaAvaliacao} ★</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
