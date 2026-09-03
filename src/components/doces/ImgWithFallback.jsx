import React from "react";

export default function ImgWithFallback({ src, alt, className = "", fallback = "/assents/img/Geral/Perfil.png", ...props }) {
  return (
    <img
      className={className}
      src={src || fallback}
      alt={alt || ""}
      onError={(e) => {
        if (e.currentTarget.dataset.x) return;
        e.currentTarget.dataset.x = "1";
        e.currentTarget.src = fallback;
      }}
      {...props}
    />
  );
}
