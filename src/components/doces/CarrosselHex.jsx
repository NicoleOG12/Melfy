import React, { useRef } from "react";
import HexIcon from "./HexIcon";

export default function CarrosselHex({ titulo, itens, isCategoria, onItemClick }) {
  const scrollRef = useRef(null);

  function scroll(dir) {
    if (scrollRef.current)
      scrollRef.current.scrollBy({ left: dir * 300, behavior: "smooth" });
  }

  return (
    <div className="carrossel-container">
      <h3>{titulo}</h3>
      <div className="carrossel">
        <button className="arrow left" onClick={() => scroll(-1)}>
          <img src="/assents/img/Geral/seta esquerda.svg" alt="anterior" />
        </button>

        <div
          className={isCategoria ? "categorias" : "doces"}
          ref={scrollRef}
        >
          {itens.map((item) => (
            <div
              key={item.nome}
              className={isCategoria ? "categoria" : "doce"}
              onClick={() => onItemClick(item.nome)}
            >
              <HexIcon
                img={item.img}
                alt={item.nome}
                style={item.style}
                isCategoria={isCategoria}
              />
              <p>{item.nome}</p>
            </div>
          ))}
        </div>

        <button className="arrow right" onClick={() => scroll(1)}>
          <img src="/assents/img/Geral/seta direita.svg" alt="próximo" />
        </button>
      </div>
    </div>
  );
}
