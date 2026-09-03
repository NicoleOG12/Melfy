import React, { useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import PerfilSidebar from "../components/perfil/PerfilSidebar";
import DadosTab from "../components/perfil/DadosTab";
import PagamentosTab from "../components/perfil/PagamentosTab";
import NotificacoesTab from "../components/perfil/NotificacoesTab";
import CuponsTab from "../components/perfil/CuponsTab";
import ConfiguracoesTab from "../components/perfil/ConfiguracoesTab";
import ModalPagamento from "../components/perfil/ModalPagamento";
import { usePerfilUsuario } from "../hooks/usePerfilUsuario";
import { usePagamentos } from "../hooks/usePerfilDados";
import MelfySwal from "../services/melfySwal";
import "../styles/cliente/perfil.css";
import "../styles/cliente/perfil-pagamentos.css";

export default function PerfilPage() {
  const [secaoAtiva, setSecaoAtiva] = useState("dados");

  const [toastMsg, setToastMsg] = useState("");
  function showToast(msg) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  }

  const perfil = usePerfilUsuario();

  const pagamentoHook = usePagamentos(showToast);

  function habilitarEdicao() {
    const msg = perfil.toggleEdicao();
    if (msg) showToast(msg);
  }

  async function sairConta() {
    const result = await MelfySwal({
      icon: "warning",
      title: "Sair da conta?",
      text: "Tem certeza que deseja encerrar sua sessão?",
      confirmButtonText: "Sim, sair",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;
    localStorage.removeItem("tokenCliente");
    localStorage.removeItem("infoCliente");
    localStorage.removeItem("usuarioLogado");
    localStorage.removeItem("confeiteiraLogada");
    window.location.href = "/";
  }

  return (
    <>
      <Header />

      <div className="header-bg"></div>

      <main>
        <div className="perfil-layout">
          <PerfilSidebar
            secaoAtiva={secaoAtiva}
            onSelectSecao={setSecaoAtiva}
            onSair={sairConta}
            foto={perfil.foto}
            nomeExibir={perfil.nomeExibir}
            email={perfil.email}
          />

          {secaoAtiva === "dados" && (
            <DadosTab
              isEditing={perfil.isEditing}
              nome={perfil.nome}
              setNome={perfil.setNome}
              sobrenome={perfil.sobrenome}
              setSobrenome={perfil.setSobrenome}
              cpf={perfil.cpf}
              setCpf={perfil.setCpf}
              dataNascimento={perfil.dataNascimento}
              setDataNascimento={perfil.setDataNascimento}
              email={perfil.email}
              setEmail={perfil.setEmail}
              celular={perfil.celular}
              setCelular={perfil.setCelular}
              foto={perfil.foto}
              setFoto={perfil.setFoto}
              onToggleEdicao={habilitarEdicao}
            />
          )}

          {secaoAtiva === "pagamentos" && (
            <PagamentosTab
              pagamentos={pagamentoHook.pagamentos}
              onRemoverPagamento={pagamentoHook.removerPagamento}
              onAbrirModal={() => pagamentoHook.setModalPagamento(true)}
            />
          )}

          {secaoAtiva === "notificacoes" && <NotificacoesTab />}

          {secaoAtiva === "cupons" && (
            <CuponsTab
              onCopiarCupom={(codigo) => {
                navigator.clipboard.writeText(codigo);
                showToast(`Cupom ${codigo} copiado!`);
              }}
            />
          )}

          {secaoAtiva === "configuracoes" && <ConfiguracoesTab />}
        </div>
      </main>

      <ModalPagamento
        isOpen={pagamentoHook.modalPagamento}
        onClose={() => pagamentoHook.setModalPagamento(false)}
        onSave={pagamentoHook.salvarPagamento}
        tipoPagamento={pagamentoHook.tipoPagamento}
        setTipoPagamento={pagamentoHook.setTipoPagamento}
        subBadge={pagamentoHook.subBadge}
        setSubBadge={pagamentoHook.setSubBadge}
        numCartao={pagamentoHook.numCartao}
        setNumCartao={pagamentoHook.setNumCartao}
        valCartao={pagamentoHook.valCartao}
        setValCartao={pagamentoHook.setValCartao}
        cvvCartao={pagamentoHook.cvvCartao}
        setCvvCartao={pagamentoHook.setCvvCartao}
        titularCartao={pagamentoHook.titularCartao}
        setTitularCartao={pagamentoHook.setTitularCartao}
      />

      {toastMsg && <div className="toast-feedback">{toastMsg}</div>}

      <Footer />
    </>
  );
}
