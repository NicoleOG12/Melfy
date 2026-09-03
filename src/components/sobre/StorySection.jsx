import React from "react";

const STATS = [
  { target: 500,    label: "Confeitarias Parceiras" },
  { target: 100000, label: "Pedidos Entregues" },
  { target: 25000,  label: "Clientes Satisfeitos", colSpan: true },
];

export default function StorySection() {
  return (
    <section className="section story-section">
      <div className="sobre-container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="story-image reveal">
            <img src="/assents/img/Logo/melfy-com-fundo.svg" alt="Melfy" />
          </div>

          <div className="reveal">
            <h2 style={{ color: "#6B3F2A" }} className="text-3xl font-bold mb-4">
              Nossa Doce Jornada
            </h2>

            <p style={{ color: "#6B7280", marginBottom: "1rem" }}>
              A Melfy começou como um pequeno sonho em uma cozinha caseira. Víamos
              o incrível talento de confeiteiros locais que criavam verdadeiras obras
              de arte, mas que muitas vezes não tinham a visibilidade que mereciam.
              Decidimos criar uma ponte: uma plataforma que não só facilita o delivery,
              mas que celebra a arte da confeitaria.
            </p>

            <p style={{ color: "#6B7280" }}>
              De uma ideia simples, crescemos para nos tornar a maior comunidade de
              amantes de doces do Brasil, apoiando pequenos negócios e levando
              felicidade para milhares de lares.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-8">
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className={`stat-item${s.colSpan ? " col-span-2 md:col-span-1" : ""}`}
                >
                  <p className="stat-number" data-target={s.target}>0</p>
                  <p className="stat-label">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
