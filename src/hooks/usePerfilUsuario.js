import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { formatarCPF, formatarCelular, dataISO } from "../utils/masks";

export function usePerfilUsuario() {
  const { usuario } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [nome, setNome] = useState("Laura");
  const [sobrenome, setSobrenome] = useState("C.");
  const [cpf, setCpf] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [email, setEmail] = useState("");
  const [celular, setCelular] = useState("");
  const [foto, setFoto] = useState("/assents/img/Geral/Perfil.png");

  useEffect(() => {
    const usuarioLogadoJSON = localStorage.getItem("infoCliente");
    const confeiteiraLogadaJSON = localStorage.getItem("confeiteiraLogada");
    const userStorageJSON = localStorage.getItem("usuarioLogado");

    let usuarioAtual = null;
    if (usuarioLogadoJSON) {
      try {
        const parsed = JSON.parse(usuarioLogadoJSON);
        usuarioAtual = Array.isArray(parsed) ? parsed[0] : parsed;
      } catch {}
    } else if (confeiteiraLogadaJSON) {
      try { usuarioAtual = JSON.parse(confeiteiraLogadaJSON); } catch {}
    } else if (userStorageJSON) {
      try { usuarioAtual = JSON.parse(userStorageJSON); } catch {}
    } else if (usuario) {
      usuarioAtual = usuario;
    }

    if (usuarioAtual) {
      const nomeCompleto =
        usuarioAtual.nome || usuarioAtual.nome_loja || "Laura C.";
      const partes = nomeCompleto.trim().split(" ");
      setNome(partes[0] || "");
      setSobrenome(partes.slice(1).join(" ") || "");
      setEmail(usuarioAtual.email || "");
      if (usuarioAtual.cpf) setCpf(formatarCPF(usuarioAtual.cpf));
      if (usuarioAtual.data_nasc || usuarioAtual.dataNascimento) {
        setDataNascimento(
          dataISO(usuarioAtual.data_nasc || usuarioAtual.dataNascimento)
        );
      }
      if (usuarioAtual.telefone || usuarioAtual.celular) {
        setCelular(
          formatarCelular(usuarioAtual.telefone || usuarioAtual.celular)
        );
      }
      if (usuarioAtual.pfp || usuarioAtual.foto || usuarioAtual.imagem) {
        setFoto(
          usuarioAtual.pfp || usuarioAtual.foto || usuarioAtual.imagem
        );
      }
    }
  }, [usuario]);

  function toggleEdicao() {
    if (isEditing) {
      const usuarioLogadoJSON = localStorage.getItem("infoCliente");
      let current = {};
      if (usuarioLogadoJSON) {
        try {
          const parsed = JSON.parse(usuarioLogadoJSON);
          current = Array.isArray(parsed) ? parsed[0] : parsed;
        } catch {}
      }

      const usuarioAtualizado = {
        ...current,
        nome: `${nome} ${sobrenome}`.trim(),
        email,
        telefone: celular,
        cpf,
        data_nasc: dataNascimento,
      };

      if (
        usuarioLogadoJSON &&
        Array.isArray(JSON.parse(usuarioLogadoJSON))
      ) {
        localStorage.setItem(
          "infoCliente",
          JSON.stringify([usuarioAtualizado])
        );
      } else {
        localStorage.setItem(
          "infoCliente",
          JSON.stringify(usuarioAtualizado)
        );
      }
      localStorage.setItem("usuarioLogado", JSON.stringify(usuarioAtualizado));
      setIsEditing(false);
      return "Dados atualizados com sucesso!";
    } else {
      setIsEditing(true);
      return null;
    }
  }

  return {
    isEditing,
    nome, setNome,
    sobrenome, setSobrenome,
    cpf, setCpf,
    dataNascimento, setDataNascimento,
    email, setEmail,
    celular, setCelular,
    foto, setFoto,
    nomeExibir: `${nome} ${sobrenome}`.trim() || "Laura C.",
    toggleEdicao,
  };
}
