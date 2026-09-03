export default function PedidoImagem({ src, alt, className = "" }) {
  return (
    <img
      className={className}
      src={src || "/assents/img/Geral/Perfil.png"}
      alt={alt}
      onError={(e) => {
        if (e.currentTarget.dataset.x) return;

        e.currentTarget.dataset.x = "1";
        e.currentTarget.src = "/assents/img/Geral/Perfil.png";
      }}
    />
  );
}
