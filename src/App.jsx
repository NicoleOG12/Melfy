import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import HomePage    from "./pages/HomePage";
import SobrePage   from "./pages/SobrePage";
import DocesPage   from "./pages/DocesPage";
import PedidosPage from "./pages/PedidosPage";
import PerfilPage  from "./pages/PerfilPage";
import CarrinhoPage from "./pages/CarrinhoPage";
import AuthPage    from "./pages/AuthPage";
import LojaPage    from "./pages/LojaPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"          element={<HomePage />} />
          <Route path="/sobre"     element={<SobrePage />} />
          <Route path="/doces"     element={<DocesPage />} />
          <Route path="/pedidos"   element={<PedidosPage />} />
          <Route path="/perfil"    element={<PerfilPage />} />
          <Route path="/carrinho"  element={<CarrinhoPage />} />
          <Route path="/auth"      element={<AuthPage />} />
          <Route path="/loja/:id"  element={<LojaPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
