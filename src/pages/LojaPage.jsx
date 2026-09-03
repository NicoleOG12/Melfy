import React, { useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ProductModal from "../components/doces/ProductModal";
import LojaHero from "../components/loja/LojaHero";
import LojaTabs from "../components/loja/LojaTabs";
import LojaCardapio from "../components/loja/LojaCardapio";
import LojaSobre from "../components/loja/LojaSobre";
import LojaAvaliacoes from "../components/loja/LojaAvaliacoes";
import { useLojaPage } from "../hooks/useLojaPage";
import "../styles/cliente/loja.css";
import "../styles/cliente/doces.css";

const MOCK_HORARIOS = [
  { dia: "Segunda", abre: "09:00", fecha: "18:00", aberto: true  },
  { dia: "Terça",   abre: "09:00", fecha: "18:00", aberto: true  },
  { dia: "Quarta",  abre: "09:00", fecha: "18:00", aberto: true  },
  { dia: "Quinta",  abre: "09:00", fecha: "20:00", aberto: true  },
  { dia: "Sexta",   abre: "09:00", fecha: "20:00", aberto: true  },
  { dia: "Sábado",  abre: "10:00", fecha: "16:00", aberto: true  },
  { dia: "Domingo", abre: null,    fecha: null,     aberto: false },
];

const MOCK_AVALIACOES = [
  { id: 1, nome: "Mariana S.", foto: "/assents/img/Geral/Perfil.png", nota: 5, data: "15/06/2025", texto: "Os doces são maravilhosos! Brigadeiro de pistache então... simplesmente perfeito. Entrega rápida e embalagem linda 🍫", fotos: [] },
  { id: 2, nome: "Carla M.",   foto: "/assents/img/Geral/Perfil.png", nota: 5, data: "10/06/2025", texto: "Pedi para o aniversário da minha filha e todos amaram! Super recomendo, qualidade impecável.", fotos: [] },
  { id: 3, nome: "Fernanda L.", foto: "/assents/img/Geral/Perfil.png", nota: 4, data: "02/06/2025", texto: "Muito gostoso! Só demorou um pouco mais que o esperado, mas valeu a espera.", fotos: [] },
];

function lojaAbertoAgora(horarios) {
  const dias = ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"];
  return horarios.find((h) => h.dia === dias[new Date().getDay()])?.aberto ?? false;
}

export default function LojaPage() {
  const { loja, produtos, loading, erro } = useLojaPage();
  const [modalProd, setModalProd] = useState(null);
  const [secao, setSecao]         = useState("cardapio");
  const nomeLoja       = loja?.nome       ?? loja?.nomeLoja   ?? loja?.loja_nome ?? "Loja";
  const descricao      = loja?.descricao  ?? "Confeitaria artesanal especializada em doces finos e personalizados, feitos com muito amor e ingredientes selecionados.";
  const logoLoja       = loja?.pfp        ?? loja?.fotoPerfil ?? "/assents/img/Geral/Perfil.png";
  const telefone       = loja?.telefone   ?? loja?.whatsapp   ?? "";
  const email          = loja?.email      ?? "";
  const endereco       = loja?.endereco   ?? loja?.address    ?? "Rua das Flores, 123 — São Paulo, SP";
  const horarios       = loja?.horarios   ?? MOCK_HORARIOS;
  const avaliacoes     = loja?.avaliacoes ?? MOCK_AVALIACOES;
  const mediaAvaliacao = avaliacoes.length
    ? (avaliacoes.reduce((s, a) => s + a.nota, 0) / avaliacoes.length).toFixed(1)
    : "4.8";
  const aberto = lojaAbertoAgora(horarios);

  return (
    <>
      <Header />

      <main className="loja-page">

        <LojaHero
          nomeLoja={nomeLoja}
          descricao={descricao}
          logoLoja={logoLoja}
          aberto={aberto}
          mediaAvaliacao={mediaAvaliacao}
          totalProdutos={produtos.length}
          totalAvaliacoes={avaliacoes.length}
          telefone={telefone}
          loading={loading}
        />

        <LojaTabs
          secaoAtiva={secao}
          onSelect={setSecao}
          mediaAvaliacao={mediaAvaliacao}
        />

        <div className="loja-body">
          {secao === "cardapio" && (
            <LojaCardapio
              nomeLoja={nomeLoja}
              produtos={produtos}
              loading={loading}
              erro={erro}
              onCardClick={setModalProd}
            />
          )}

          {secao === "sobre" && (
            <LojaSobre
              descricao={descricao}
              endereco={endereco}
              telefone={telefone}
              email={email}
              horarios={horarios}
              aberto={aberto}
            />
          )}

          {secao === "avaliacoes" && (
            <LojaAvaliacoes
              avaliacoes={avaliacoes}
              mediaAvaliacao={mediaAvaliacao}
            />
          )}
        </div>
      </main>

      <ProductModal
        produto={modalProd}
        lojas={loja ? [loja] : []}
        onClose={() => setModalProd(null)}
      />

      <Footer />
    </>
  );
}
