import React from "react";

export default function HexIcon({ img, alt, style = {}, isCategoria = false }) {
  return (
    <div className={`hex-externo${isCategoria ? " categoria-hex" : ""}`}>
      <div className="hex-interno">
        <div className="hex-img">
          <img src={img} alt={alt} style={style} />
        </div>
      </div>
    </div>
  );
}
