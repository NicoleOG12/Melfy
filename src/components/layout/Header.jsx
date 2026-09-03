import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const { usuario, cartCount } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="melfy-header">
      <div className="container-header-and-footer">
        <div className="header-content">

          {/* Logo */}
          <a href="/" className="header-logo">
            <img src="/assents/img/Logo/logo-melfy-dark.svg" alt="Melfy" className="logo-image" />
          </a>

          {/* Nav desktop */}
          <nav className="nav-desktop">
            <a href="/"      className="nav-link">Início</a>
            <a href="/doces" className="nav-link">Doces</a>
            {usuario && <a href="/pedidos" className="nav-link">Meus Pedidos</a>}
            <a href="/sobre" className="nav-link">Sobre</a>
          </nav>

          {/* Ações */}
          <div className="header-actions">
            {usuario ? (
              <>
                <a href="/carrinho" className="header-icon">
                  <i className="fas fa-shopping-bag"></i>
                  {cartCount > 0 && (
                    <span className="cart-count visible">{cartCount}</span>
                  )}
                </a>
                <a href="/perfil" className="user-profile">
                  <div className="user-avatar">
                    <i className="fas fa-user"></i>
                  </div>
                  <span className="user-name">
                    {usuario.nome?.split(" ")[0] || "Usuário"}
                  </span>
                </a>
              </>
            ) : (
              <a href="/auth" className="header-icon" aria-label="Entrar">
                <i className="fas fa-user"></i>
              </a>
            )}

            <button
              className="mobile-menu-toggle"
              onClick={() => setMobileOpen((v) => !v)}
            >
              <i className={`fas fa-${mobileOpen ? "times" : "bars"}`}></i>
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        <div className={`mobile-menu${mobileOpen ? " active" : ""}`}>
          <nav className="mobile-nav">
            <a href="/"      className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Início</a>
            <a href="/doces" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Doces</a>
            <a href="/sobre" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Sobre</a>
          </nav>
        </div>
      </div>
    </header>
  );
}
