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
  "SEGUNDA-FEIRA": "Segunda",
  SEG: "Segunda",
  MONDAY: "Segunda",

  TERCA: "Terça",
  TERÇA: "Terça",
  "TERCA-FEIRA": "Terça",
  "TERÇA-FEIRA": "Terça",
  TER: "Terça",
  TUESDAY: "Terça",

  QUARTA: "Quarta",
  "QUARTA-FEIRA": "Quarta",
  QUA: "Quarta",
  WEDNESDAY: "Quarta",

  QUINTA: "Quinta",
  "QUINTA-FEIRA": "Quinta",
  QUI: "Quinta",
  THURSDAY: "Quinta",

  SEXTA: "Sexta",
  "SEXTA-FEIRA": "Sexta",
  SEX: "Sexta",
  FRIDAY: "Sexta",

  SABADO: "Sábado",
  SÁBADO: "Sábado",
  SAB: "Sábado",
  SATURDAY: "Sábado",

  DOMINGO: "Domingo",
  DOM: "Domingo",
  SUNDAY: "Domingo",
};

const ORDEM_DIAS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

function formatarHora(horaStr) {
  if (!horaStr || typeof horaStr !== "string") return null;
  const trimmed = horaStr.trim();
  if (!trimmed) return null;
  const match = trimmed.match(/^(\d{1,2}):(\d{2})/);
  if (match) {
    const h = match[1].padStart(2, "0");
    const m = match[2];
    return `${h}:${m}`;
  }
  return trimmed;
}

function normalizarNomeDia(diaStr) {
  if (!diaStr) return "";
  const limpo = String(diaStr).trim().toUpperCase();
  return MAPA_DIAS[limpo] || diaStr;
}

function formatarHorarios(horariosAPI) {
  if (!Array.isArray(horariosAPI) || horariosAPI.length === 0) return MOCK_HORARIOS;

  const lista = horariosAPI.map((h) => {
    const rawDia = h.dia_semana || h.dia || h.diaSemana || h.dia_da_semana || "";
    const dia = normalizarNomeDia(rawDia);
    const rawAbre = h.abre || h.hora_abertura || h.abertura || h.hora_inicio || h.inicio || h.open;
    const rawFecha = h.fecha || h.hora_fechamento || h.fechamento || h.hora_fim || h.fim || h.close;
    const abre = formatarHora(rawAbre);
    const fecha = formatarHora(rawFecha);
    const estaFechado = h.fechado === true || h.aberto === false || !abre || !fecha;

    return {
      dia,
      abre: estaFechado ? null : abre,
      fecha: estaFechado ? null : fecha,
      aberto: !estaFechado,
    };
  });

  return lista.sort((a, b) => {
    const idxA = ORDEM_DIAS.indexOf(a.dia);
    const idxB = ORDEM_DIAS.indexOf(b.dia);
    return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
  });
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
  const agora = new Date();
  const diaHoje = dias[agora.getDay()];
  const hHoje = horarios.find((h) => h.dia === diaHoje);

  if (!hHoje || !hHoje.aberto || !hHoje.abre || !hHoje.fecha) {
    return false;
  }

  const parseMinutos = (horaStr) => {
    if (!horaStr) return null;
    const partes = horaStr.split(":");
    if (partes.length < 2) return null;
    return parseInt(partes[0], 10) * 60 + parseInt(partes[1], 10);
  };

  const minAtual = agora.getHours() * 60 + agora.getMinutes();
  const minAbre = parseMinutos(hHoje.abre);
  const minFecha = parseMinutos(hHoje.fecha);

  if (minAbre === null || minFecha === null) {
    return false;
  }

  if (minAbre <= minFecha) {
    return minAtual >= minAbre && minAtual < minFecha;
  }

  // Turno noturno que passa da meia-noite
  return minAtual >= minAbre || minAtual < minFecha;
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
  const horarios       = formatarHorarios(loja?.horarios || loja?.store?.horarios || loja?.schedules);
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
              loja={loja}
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
