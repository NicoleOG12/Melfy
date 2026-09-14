import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { fetchCarrinho } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const raw = JSON.parse(localStorage.getItem("infoCliente") || "null");
    setUsuario(Array.isArray(raw) ? raw[0] : null);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("tokenCliente");
    if (!usuario || !token) return;

    function atualizarCountLocal() {
      const raw = localStorage.getItem("Sacola");
      if (raw) {
        try {
          const items = JSON.parse(raw);
          if (Array.isArray(items)) {
            const count = items.reduce(
              (acc, i) => acc + (Number(i.quantidade ?? i.qtd) || 0),
              0
            );
            setCartCount(count);
            return true;
          }
        } catch { }
      }
      return false;
    }

    async function sincronizar() {
      if (atualizarCountLocal()) return;
      try {
        const items = await fetchCarrinho(token);
        if (Array.isArray(items)) {
          setCartCount(
            items.reduce(
              (acc, i) => acc + (Number(i.quantidade ?? i.qtd) || 0),
              0
            )
          );
          localStorage.setItem("Sacola", JSON.stringify(items));
        }
      } catch { }
    }

    sincronizar();

    const onStorage = (e) => {
      if (e.key === "Sacola") atualizarCountLocal();
    };
    const onCarrinhoAtualizado = () => {
      atualizarCountLocal();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("carrinhoAtualizado", onCarrinhoAtualizado);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("carrinhoAtualizado", onCarrinhoAtualizado);
    };
  }, [usuario]);

  const login = useCallback((token, dados) => {
    //console.log(dados)
    localStorage.setItem("tokenCliente", token);
    localStorage.setItem("infoCliente", JSON.stringify([dados]));
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
