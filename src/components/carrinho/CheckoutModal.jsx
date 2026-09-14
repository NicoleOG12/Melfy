import React, { useState, useEffect } from "react";
import { formatarPreco } from "../../utils/cartUtils";
import MelfySwal from "../../services/melfySwal";
import {
  fetchEnderecosAPI,
  criarEnderecoAPI,
  atualizarEnderecoAPI,
  removerEnderecoAPI,
} from "../../services/api";

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

  const frete = cep.length === 9 ? 9 : 0;
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

  // Ao abrir o modal: carrega endereços da API
  useEffect(() => {
    if (!open) return;
    setEtapa(1);
    setEditando(false);
    setEditandoId(null);
    setCepFormStatus("idle");

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
  }, [open]);

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

  function pagar(event) {
    event.preventDefault();
    if (!cep || cep.length !== 9) {
      MelfySwal({
        icon: "warning",
        title: "CEP Inválido",
        text: "Por favor, preencha um CEP válido (XXXXX-XX).",
      });
      return;
    }
    const dadosCheckout = {
      id_endereco_entrega: enderecoSelecionadoId || endereco.id || 1,
      tipo_pagamento: "PIX",
      methods: ["PIX"],
    };
    onFinish(dadosCheckout);
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

            <div className="container_opcao">
              <button
                type="button"
                className="opcaoC"
                id="btn_cartao"
                onClick={() => setCartaoAberto((v) => !v)}
              >
                <h3 className="titulo">Cartão</h3>
                <i
                  className={`fa-solid fa-angle-${cartaoAberto ? "down" : "right"
                    }`}
                />
              </button>

              <div
                id="modal_cartao"
                className="modal_tipo"
                style={{ height: cartaoAberto ? "auto" : 0 }}
              >
                <div className="subtitulo">
                  <h2 className="tipo_cartao">Visa - Crédito</h2>
                  <input className="selecionar" type="checkbox" />
                </div>

                <div className="inserir_dados">
                  <input className="nome" type="text" placeholder="Nome" />
                  <input
                    className="numero"
                    type="text"
                    placeholder="Número"
                  />

                  <div className="subdados">
                    <input type="date" placeholder="Data" />
                    <input type="text" placeholder="CVV" />
                  </div>

                  <div className="tipos_add">
                    <div className="cartao_tipos">
                      <label className="cartao">
                        <input type="radio" name="tipo_cartao" value="debito" />
                        <span>Débito</span>
                      </label>
                      <label className="cartao">
                        <input type="radio" name="tipo_cartao" value="credito" />
                        <span>Crédito</span>
                      </label>
                    </div>
                    <button type="button" className="btn_add">
                      ADICIONAR
                    </button>
                  </div>
                </div>
              </div>

              <button type="button" className="opcaoP" id="btn_pix">
                <h3 className="titulo">Pix</h3>
                <input className="selecionar" type="checkbox" />
              </button>
            </div>

            <form className="info" onSubmit={pagar}>
              <div className="subs">
                <div className="conteudo_pagamento">
                  <div className="titulo_btn">
                    <h4 className="titulo_menor">Calcule o frete</h4>
                  </div>

                  <div className="cep-wrapper">
                    <input
                      type="text"
                      className={`cep${cepStatus === "erro" ? " cep-erro" : cepStatus === "ok" ? " cep-ok" : ""}`}
                      placeholder="00000-000"
                      maxLength="9"
                      value={cep}
                      onChange={mudarCep}
                    />
                    <span className="cep-icone">
                      {cepStatus === "carregando" && (
                        <span className="cep-spinner" />
                      )}
                      {cepStatus === "ok" && (
                        <i className="fa-solid fa-circle-check cep-check" />
                      )}
                      {cepStatus === "erro" && (
                        <i className="fa-solid fa-circle-xmark cep-xmark" />
                      )}
                    </span>
                  </div>

                  {cepStatus === "ok" && (
                    <p className="cep-feedback ok">
                      <i className="fa-solid fa-location-dot" />
                      {endereco.rua ? `${endereco.rua}, ` : ""}
                      {endereco.bairro ? `${endereco.bairro} — ` : ""}
                      {endereco.cidade}{endereco.uf ? `/${endereco.uf}` : ""}
                    </p>
                  )}
                  {cepStatus === "erro" && (
                    <p className="cep-feedback erro">
                      <i className="fa-solid fa-triangle-exclamation" />
                      CEP não encontrado. Verifique e tente novamente.
                    </p>
                  )}

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
                  <button type="submit" className="btn-compra">
                    Pagar
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
