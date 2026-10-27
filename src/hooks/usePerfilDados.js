import { useState } from "react";

// Siglas de estados brasileiros válidos
const ESTADOS_VALIDOS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG",
  "PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
];

function validarEndereco(form) {
  const erros = {};

  // CEP: obrigatório, 8 dígitos numéricos
  const cepLimpo = (form.cep || "").replace(/\D/g, "");
  if (!cepLimpo) {
    erros.cep = "CEP é obrigatório";
  } else if (cepLimpo.length !== 8) {
    erros.cep = "CEP inválido — informe 8 dígitos";
  }

  // Rua: obrigatória, não pode ser só números
  const ruaTrim = (form.rua || "").trim();
  if (!ruaTrim) {
    erros.rua = "Rua é obrigatória";
  } else if (/^\d+$/.test(ruaTrim)) {
    erros.rua = "Rua inválida — informe um logradouro";
  }

  // Número: obrigatório, numérico e positivo
  const numTrim = (form.numero || "").trim();
  if (!numTrim) {
    erros.numero = "Número é obrigatório";
  } else if (!/^\d+$/.test(numTrim)) {
    erros.numero = "Número inválido — informe apenas dígitos";
  } else if (parseInt(numTrim, 10) <= 0) {
    erros.numero = "Número deve ser positivo";
  }

  // Bairro: obrigatório, não pode ser só números
  const bairroTrim = (form.bairro || "").trim();
  if (!bairroTrim) {
    erros.bairro = "Bairro é obrigatório";
  } else if (/^\d+$/.test(bairroTrim)) {
    erros.bairro = "Bairro inválido — informe um nome de bairro";
  }

  // Estado: obrigatório, deve ser sigla válida de UF brasileira
  const estadoUp = (form.estado || "").trim().toUpperCase();
  if (!estadoUp) {
    erros.estado = "Estado é obrigatório";
  } else if (!/^[A-Z]{2}$/.test(estadoUp)) {
    erros.estado = "Estado inválido — informe a sigla (ex: SP)";
  } else if (!ESTADOS_VALIDOS.includes(estadoUp)) {
    erros.estado = "Estado inválido — sigla não reconhecida";
  }

  // Cidade: obrigatória, não pode ser só números
  const cidadeTrim = (form.cidade || "").trim();
  if (!cidadeTrim) {
    erros.cidade = "Cidade é obrigatória";
  } else if (/^\d+$/.test(cidadeTrim)) {
    erros.cidade = "Cidade inválida — informe um nome de cidade";
  }

  return erros;
}

export function useEnderecos(showToast) {
  const [enderecos, setEnderecos] = useState(() => {
    const salvos = localStorage.getItem("enderecosCliente");
    if (salvos) {
      try { return JSON.parse(salvos); } catch {}
    }
    return [];
  });

  const [modalEndereco, setModalEndereco] = useState(false);
  const [errosEndereco, setErrosEndereco] = useState({});
  const [formEndereco, setFormEndereco] = useState({
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    estado: "",
    cidade: "",
  });

  async function handleBuscarCep(cep) {
    const limpo = cep.replace(/\D/g, "");
    if (limpo.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${limpo}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setFormEndereco((prev) => ({
            ...prev,
            rua: data.logradouro || "",
            bairro: data.bairro || "",
            cidade: data.localidade || "",
            estado: data.uf || "",
          }));
        }
      } catch (err) {
        console.error("Erro ao buscar CEP:", err);
      }
    }
  }

  function salvarEndereco() {
    const erros = validarEndereco(formEndereco);
    if (Object.keys(erros).length > 0) {
      setErrosEndereco(erros);
      return;
    }
    setErrosEndereco({});
    const lista = [...enderecos, { id: Date.now(), ...formEndereco }];
    setEnderecos(lista);
    localStorage.setItem("enderecosCliente", JSON.stringify(lista));
    setModalEndereco(false);
    setFormEndereco({
      cep: "",
      rua: "",
      numero: "",
      complemento: "",
      bairro: "",
      estado: "",
      cidade: "",
    });
    showToast("Endereço salvo com sucesso!");
  }

  function removerEndereco(id) {
    const filtrados = enderecos.filter((e) => e.id !== id);
    setEnderecos(filtrados);
    localStorage.setItem("enderecosCliente", JSON.stringify(filtrados));
    showToast("Endereço removido!");
  }

  function abrirModalEndereco() {
    setErrosEndereco({});
    setFormEndereco({
      cep: "",
      rua: "",
      numero: "",
      complemento: "",
      bairro: "",
      estado: "",
      cidade: "",
    });
    setModalEndereco(true);
  }

  return {
    enderecos,
    modalEndereco,
    setModalEndereco,
    errosEndereco,
    formEndereco,
    setFormEndereco,
    handleBuscarCep,
    salvarEndereco,
    removerEndereco,
    abrirModalEndereco,
  };
}

export function usePagamentos(showToast) {
  const [pagamentos, setPagamentos] = useState(() => {
    const salvos = localStorage.getItem("pagamentosCliente");
    if (salvos) {
      try { return JSON.parse(salvos); } catch {}
    }
    return [];
  });

  const [modalPagamento, setModalPagamento] = useState(false);
  const [tipoPagamento, setTipoPagamento] = useState("credito");
  const [subBadge, setSubBadge] = useState("Caju");
  const [numCartao, setNumCartao] = useState("");
  const [valCartao, setValCartao] = useState("");
  const [cvvCartao, setCvvCartao] = useState("");
  const [titularCartao, setTitularCartao] = useState("");

  function salvarPagamento() {
    if (!numCartao) {
      showToast("Informe o número do cartão!");
      return;
    }
    const novo = {
      id: Date.now(),
      tipo: tipoPagamento,
      subTipo:
        tipoPagamento === "voucher" || tipoPagamento === "vale"
          ? subBadge
          : null,
      ultimosDigitos: numCartao.replace(/\s/g, "").slice(-4) || "0000",
      titular: titularCartao || "TITULAR",
      validade: valCartao || "12/28",
    };
    const lista = [...pagamentos, novo];
    setPagamentos(lista);
    localStorage.setItem("pagamentosCliente", JSON.stringify(lista));
    setModalPagamento(false);
    setNumCartao("");
    setValCartao("");
    setCvvCartao("");
    setTitularCartao("");
    showToast("Forma de pagamento salva com sucesso!");
  }

  function removerPagamento(id) {
    const filtrados = pagamentos.filter((p) => p.id !== id);
    setPagamentos(filtrados);
    localStorage.setItem("pagamentosCliente", JSON.stringify(filtrados));
    showToast("Forma de pagamento removida!");
  }

  return {
    pagamentos,
    modalPagamento,
    setModalPagamento,
    tipoPagamento,
    setTipoPagamento,
    subBadge,
    setSubBadge,
    numCartao,
    setNumCartao,
    valCartao,
    setValCartao,
    cvvCartao,
    setCvvCartao,
    titularCartao,
    setTitularCartao,
    salvarPagamento,
    removerPagamento,
  };
}
