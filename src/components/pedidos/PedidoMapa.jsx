export default function PedidoMapa({ o }) {
  if (o.lat === null || o.lng === null) {
    return (
      <div className="m-map-empty">
        <i className="fa-solid fa-location-dot" />

        <strong>Rastreamento ainda não disponível</strong>

        <span>
          Quando o entregador iniciar a rota, a localização
          aparecerá aqui.
        </span>
      </div>
    );
  }

  const d = 0.006;
  const bbox = `${o.lng - d},${o.lat - d},${o.lng + d},${
    o.lat + d
  }`;

  return (
    <div className="m-map">
      <iframe
        title="Mapa da entrega"
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${o.lat},${o.lng}`}
      />

      <div className="m-live">
        <span /> AO VIVO
      </div>
    </div>
  );
}
