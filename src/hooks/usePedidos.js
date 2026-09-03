import { useState, useCallback, useMemo, useEffect } from "react";
import { fetchPedidos, fetchProdutos, fetchLojas } from "../services/api";
import { PAGE_SIZE, normalize, date, finished } from "../utils/orderUtils";

export function usePedidos() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updated, setUpdated] = useState(null);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const load = useCallback(
    async (firstLoad = false) => {
      try {
        if (firstLoad) setLoading(true);
        setError("");

        const token = localStorage.getItem("tokenCliente");

        const [p, s, o] = await Promise.all([
          products.length ? Promise.resolve(products) : fetchProdutos().catch(() => []),
          stores.length ? Promise.resolve(stores) : fetchLojas().catch(() => []),
          fetchPedidos(token),
        ]);

        if (!products.length) setProducts(p);
        if (!stores.length) setStores(s);

        const normalized = o
          .map((x) => normalize(x, p, s))
          .sort(
            (a, b) =>
              (date(b.created)?.getTime() || 0) -
              (date(a.created)?.getTime() || 0)
          );

        setOrders(normalized);
        setUpdated(new Date());
      } catch (e) {
        setError(e.message || "Não foi possível carregar seus pedidos.");
      } finally {
        setLoading(false);
      }
    },
    [products, stores]
  );

  useEffect(() => {
    load(true);
    const timer = setInterval(() => load(false), 5000);
    const focus = () => load(false);
    window.addEventListener("focus", focus);
    return () => {
      clearInterval(timer);
      window.removeEventListener("focus", focus);
    };
  }, [load]);

  const active = useMemo(() => orders.filter((o) => !finished(o)), [orders]);
  const history = useMemo(() => orders.filter(finished), [orders]);

  return {
    loading,
    error,
    updated,
    active,
    history,
    visible,
    setVisible,
    load,
  };
}
