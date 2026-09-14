import { useState, useEffect } from "react";
import { formatarCPF, formatarCelular, dataISO } from "../utils/masks";
import {
  fetchUsuarioMe,
  atualizarPerfilAPI,
  atualizarFotoPerfilAPI,
} from "../services/api";

const DEFAULT_FOTO = "/assents/img/Geral/Perfil.png";

function aplicarUsuarioNoEstado(usuarioAtual, setters) {
  if (!usuarioAtual) return;

  const {
    setNome,
    setSobrenome,
    setCpf,
    setDataNascimento,
    setEmail,
    setCelular,
    setFoto,
  } = setters;

  const nomeCompleto = usuarioAtual.nome || usuarioAtual.nome_loja || "";
  const partes = nomeCompleto.trim().split(" ");

  setNome(partes[0] || "");
  setSobrenome(partes.slice(1).join(" ") || "");
  setEmail(usuarioAtual.email || "");
  setCpf(usuarioAtual.cpf ? formatarCPF(usuarioAtual.cpf) : "");

  const dataNasc = usuarioAtual.data_nasc || usuarioAtual.dataNascimento || "";
  setDataNascimento(dataISO(dataNasc));

  const telefone = usuarioAtual.telefone || usuarioAtual.celular || "";
  setCelular(telefone ? formatarCelular(telefone) : "");

  const foto =
    usuarioAtual.pfp ||
    usuarioAtual.foto ||
    usuarioAtual.imagem ||
    DEFAULT_FOTO;
  setFoto(foto);
}

export function usePerfilUsuario() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [cpf, setCpf] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [email, setEmail] = useState("");
  const [celular, setCelular] = useState("");
  const [foto, setFoto] = useState(DEFAULT_FOTO);
  const [fotoArquivo, setFotoArquivo] = useState(null);
  const [perfilOriginal, setPerfilOriginal] = useState(null);

  async function carregarPerfil() {
    try {
      const usuarioAtual = await fetchUsuarioMe();
      aplicarUsuarioNoEstado(usuarioAtual, {
        setNome,
        setSobrenome,
        setCpf,
        setDataNascimento,
        setEmail,
        setCelular,
        setFoto,
      });

      const nomeCompleto = [usuarioAtual.nome, usuarioAtual.nome_loja]
        .filter(Boolean)
        .join(" ")
        .trim();
      const telefoneOriginal =
        usuarioAtual.telefone || usuarioAtual.celular || "";
      const dataNascOriginal =
        usuarioAtual.data_nasc || usuarioAtual.dataNascimento || "";

      setPerfilOriginal({
        nomeCompleto,
        email: usuarioAtual.email || "",
        telefone: telefoneOriginal,
        data_nasc: dataNascOriginal,
      });
      setFotoArquivo(null);
    } catch {
      setNome("");
      setSobrenome("");
      setCpf("");
      setDataNascimento("");
      setEmail("");
      setCelular("");
      setFoto(DEFAULT_FOTO);
      setFotoArquivo(null);
      setPerfilOriginal(null);
    }
  }

  useEffect(() => {
    void carregarPerfil();
  }, []);

  function cancelarEdicao() {
    setIsEditing(false);
    setFotoArquivo(null);
    void carregarPerfil();
  }

  async function toggleEdicao() {
    if (!isEditing) {
      setIsEditing(true);
      return null;
    }

    setIsSaving(true);

    try {
      const nomeCompleto = `${nome} ${sobrenome}`.trim();
      const telefoneLimpo = celular.replace(/\D/g, "");

      let dataISOnorm = dataNascimento;
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(dataNascimento)) {
        const [d, m, a] = dataNascimento.split("/");
        dataISOnorm = `${a}-${m}-${d}`;
      }

      const dadosPessoa = {
        nome: nomeCompleto,
        telefone: telefoneLimpo || "",
        data_nasc: dataISOnorm || "",
        email,
      };

      const perfilOriginalAtual = perfilOriginal || {};
      const mudouDadosPessoais =
        dadosPessoa.nome !== (perfilOriginalAtual.nomeCompleto || "") ||
        dadosPessoa.email !== (perfilOriginalAtual.email || "") ||
        dadosPessoa.telefone !== (perfilOriginalAtual.telefone || "") ||
        dadosPessoa.data_nasc !== (perfilOriginalAtual.data_nasc || "");

      if (mudouDadosPessoais) {
        await atualizarPerfilAPI(dadosPessoa);
      }

      if (fotoArquivo) {
        await atualizarFotoPerfilAPI(fotoArquivo);
      }

      await carregarPerfil();
      setIsEditing(false);
      return "Dados atualizados com sucesso!";
    } catch (err) {
      throw err;
    } finally {
      setIsSaving(false);
    }
  }

  return {
    isEditing,
    isSaving,
    nome,
    setNome,
    sobrenome,
    setSobrenome,
    cpf,
    setCpf,
    dataNascimento,
    setDataNascimento,
    email,
    setEmail,
    celular,
    setCelular,
    foto,
    setFoto,
    fotoArquivo,
    setFotoArquivo,
    nomeExibir: `${nome} ${sobrenome}`.trim() || "Usuário",
    toggleEdicao,
    cancelarEdicao,
  };
}
