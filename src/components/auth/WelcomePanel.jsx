import React from "react";
import { Sparkles, ShoppingCart, ShoppingBag, CakeSlice, Heart, Cookie, ArrowRight } from "lucide-react";

function DecorativeIcons() {
  return (
    <div className="auth-orbit" aria-hidden="true">
      <span className="orbit-item orbit-cake">
        <CakeSlice size={22} />
      </span>
      <span className="orbit-item orbit-heart">
        <Heart size={18} fill="currentColor" />
      </span>
      <span className="orbit-item orbit-cookie">
        <Cookie size={21} />
      </span>
      <span className="orbit-item orbit-bag">
        <ShoppingBag size={19} />
      </span>
      <span className="orbit-spark orbit-spark-1">✦</span>
      <span className="orbit-spark orbit-spark-2">✧</span>
      <span className="orbit-spark orbit-spark-3">✦</span>
    </div>
  );
}

export default function WelcomePanel({ mode, onSwitch }) {
  const isLogin = mode === "login";

  return (
    <aside
      className="auth-visual"
      aria-label={isLogin ? "Criar conta no Melfy" : "Entrar no Melfy"}
    >
      <div className="visual-grain" aria-hidden="true" />
      <div className="visual-glow visual-glow-one" aria-hidden="true" />
      <div className="visual-glow visual-glow-two" aria-hidden="true" />

      <div className="visual-stage">
        <DecorativeIcons />
        <div className="bee-shadow" aria-hidden="true" />
        <div className="bee-frame">
          <div className="bee-badge">
            <Sparkles size={12} />
            Melfy
          </div>
          <img src="/assents/img/Geral/Abelha Cliente.png" alt="" />
        </div>
        <div className="visual-sparkle visual-sparkle-a">✦</div>
        <div className="visual-sparkle visual-sparkle-b">✧</div>
      </div>

      <div className="visual-copy">
        <div className="visual-kicker">
          <ShoppingCart size={14} />
          {isLogin ? "Descubra doces incríveis" : "Que bom ter você de volta"}
        </div>

        <h2>
          {isLogin ? (
            <>
              Peça doces artesanais
              <br />
              <em>direto de quem faz.</em>
            </>
          ) : (
            <>
              Seu cantinho de doces
              <br />
              <em>está esperando.</em>
            </>
          )}
        </h2>

        <p>
          {isLogin
            ? "Encontre confeiteiras incríveis, faça pedidos e acompanhe tudo em um só lugar."
            : "Entre na sua conta e continue curtindo os melhores doces artesanais."}
        </p>

        <div className="visual-metrics">
          <div>
            <strong>3.2k+</strong>
            <span>confeiteiras</span>
          </div>
          <i />
          <div>
            <strong>4.9</strong>
            <span>avaliação média</span>
          </div>
          <i />
          <div>
            <strong>100%</strong>
            <span>artesanal</span>
          </div>
        </div>

        <button className="visual-cta" onClick={onSwitch} type="button">
          <span>
            {isLogin ? "Quero criar minha conta" : "Voltar para o login"}
          </span>
          <span className="visual-cta-icon">
            <ArrowRight size={16} />
          </span>
        </button>
      </div>

      <div className="visual-bottom-line" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </aside>
  );
}
