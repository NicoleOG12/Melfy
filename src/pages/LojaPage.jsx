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

const MAPA_DIAS = {
  SEGUNDA: "Segunda",
  TERCA: "Terça",
  QUARTA: "Quarta",
  QUINTA: "Quinta",
  SEXTA: "Sexta",
  SABADO: "Sábado",
  DOMINGO: "Domingo",
};

function formatarHorarios(horariosAPI) {
  if (!Array.isArray(horariosAPI) || horariosAPI.length === 0) return MOCK_HORARIOS;
  return horariosAPI.map((h) => ({
    dia: MAPA_DIAS[h.dia_semana?.toUpperCase()] || h.dia || h.dia_semana || "",
    abre: h.abre || null,
    fecha: h.fecha || null,
    aberto: !h.fechado && Boolean(h.abre),
  }));
}

function humanizarChave(chave) {
  return String(chave || "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatarFormaEntrega(formaEntregaAPI) {
  if (!formaEntregaAPI) return [];

  const normalizarItem = (item, chave) => {
    if (!item) return null;

    if (typeof item === "string") {
      return {
        key: chave || item,
        label: item,
        descricao: "",
        ativo: true,
      };
    }

    const label =
      item.nome ||
      item.label ||
      item.titulo ||
      item.title ||
      item.name ||
      item.tipo ||
      humanizarChave(chave);

    const descricao =
      item.descricao || item.texto || item.details || item.observacao || "";

    const ativo =
      item.ativo ??
      item.disponivel ??
      item.enabled ??
      (item.status !== "indisponivel" && item.status !== "inativo");

    return {
      key: item.id || item.key || chave || label,
      label,
      descricao,
      ativo: Boolean(ativo),
    };
  };

  if (Array.isArray(formaEntregaAPI)) {
    return formaEntregaAPI
      .map((item) => normalizarItem(item, item?.key || item?.nome || item?.label))
      .filter(Boolean);
  }

  if (typeof formaEntregaAPI === "object") {
    return Object.entries(formaEntregaAPI)
      .map(([chave, valor]) => {
        if (valor === false || valor === null || valor === undefined) return null;

        if (typeof valor === "object") {
          return normalizarItem(valor, chave);
        }

        if (typeof valor === "string" || typeof valor === "number") {
          return {
            key: chave,
            label: humanizarChave(chave),
            descricao: valor,
            ativo: true,
          };
        }

        return {
          key: chave,
          label: humanizarChave(chave),
          descricao: "",
          ativo: Boolean(valor),
        };
      })
      .filter(Boolean);
  }

  return [];
}

function formatarEndereco(enderecosAPI, fallback) {
  if (Array.isArray(enderecosAPI) && enderecosAPI.length > 0) {
    const end = enderecosAPI[0];
    const comp = end.complemento ? ` (${end.complemento})` : "";
    return `${end.rua}, ${end.numero}${comp} — ${end.bairro}, ${end.cidade} - ${end.estado} (CEP: ${end.cep})`;
  }
  return fallback || "Endereço não informado";
}

function lojaAbertoAgora(horarios) {
  if (!Array.isArray(horarios) || horarios.length === 0) return true;
  const dias = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  const diaHoje = dias[new Date().getDay()];
  const hHoje = horarios.find((h) => h.dia === diaHoje);
  if (!hHoje) return true;
  return hHoje.aberto ?? false;
}

export default function LojaPage() {
  const { loja, produtos, rating, loading, erro } = useLojaPage();
  const [modalProd, setModalProd] = useState(null);
  const [secao, setSecao]         = useState("cardapio");

  const nomeLoja       = loja?.nome_loja  ?? loja?.nome       ?? loja?.nomeLoja   ?? "Loja";
  const descricao      = loja?.descricao  ?? "Confeitaria artesanal especializada em doces finos e personalizados.";
  const logoLoja       = loja?.foto_loja  ?? loja?.fotoPerfil ?? loja?.pfp        ?? "/assents/img/Geral/Perfil.png";
  const telefone       = loja?.telefone   ?? loja?.whatsapp   ?? "";
  const email          = loja?.email      ?? "";
  const endereco       = formatarEndereco(loja?.enderecos, loja?.endereco);
  const horarios       = formatarHorarios(loja?.horarios);
  const formaEntrega   = "";
  const avaliacoes     = loja?.avaliacoes ?? MOCK_AVALIACOES;

  const mediaAvaliacao = rating?.media && Number(rating.media) > 0
    ? Number(rating.media).toFixed(1)
    : "5.0";

  const totalAvaliacoes = rating?.total_avaliacoes ?? avaliacoes.length;
  const totalProdutos   = produtos.length || loja?._count?.produtos || loja?.total_produtos || 0;
  const aberto          = lojaAbertoAgora(horarios);

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
          totalProdutos={totalProdutos}
          totalAvaliacoes={totalAvaliacoes}
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
              formaEntrega={formaEntrega}
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
        onClose={() => setModalProd(null)}
      />

      <Footer />
    </>
  );
}
