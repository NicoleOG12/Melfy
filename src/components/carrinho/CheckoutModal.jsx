import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  CardNumber,
  ExpirationDate,
  SecurityCode,
  createCardToken,
  getPaymentMethods,
  initMercadoPago,
} from "@mercadopago/sdk-react";
import { formatarPreco } from "../../utils/cartUtils";
import { formatarCPF } from "../../utils/masks";
import MelfySwal from "../../services/melfySwal";
import { useAuth } from "../../context/AuthContext";
import {
  fetchEnderecosAPI,
  criarEnderecoAPI,
  atualizarEnderecoAPI,
  removerEnderecoAPI,
} from "../../services/api";

const MERCADO_PAGO_PUBLIC_KEY = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;
if (MERCADO_PAGO_PUBLIC_KEY) initMercadoPago(MERCADO_PAGO_PUBLIC_KEY);

const MERCADO_PAGO_FIELD_STYLE = {
  color: "#4d3528",
  fontFamily: "inherit",
  fontSize: "15px",
  height: "38px",
  padding: "0 16px",
  placeholderColor: "#806b5b",
};

const STORAGE_KEY = "melfy_endereco_entrega";

const ENDERECO_VAZIO = {
  rua: "",
  numero: "",
  bairro: "",
  cidade: "",
  uf: "",
  cep: "",
};

function carregarEnderecoSalvo() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);

    if (parsed && (parsed.rua || parsed.cidade)) return parsed;
  } catch { }
  return null;
}

function persistirEndereco(end) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(end));
  } catch { }
}

