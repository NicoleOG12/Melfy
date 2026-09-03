import React from "react";

export default function Estrelas({ nota, size = 14 }) {
  return (
    <span className="loja-estrelas" style={{ fontSize: size }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <i key={n} className={n <= nota ? "fas fa-star" : "far fa-star"} />
      ))}
    </span>
  );
}
