import { useState } from "react";

export function useEnderecos(showToast) {
  const [enderecos, setEnderecos] = useState(() => {
    const salvos = localStorage.getItem("enderecosCliente");
    if (salvos) {
      try { return JSON.parse(salvos); } catch {}
    }
    return [];
  });

  const [modalEndereco, setModalEndereco] = useState(false);
  const [formEndereco, setFormEndereco] = useState({
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
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
            cidade: `${data.localidade} / ${data.uf}`,
          }));
        }
      } catch (err) {
        console.error("Erro ao buscar CEP:", err);
      }
    }
  }

  function salvarEndereco() {
    if (!formEndereco.rua || !formEndereco.numero) {
      showToast("Preencha ao menos Rua e Número!");
      return;
    }
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

  return {
    enderecos,
    modalEndereco,
    setModalEndereco,
    formEndereco,
    setFormEndereco,
    handleBuscarCep,
    salvarEndereco,
    removerEndereco,
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
