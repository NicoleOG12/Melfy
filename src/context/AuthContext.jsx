import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { fetchCarrinho } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario,   setUsuario]   = useState(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const raw = JSON.parse(localStorage.getItem("infoCliente") || "null");
    setUsuario(Array.isArray(raw) ? raw[0] : null);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("tokenCliente");
    if (!usuario || !token) return;

    async function atualizar() {
      try {
        const items = await fetchCarrinho(token);
        setCartCount(items.reduce((acc, i) => acc + (i.quantidade || 0), 0));
      } catch {}
    }

    atualizar();
    const id = setInterval(atualizar, 5000);
    const onStorage = (e) => { if (e.key === "Sacola") atualizar(); };
    const onCarrinhoAtualizado = () => { atualizar(); };
    window.addEventListener("storage", onStorage);
    window.addEventListener("carrinhoAtualizado", onCarrinhoAtualizado);
    return () => {
      clearInterval(id);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("carrinhoAtualizado", onCarrinhoAtualizado);
    };
  }, [usuario]);

  const login = useCallback((token, dados) => {
    localStorage.setItem("tokenCliente", token);
    localStorage.setItem("infoCliente",  JSON.stringify([dados]));
    setUsuario(dados);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("tokenCliente");
    localStorage.removeItem("infoCliente");
    setUsuario(null);
    setCartCount(0);
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, cartCount, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