async function buscarEnderecoporCoordenadas(lat, lng) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1&accept-language=pt-BR`;
  const res = await fetch(url, {
    headers: { "Accept-Language": "pt-BR" },
  });
  if (!res.ok) throw new Error("Falha ao buscar endereço");
  const data = await res.json();
  const a = data.address ?? {};
  return {
    rua: a.road ?? a.pedestrian ?? a.footway ?? "",
    numero: a.house_number || "0",
    bairro: a.suburb ?? a.neighbourhood ?? a.quarter ?? a.city_district ?? "",
    cidade: a.city ?? a.town ?? a.village ?? a.municipality ?? "",
    uf: a.state_code?.replace("BR-", "") ?? a.state ?? "",
    cep: (a.postcode ?? "").replace(/\s/g, ""),
  };
}

export default function CheckoutModal({ open, onClose, subtotal, onFinish }) {
  const { usuario } = useAuth();
  const [etapa, setEtapa] = useState(1);

  const [editando, setEditando] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [enderecosLista, setEnderecosLista] = useState([]);
  const [enderecoSelecionadoId, setEnderecoSelecionadoId] = useState(null);
  const [carregandoLista, setCarregandoLista] = useState(false);

  const [endereco, setEndereco] = useState(ENDERECO_VAZIO);
  const [enderecoEdit, setEnderecoEdit] = useState(ENDERECO_VAZIO);
  const [geoStatus, setGeoStatus] = useState("idle");
  const [cartaoAberto, setCartaoAberto] = useState(false);
  const [cep, setCep] = useState("");

  // Dados enviados ao Mercado Pago como identificação do pagador.
  const [metodoPagamento, setMetodoPagamento] = useState("pix"); // "pix" | "cartao"
  const [emailPagador, setEmailPagador] = useState("");
  const [cpfPagador, setCpfPagador] = useState("");
  const [titularCartao, setTitularCartao] = useState("");
  const [paymentMethodId, setPaymentMethodId] = useState("");
  const [paymentMethodError, setPaymentMethodError] = useState("");
  const [secureFieldsReady, setSecureFieldsReady] = useState({
    cardNumber: false,
    expirationDate: false,
    securityCode: false,
  });
  const [enviandoPagamento, setEnviandoPagamento] = useState(false);
  const binRequestId = useRef(0);

  const temCepValido = Boolean(
    (endereco?.cep && endereco.cep.replace(/\D/g, "").length === 8) ||
    (cep && cep.replace(/\D/g, "").length === 8)
  );
  const frete = temCepValido ? 9 : 0;
  const total = subtotal + frete;

  function selecionarEndereco(item) {
    if (!item) return;
    const idItem = item.id || item.id_endereco;
    const norm = {
      id: idItem,
      rua: item.rua || "",
      numero: item.numero || "",
      bairro: item.bairro || "",
      cidade: item.cidade || "",
      uf: item.uf || item.estado || "",
      cep: item.cep || "",
    };
    setEndereco(norm);
    setEnderecoEdit(norm);
    setEnderecoSelecionadoId(idItem);
    setGeoStatus("ok");
    if (norm.cep) {
      setCep(norm.cep);
      setCepStatus("ok");
    }
  }

  // Ao abrir o modal: carrega endereços e preenche os dados do pagador.
  useEffect(() => {
    if (!open) return;
    setEtapa(1);
    setEditando(false);
    setEditandoId(null);
    setCepFormStatus("idle");
    setEmailPagador(usuario?.email || "");
    setCpfPagador(formatarCPF(usuario?.cpf || ""));
    setTitularCartao(usuario?.nome || "");
    setPaymentMethodId("");
    setPaymentMethodError("");
    setSecureFieldsReady({
      cardNumber: false,
      expirationDate: false,
      securityCode: false,
    });

    async function carregar() {
      setCarregandoLista(true);
      let lista = await fetchEnderecosAPI();
      if (!Array.isArray(lista) || lista.length === 0) {
        const salvo = carregarEnderecoSalvo();
        if (salvo) lista = [{ id: salvo.id || 1, ...salvo }];
      }
      setEnderecosLista(lista || []);
      setCarregandoLista(false);

      if (lista && lista.length > 0) {
        const principal = lista.find((a) => a.principal) || lista[0];
        selecionarEndereco(principal);
      } else {
        setEndereco(ENDERECO_VAZIO);
        setEnderecoEdit(ENDERECO_VAZIO);
        setEnderecoSelecionadoId(null);
        setCep("");
        setCepStatus("idle");
        setGeoStatus(navigator.geolocation ? "aguardando" : "erro");
      }
    }

    carregar();
  }, [open, usuario]);

  function solicitarLocalizacao() {
    setGeoStatus("carregando");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const encontrado = await buscarEnderecoporCoordenadas(
            pos.coords.latitude,
            pos.coords.longitude
          );
          setGeoStatus("ok");

          let itemComId = { ...encontrado, id: Date.now() };
          try {
            const res = await criarEnderecoAPI({
              ...encontrado,
              estado: encontrado.uf,
              principal: true,
            });
            const criado = res?.data || res?.address || res;
            if (criado && (criado.id || criado.id_endereco)) {
              itemComId.id = criado.id || criado.id_endereco;
            }
          } catch (apiErr) {
            //console.warn("Aviso ao salvar localização na API:", apiErr);
          }

          setEnderecosLista((prev) => {
            const filtrados = prev.filter(
              (e) => (e.id || e.id_endereco) !== itemComId.id
            );
            return [itemComId, ...filtrados];
          });

          selecionarEndereco(itemComId);
          persistirEndereco(itemComId);
        } catch {
          setGeoStatus("erro");
        }
      },
      () => setGeoStatus("erro"),
      { timeout: 10000, maximumAge: 60000 }
    );
  }

  const [cepStatus, setCepStatus] = useState("idle");
  const [cepFormStatus, setCepFormStatus] = useState("idle");

  async function mudarCep(event) {
    let valor = event.target.value.replace(/\D/g, "");
    if (valor.length > 5) valor = valor.replace(/^(\d{5})(\d)/, "$1-$2");
    setCep(valor);

    if (valor.replace("-", "").length === 8) {
      setCepStatus("carregando");
      try {
        const res = await fetch(
          `https://viacep.com.br/ws/${valor.replace("-", "")}/json/`
        );
        const data = await res.json();
        if (data.erro) throw new Error("CEP não encontrado");

        const novo = {
          rua: data.logradouro ?? "",
          numero: endereco.numero ?? "",
          bairro: data.bairro ?? "",
          cidade: data.localidade ?? "",
          uf: data.uf ?? "",
          cep: valor,
        };
        setEndereco(novo);
        setEnderecoEdit(novo);
        setCepStatus("ok");
      } catch {
        setCepStatus("erro");
      }
    } else {
      setCepStatus("idle");
    }
  }

  async function mudarCepForm(event) {
    let valor = event.target.value.replace(/\D/g, "");
    if (valor.length > 5) valor = valor.replace(/^(\d{5})(\d)/, "$1-$2");
    handleCampoEdit("cep", valor);

    const soDigitos = valor.replace("-", "");
    if (soDigitos.length === 8) {
      setCepFormStatus("carregando");
      try {
        const res = await fetch(`https://viacep.com.br/ws/${soDigitos}/json/`);
        const data = await res.json();
        if (data.erro) throw new Error("não encontrado");
        setEnderecoEdit((prev) => ({
          ...prev,
          cep: valor,
          rua: data.logradouro ?? prev.rua,
          bairro: data.bairro ?? prev.bairro,
          cidade: data.localidade ?? prev.cidade,
          uf: data.uf ?? prev.uf,
        }));
        setCepFormStatus("ok");
      } catch {
        setCepFormStatus("erro");
      }
    } else {
      setCepFormStatus("idle");
    }
  }

  async function salvarEndereco() {
    if (!enderecoEdit.rua || !enderecoEdit.numero) {
      MelfySwal({
        icon: "warning",
        title: "Campos obrigatórios",
        text: "Por favor, preencha ao menos a rua e o número.",
      });
      return;
    }

    const payload = {
      cep: enderecoEdit.cep || "",
      estado: enderecoEdit.uf || enderecoEdit.estado || "",
      cidade: enderecoEdit.cidade || "",
      bairro: enderecoEdit.bairro || "",
      rua: enderecoEdit.rua || "",
      numero: enderecoEdit.numero || "",
      principal: true,
    };

    try {
      let itemSalvo;
      if (editandoId) {
        await atualizarEnderecoAPI(editandoId, payload);
        itemSalvo = { ...enderecoEdit, id: editandoId, uf: payload.estado };
        setEnderecosLista((prev) =>
          prev.map((item) =>
            (item.id || item.id_endereco) === editandoId ? itemSalvo : item
          )
        );
      } else {
        const res = await criarEnderecoAPI(payload);
        const criado = res?.data || res?.address || res;
        const novoId = criado?.id || criado?.id_endereco || Date.now();
        itemSalvo = { ...enderecoEdit, id: novoId, uf: payload.estado };
        setEnderecosLista((prev) => [itemSalvo, ...prev]);
      }

      selecionarEndereco(itemSalvo);
      persistirEndereco(itemSalvo);
      setEditando(false);
      setEditandoId(null);
    } catch (err) {
      console.error("Erro ao salvar endereço:", err);
      MelfySwal({
        icon: "error",
        title: "Erro ao salvar",
        text: err.message || "Não foi possível salvar o endereço.",
      });
    }
  }

  async function excluirEnderecoCard(id, event) {
    if (event) event.stopPropagation();
    const result = await MelfySwal({
      icon: "warning",
      title: "Excluir endereço?",
      text: "Deseja realmente remover este endereço?",
      showCancelButton: true,
      confirmButtonText: "Sim, remover",
      cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;

    try {
      await removerEnderecoAPI(id);
      const filtrados = enderecosLista.filter(
        (item) => (item.id || item.id_endereco) !== id
      );
      setEnderecosLista(filtrados);

      if (enderecoSelecionadoId === id) {
        if (filtrados.length > 0) {
          selecionarEndereco(filtrados[0]);
        } else {
          setEndereco(ENDERECO_VAZIO);
          setEnderecoSelecionadoId(null);
        }
      }
    } catch (err) {
      console.error("Erro ao remover endereço:", err);
      MelfySwal({
        icon: "error",
        title: "Erro ao excluir",
        text: err.message || "Não foi possível remover o endereço.",
      });
    }
  }

  function iniciarEdicaoCard(item, event) {
    if (event) event.stopPropagation();
    const id = item.id || item.id_endereco;
    setEditandoId(id);
    setEnderecoEdit({
      rua: item.rua || "",
      numero: item.numero || "",
      bairro: item.bairro || "",
      cidade: item.cidade || "",
      uf: item.uf || item.estado || "",
      cep: item.cep || "",
    });
    setEditando(true);
  }

  function iniciarNovoEndereco() {
    setEditandoId(null);
    setEnderecoEdit(ENDERECO_VAZIO);
    setEditando(true);
  }

  function cancelarEdicao() {
    setEnderecoEdit(endereco);
    setEditando(false);
    setEditandoId(null);
  }

  function confirmarEndereco() {
    persistirEndereco(endereco);
    setEtapa(2);
  }

  function voltarParaEndereco() {
    setEtapa(1);
  }

  const buscarMetodoPagamento = useCallback(async ({ bin } = {}) => {
    const requestId = ++binRequestId.current;
    setPaymentMethodId("");
    setPaymentMethodError("");
    if (!bin) return;

    try {
      const methods = await getPaymentMethods({ bin });
      if (requestId !== binRequestId.current) return;
      const method = methods?.results?.find((item) =>
        ["credit_card", "debit_card"].includes(item.payment_type_id),
      );
      if (!method?.id) {
        setPaymentMethodError("Não foi possível identificar esta bandeira de cartão.");
        return;
      }
      setPaymentMethodId(method.id);
    } catch {
      if (requestId === binRequestId.current) {
        setPaymentMethodError("Não foi possível validar a bandeira do cartão.");
      }
    }
  }, []);

  const marcarCampoSeguroPronto = useCallback((campo) => {
    setSecureFieldsReady((ready) => ({ ...ready, [campo]: true }));
  }, []);
  const cardNumberPronto = useCallback(
    () => marcarCampoSeguroPronto("cardNumber"),
    [marcarCampoSeguroPronto],
  );
  const expirationDatePronto = useCallback(
    () => marcarCampoSeguroPronto("expirationDate"),
    [marcarCampoSeguroPronto],
  );
  const securityCodePronto = useCallback(
    () => marcarCampoSeguroPronto("securityCode"),
    [marcarCampoSeguroPronto],
  );

  function selecionarPix() {
    binRequestId.current += 1;
    setMetodoPagamento("pix");
    setCartaoAberto(false);
    setPaymentMethodId("");
    setPaymentMethodError("");
    setSecureFieldsReady({
      cardNumber: false,
      expirationDate: false,
      securityCode: false,
    });
  }

  async function pagar(event) {
    event.preventDefault();

    if (enviandoPagamento) return;

    if (!endereco || (!endereco.rua && !endereco.cidade)) {
      MelfySwal({
        icon: "warning",
        title: "Endereço Pendente",
        text: "Por favor, selecione e confirme seu endereço de entrega na etapa anterior.",
      });
      setEtapa(1);
      return;
    }

    const email = emailPagador.trim();
    const cpf = cpfPagador.replace(/\D/g, "");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || cpf.length !== 11) {
      MelfySwal({
        icon: "warning",
        title: "Dados do pagador",
        text: "Informe um e-mail válido e um CPF com 11 dígitos.",
      });
      return;
    }

    const payment = {
      payer: {
        email,
        identification: { type: "CPF", number: cpf },
      },
    };
    const metodo = metodoPagamento === "cartao" ? "CARD" : "PIX";

    if (metodoPagamento === "cartao") {
      if (!MERCADO_PAGO_PUBLIC_KEY) {
        MelfySwal({
          icon: "error",
          title: "Checkout indisponível",
          text: "A chave pública do Mercado Pago não foi configurada.",
        });
        return;
      }

      if (!titularCartao.trim() || !paymentMethodId) {
        MelfySwal({
          icon: "warning",
          title: "Dados do cartão",
          text: paymentMethodError || "Informe os dados do cartão para continuar.",
        });
        return;
      }

      if (!Object.values(secureFieldsReady).every(Boolean)) {
        MelfySwal({
          icon: "warning",
          title: "Cartão ainda carregando",
          text: "Aguarde os campos seguros do Mercado Pago carregarem.",
        });
        return;
      }

      setEnviandoPagamento(true);
      try {
        const cardToken = await createCardToken({
          cardholderName: titularCartao.trim(),
          identificationType: "CPF",
          identificationNumber: cpf,
        });
        if (!cardToken?.id) {
          throw new Error("O Mercado Pago não retornou um token válido para o cartão.");
        }
        payment.token = cardToken.id;
        payment.payment_method_id = paymentMethodId;
        payment.installments = 1;
      } catch (error) {
        setEnviandoPagamento(false);
        MelfySwal({
          icon: "error",
          title: "Não foi possível validar o cartão",
          text: error?.message || "Confira os dados do cartão e tente novamente.",
        });
        return;
      }
    } else {
      setEnviandoPagamento(true);
    }

    try {
      await onFinish({
        id_endereco_entrega: enderecoSelecionadoId || endereco.id,
        metodo,
        payment,
      });
    } finally {
      setEnviandoPagamento(false);
    }
  }

  function handleCampoEdit(campo, valor) {
    setEnderecoEdit((prev) => ({ ...prev, [campo]: valor }));
  }

  function tentarNovamente() {
    solicitarLocalizacao();
  }

  if (!open) return null;

  return (
    <div
      id="modal-compra-buy"
      className="modal-overlay-buy"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal_compra">
        <button
          type="button"
          id="fechar_modal"
          className="fechar_modal"
          onClick={onClose}
        >
          &times;
        </button>

        <img
          className="calda_fofo"
          src="/assents/img/Geral/Vector 3384.svg"
          alt="calda"
        />

        {etapa === 2 && (
          <div className="checkout-voltar">
            <button
              type="button"
              className="btn-voltar-endereco"
              onClick={voltarParaEndereco}
            >
              <i className="fa-solid fa-arrow-left" /> Alterar endereço
            </button>
          </div>
        )}

        <div className="checkout-steps">
          <div className={`checkout-step ${etapa >= 1 ? "ativo" : ""}`}>
            <div className="checkout-step-numero">
              {etapa > 1 ? <i className="fa-solid fa-check" /> : "1"}
            </div>
            <span>Endereço</span>
          </div>
          <div className="checkout-step-linha" />
          <div className={`checkout-step ${etapa >= 2 ? "ativo" : ""}`}>
            <div className="checkout-step-numero">2</div>
            <span>Pagamento</span>
          </div>
        </div>

        {etapa === 1 && (
          <div className="checkout-endereco">
            <h1>Confirmar endereço</h1>

            {editando ? (
              <div className="endereco-form">
                <div className="endereco-form-linha">
                  <div className="endereco-form-grupo flex-2">
                    <label>Rua / Logradouro</label>
                    <input
                      type="text"
                      value={enderecoEdit.rua}
                      onChange={(e) => handleCampoEdit("rua", e.target.value)}
                      placeholder="Rua das Flores"
                    />
                  </div>
                  <div className="endereco-form-grupo flex-1">
                    <label>Número</label>
                    <input
                      type="text"
                      value={enderecoEdit.numero}
                      onChange={(e) =>
                        handleCampoEdit("numero", e.target.value)
                      }
                      placeholder="142"
                    />
                  </div>
                </div>

                <div className="endereco-form-linha">
                  <div className="endereco-form-grupo flex-2">
                    <label>Bairro</label>
                    <input
                      type="text"
                      value={enderecoEdit.bairro}
                      onChange={(e) =>
                        handleCampoEdit("bairro", e.target.value)
                      }
                      placeholder="Jardim Primavera"
                    />
                  </div>
                  <div className="endereco-form-grupo flex-1">
                    <label>CEP</label>
                    <div className="cep-wrapper">
                      <input
                        type="text"
                        className={`cep cep-form${cepFormStatus === "erro" ? " cep-erro" : cepFormStatus === "ok" ? " cep-ok" : ""}`}
                        value={enderecoEdit.cep}
                        onChange={mudarCepForm}
                        placeholder="00000-000"
                        maxLength={9}
                      />
                      <span className="cep-icone">
                        {cepFormStatus === "carregando" && <span className="cep-spinner" />}
                        {cepFormStatus === "ok" && <i className="fa-solid fa-circle-check cep-check" />}
                        {cepFormStatus === "erro" && <i className="fa-solid fa-circle-xmark cep-xmark" />}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="endereco-form-linha">
                  <div className="endereco-form-grupo flex-2">
                    <label>Cidade</label>
                    <input
                      type="text"
                      value={enderecoEdit.cidade}
                      onChange={(e) =>
                        handleCampoEdit("cidade", e.target.value)
                      }
                      placeholder="São Paulo"
                    />
                  </div>
                  <div className="endereco-form-grupo flex-1">
                    <label>UF</label>
                    <input
                      type="text"
                      value={enderecoEdit.uf}
                      onChange={(e) => handleCampoEdit("uf", e.target.value)}
                      placeholder="SP"
                      maxLength={2}
                    />
                  </div>
                </div>

                <div className="endereco-acoes">
                  <button
                    type="button"
                    className="btn-editar-endereco"
                    onClick={cancelarEdicao}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="btn-confirmar-endereco"
                    onClick={salvarEndereco}
                  >
                    <i className="fa-solid fa-floppy-disk" /> Salvar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="enderecos-lista-header">
                  <button
                    type="button"
                    className="btn-obter-geo"
                    onClick={solicitarLocalizacao}
                  >
                    <i className="fa-solid fa-location-crosshairs" />
                    {geoStatus === "carregando"
                      ? "Obtendo GPS..."
                      : "Usar localização atual"}
                  </button>

                  <button
                    type="button"
                    className="btn-novo-endereco-modal"
                    onClick={iniciarNovoEndereco}
                  >
                    <i className="fa-solid fa-plus" /> Adicionar endereço
                  </button>
                </div>

                {geoStatus === "carregando" && (
                  <div className="geo-status carregando">
                    <div className="geo-spinner" />
                    <p>Buscando sua localização atual…</p>
                  </div>
                )}

                {carregandoLista ? (
                  <div className="geo-status carregando">
                    <div className="geo-spinner" />
                    <p>Carregando endereços salvos…</p>
                  </div>
                ) : enderecosLista.length === 0 ? (
                  <div className="geo-permissao">
                    <div className="geo-permissao-icone">
                      <i className="fa-solid fa-location-dot" />
                    </div>
                    <h3>Nenhum endereço encontrado</h3>
                    <p>
                      Use sua localização atual via GPS ou adicione um novo
                      endereço manualmente para entrega.
                    </p>
                    <button
                      type="button"
                      className="btn-permitir-localizacao"
                      onClick={solicitarLocalizacao}
                    >
                      <i className="fa-solid fa-location-crosshairs" />
                      Permitir localização
                    </button>
                    <button
                      type="button"
                      className="btn-preencher-manual"
                      onClick={iniciarNovoEndereco}
                    >
                      Preencher manualmente
                    </button>
                  </div>
                ) : (
                  <div className="enderecos-lista-container">
                    {enderecosLista.map((item) => {
                      const idItem = item.id || item.id_endereco;
                      const isSelecionado = String(idItem) === String(enderecoSelecionadoId);
                      return (
                        <div
                          key={idItem || Math.random()}
                          className={`endereco-card-selectable ${isSelecionado ? "selecionado" : ""
                            }`}
                          onClick={() => selecionarEndereco(item)}
                        >
                          <div className="endereco-card-left">
                            <div className="endereco-card-radio" />
                            <div className="endereco-info">
                              <p className="endereco-linha-principal">
                                {item.rua || "—"}
                                {item.numero ? `, ${item.numero}` : ""}
                              </p>
                              <p className="endereco-linha-secundaria">
                                {item.bairro ? `${item.bairro} — ` : ""}
                                {item.cidade}
                                {item.uf || item.estado
                                  ? `/${item.uf || item.estado}`
                                  : ""}
                              </p>
                              {item.cep && (
                                <p className="endereco-cep">
                                  CEP: {item.cep}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="endereco-card-actions">
                            <button
                              type="button"
                              className="btn-acao-card"
                              title="Editar"
                              onClick={(e) => iniciarEdicaoCard(item, e)}
                            >
                              <i className="fa-solid fa-pen" /> Editar
                            </button>
                            <button
                              type="button"
                              className="btn-acao-card btn-excluir"
                              title="Excluir"
                              onClick={(e) => excluirEnderecoCard(idItem, e)}
                            >
                              <i className="fa-solid fa-trash" /> Excluir
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {enderecoSelecionadoId && (
                  <div className="endereco-acoes" style={{ marginTop: "20px" }}>
                    <button
                      type="button"
                      className="btn-confirmar-endereco"
                      onClick={confirmarEndereco}
                    >
                      Entregar aqui <i className="fa-solid fa-arrow-right" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}


        {etapa === 2 && (
          <>
            <h1>Como deseja pagar?</h1>

            <div className="pay-payer-fields">
              <label>
                E-mail
                <input
                  type="email"
                  autoComplete="email"
                  value={emailPagador}
                  onChange={(event) => setEmailPagador(event.target.value)}
                  required
                />
              </label>
              <label>
                CPF
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={14}
                  value={cpfPagador}
                  onChange={(event) => setCpfPagador(formatarCPF(event.target.value))}
                  required
                />
              </label>
            </div>

            <div className="container_opcao">
              {/* 1. OPÇÃO CARTÃO */}
              <div className={`pay-method-card ${metodoPagamento === "cartao" ? "ativo" : ""}`}>
                <div
                  className="pay-method-header"
                  onClick={() => {
                    setMetodoPagamento("cartao");
                    setCartaoAberto((v) => !v);
                  }}
                >
                  <div className="pay-method-left">
                    <input
                      type="radio"
                      name="metodo_pagamento_radio"
                      checked={metodoPagamento === "cartao"}
                      onChange={() => {
                        setMetodoPagamento("cartao");
                        setCartaoAberto(true);
                      }}
                      className="pay-radio"
                    />
                    <div className="pay-method-icon">
                      <i className="fa-regular fa-credit-card" />
                    </div>
                    <div>
                      <h3 className="titulo">Cartão de crédito ou débito</h3>
                      <p className="pay-subtitle">Pagamento seguro processado pelo Mercado Pago</p>
                    </div>
                  </div>
                  <i className={`fa-solid fa-angle-${cartaoAberto || metodoPagamento === "cartao" ? "down" : "right"}`} />
                </div>

                {(cartaoAberto || metodoPagamento === "cartao") && (
                  <div className="pay-card-body">
                    {MERCADO_PAGO_PUBLIC_KEY ? (
                      <div className="pay-new-card-form">
                        <div className="pay-form-header">
                          <h4>Dados do cartão</h4>
                        </div>

                        <div className="inserir_dados">
                          <label className="pay-secure-field">
                            Número do cartão
                            <div className="pay-secure-field-frame">
                              <CardNumber
                                placeholder="0000 0000 0000 0000"
                                style={MERCADO_PAGO_FIELD_STYLE}
                                onBinChange={buscarMetodoPagamento}
                                onReady={cardNumberPronto}
                              />
                            </div>
                          </label>

                          <label>
                            Nome impresso no cartão
                            <input
                              type="text"
                              autoComplete="cc-name"
                              value={titularCartao}
                              onChange={(event) => setTitularCartao(event.target.value)}
                              required
                            />
                          </label>

                          <div className="pay-secure-fields-row">
                            <label className="pay-secure-field">
                              Validade
                              <div className="pay-secure-field-frame">
                                <ExpirationDate
                                  placeholder="MM/AA"
                                  style={MERCADO_PAGO_FIELD_STYLE}
                                  onReady={expirationDatePronto}
                                />
                              </div>
                            </label>
                            <label className="pay-secure-field">
                              Código de segurança
                              <div className="pay-secure-field-frame">
                                <SecurityCode
                                  placeholder="CVV"
                                  style={MERCADO_PAGO_FIELD_STYLE}
                                  onReady={securityCodePronto}
                                />
                              </div>
                            </label>
                          </div>
                        </div>
                        {paymentMethodError && (
                          <p className="pay-card-error" role="alert">
                            {paymentMethodError}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="pay-card-error" role="alert">
                        Configure VITE_MERCADOPAGO_PUBLIC_KEY para habilitar pagamento com cartão.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* 2. OPÇÃO PIX */}
              <div
                className={`pay-method-card ${metodoPagamento === "pix" ? "ativo" : ""}`}
                onClick={selecionarPix}
              >
                <div className="pay-method-header">
                  <div className="pay-method-left">
                    <input
                      type="radio"
                      name="metodo_pagamento_radio"
                      checked={metodoPagamento === "pix"}
                      onChange={selecionarPix}
                      className="pay-radio"
                    />
                    <div className="pay-method-icon pix-icon">
                      <i className="fa-solid fa-qrcode" />
                    </div>
                    <div>
                      <h3 className="titulo">Pix</h3>
                      <p className="pay-subtitle">Aprovação imediata via QR Code ou Copia e Cola</p>
                    </div>
                  </div>
                  <span className="pix-badge-tag">Rápido & Seguro</span>
                </div>
              </div>
            </div>

            <form className="info" onSubmit={pagar}>
              <div className="subs">
                <div className="conteudo_pagamento">
                  <div className="titulo_btn">
                    <h4 className="titulo_menor">Endereço de Entrega</h4>
                  </div>

                  <div className="endereco-resumo-checkout">
                    {endereco.rua ? (
                      <>
                        <p className="endereco-resumo-rua">
                          <i className="fa-solid fa-location-dot" />{" "}
                          <strong>
                            {endereco.rua}
                            {endereco.numero ? `, ${endereco.numero}` : ""}
                          </strong>
                        </p>
                        <p className="endereco-resumo-detalhes">
                          {endereco.bairro ? `${endereco.bairro} — ` : ""}
                          {endereco.cidade}
                          {endereco.uf ? `/${endereco.uf}` : ""}
                        </p>
                        {(endereco.cep || cep) && (
                          <p className="endereco-resumo-cep">
                            CEP: <span>{endereco.cep || cep}</span>
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="endereco-resumo-vazio">
                        Nenhum endereço selecionado na etapa anterior.
                      </p>
                    )}
                  </div>

                  <div className="dados">
                    <span>Valor do frete:</span>
                    <span id="valor-frete">R$ {formatarPreco(frete)}</span>
                  </div>
                </div>
              </div>

              <div className="subs">
                <div className="conteudo_pagamento">
                  <div>
                    <span>Subtotal</span>
                    <span id="subtotal-modal">
                      R$ {formatarPreco(subtotal)}
                    </span>
                  </div>
                  <div>
                    <span>Frete</span>
                    <span id="taxa-entrega-modal">
                      R$ {formatarPreco(frete)}
                    </span>
                  </div>
                  <div style={{ fontWeight: "bold" }}>
                    <span>Total</span>
                    <span id="total-modal">R$ {formatarPreco(total)}</span>
                  </div>
                  <button type="submit" className="btn-compra" disabled={enviandoPagamento}>
                    {enviandoPagamento ? "Processando..." : "Pagar"}
                  </button>
                </div>
              </div>
            </form>

          </>
        )}
      </div>
    </div>
  );
}
