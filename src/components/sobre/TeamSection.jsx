import React from "react";
import { MEMBROS } from "../../constants/team";
import { useTeamCarousel } from "../../hooks/useTeamCarousel";

export default function TeamSection() {
  const { current, carouselRef, goTo } = useTeamCarousel(MEMBROS.length);

  return (
    <section className="section team-section">
      <div className="sobre-container">
        <h2 className="section-title font-nunito">Conheça Quem Faz Acontecer</h2>
        <p
          className="text-center text-lg max-w-3xl mx-auto mb-12"
          style={{ color: "#6B7280" }}
        >
          Nossa equipe apaixonada trabalha incansavelmente para conectar você às
          melhores experiências doces do Brasil.
        </p>

        <div className="team-floating-element team-floating-element-1">
          <ion-icon name="diamond-outline" style={{ fontSize: "48px" }}></ion-icon>
        </div>
        <div className="team-floating-element team-floating-element-2">
          <ion-icon name="star" style={{ fontSize: "48px" }}></ion-icon>
        </div>

        <div className="team-carousel-container">
          <div className="team-carousel" ref={carouselRef}>
            {MEMBROS.map((m, i) => (
              <div
                key={m.nome}
                className="team-member reveal"
                style={i > 0 ? { animationDelay: `${i * 0.1}s` } : {}}
              >
                <div className="team-image-container">
                  <img src={m.foto} alt={m.nome} className="team-image" />
                  <div className="team-overlay">
                    <div className="team-social">
                      <a href={m.linkedin} target="_blank" rel="noreferrer">
                        <ion-icon name="logo-linkedin"></ion-icon>
                      </a>
                      <a href={m.github} target="_blank" rel="noreferrer">
                        <ion-icon name="logo-github"></ion-icon>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="team-info">
                  <h3 className="team-name font-nunito">{m.nome}</h3>
                </div>
              </div>
            ))}
          </div>

          <div className="carousel-nav">
            <button className="carousel-btn" type="button" onClick={() => goTo(current - 1)}>
              <ion-icon name="chevron-back-outline"></ion-icon>
            </button>
            <button className="carousel-btn" type="button" onClick={() => goTo(current + 1)}>
              <ion-icon name="chevron-forward-outline"></ion-icon>
            </button>
          </div>

          <div className="carousel-dots">
            {MEMBROS.map((_, i) => (
              <div
                key={i}
                className={`carousel-dot${i === current ? " active" : ""}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
