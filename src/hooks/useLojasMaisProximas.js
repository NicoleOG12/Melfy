import { useState, useEffect } from "react";
import { fetchLojas } from "../services/api";
import { API_URL } from "../constants/api";

// Cache em memória — só armazena valores válidos (nunca null)
const cepCoordCache = {};
const lojaCepCache  = {};

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

async function fetchComRetry(url, options = {}, tentativas = 4) {
  for (let i = 0; i < tentativas; i++) {
    const res = await fetch(url, options);
    if (res.status === 429) {
      await sleep(1200 * (i + 1));
      continue;
    }
    return res;
  }
  return null;
}

async function getLojaCep(loja) {
  if (!loja) return null;
  const idLoja = loja.id_loja || loja.idLoja || loja.id;
  if (!idLoja) return null;

  // 1. Verifica se já está no objeto da loja
  if (Array.isArray(loja.enderecos) && loja.enderecos[0]?.cep) {
    const cep = String(loja.enderecos[0].cep).trim();
    if (cep) {
      lojaCepCache[idLoja] = cep;
      return cep;
    }
  }
  if (loja.cep) {
    const cep = String(loja.cep).trim();
    if (cep) {
      lojaCepCache[idLoja] = cep;
      return cep;
    }
  }

  // 2. Só usa cache se tiver um valor positivo
  if (lojaCepCache[idLoja]) return lojaCepCache[idLoja];

  try {
    const cachedStorage = sessionStorage.getItem(`melfy_loja_cep_${idLoja}`);
    if (cachedStorage) {
      lojaCepCache[idLoja] = cachedStorage;
      return cachedStorage;
    }
  } catch {}

  // 3. Busca detalhes da loja apenas se não tiver endereço
  try {
    const res = await fetchComRetry(`${API_URL}/stores/${idLoja}`, {}, 2);
    if (!res || !res.ok) return null;
    const data = await res.json();
    const enderecos = data?.data?.store?.enderecos ?? data?.data?.enderecos ?? [];
    const cep = Array.isArray(enderecos) && enderecos[0]?.cep
      ? String(enderecos[0].cep).trim()
      : null;
    if (cep) {
      lojaCepCache[idLoja] = cep;
      try {
        sessionStorage.setItem(`melfy_loja_cep_${idLoja}`, cep);
      } catch {}
    }
    return cep;
  } catch {
    return null;
  }
}

async function getCepCoords(cep) {
  const key = cep.replace(/\D/g, "");
  if (cepCoordCache[key]) return cepCoordCache[key];

  try {
    const url = `https://nominatim.openstreetmap.org/search?postalcode=${key}&country=BR&format=json&limit=1`;
    const res = await fetch(url, { headers: { "Accept-Language": "pt-BR" } });
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      const coords = { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
      cepCoordCache[key] = coords;
      return coords;
    }
  } catch {
    // ignora falha individual
  }
  return null;
}

function getUserLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => resolve(null),
      { timeout: 8000 }
    );
  });
}

// Executa tarefas em lotes de `size` com `delayMs` entre lotes
async function batchRun(tasks, size, delayMs) {
  const results = [];
  for (let i = 0; i < tasks.length; i += size) {
    const lote = tasks.slice(i, i + size);
    const loteResults = await Promise.all(lote.map((fn) => fn()));
    results.push(...loteResults);
    if (i + size < tasks.length) await sleep(delayMs);
  }
  return results;
}

export function useLojasMaisProximas() {
  const [lojas, setLojas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationDenied, setLocationDenied] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        setLoading(true);

        // 1. Busca lojas e localização em paralelo com fallback seguro
        const [todasLojas, userCoords] = await Promise.all([
          fetchLojas().catch((err) => {
            console.warn("Não foi possível buscar lojas:", err);
            return [];
          }),
          getUserLocation().catch(() => null),
        ]);

        if (cancelled) return;

        const listaLojas = Array.isArray(todasLojas) ? todasLojas : [];

        // Exibe as lojas imediatamente (sem distância)
        setLojas(listaLojas);

        if (!listaLojas.length || !userCoords) {
          if (!userCoords) setLocationDenied(true);
          setLoading(false);
          return;
        }

        // 2. Busca CEPs das lojas (aproveita cache e objeto loja)
        const ceps = await batchRun(
          listaLojas.map((loja) => () => getLojaCep(loja)),
          3,
          400
        );

        if (cancelled) return;

        // 3. Deduplica CEPs para geocodificar o mínimo possível
        const cepsUnicos = [...new Set(ceps.filter(Boolean))];

        // 4. Geocodifica em lotes de 3 com 1.1s entre lotes (rate limit Nominatim)
        if (cepsUnicos.length > 0) {
          await batchRun(
            cepsUnicos.map((cep) => () => getCepCoords(cep)),
            3,
            1100
          );
        }

        if (cancelled) return;

        // 5. Monta resultado final com distâncias e reordena
        const lojasComDist = listaLojas.map((loja, i) => {
          const cep    = ceps[i];
          const coords = cep ? cepCoordCache[cep.replace(/\D/g, "")] : null;
          const distKm = coords
            ? haversineKm(userCoords.lat, userCoords.lon, coords.lat, coords.lon)
            : Infinity;
          return { ...loja, distKm };
        });

        if (cancelled) return;

        lojasComDist.sort((a, b) => a.distKm - b.distKm);
        setLojas(lojasComDist);
      } catch (err) {
        console.warn("Erro no cálculo de lojas mais próximas:", err);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    run();
    return () => { cancelled = true; };
  }, []);

  return { lojas, loading, locationDenied };
}
