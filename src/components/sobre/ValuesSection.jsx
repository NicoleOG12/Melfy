import React from "react";
import { VALORES } from "../../constants/team";

export default function ValuesSection() {
  return (
    <section className="section values-section">
      <div className="sobre-container">
        <h2 className="section-title font-nunito">Nossos Ingredientes Secretos</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {VALORES.map((v, i) => (
            <div
              key={v.titulo}
              className="value-card reveal"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="value-icon">
                <ion-icon name={v.icon}></ion-icon>
              </div>
              <h3 className="value-title font-nunito">{v.titulo}</h3>
              <p className="value-description">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
