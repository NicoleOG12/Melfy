import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchLoja, fetchProdutosPorLoja } from "../services/api";

export function useLojaPage() {
  const { id } = useParams();
  const [loja, setLoja] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setErro(null);

    Promise.all([fetchLoja(id), fetchProdutosPorLoja(id)])
      .then(([lojaData, produtosData]) => {
        setLoja(lojaData);
        setProdutos(produtosData);
      })
      .catch((err) => {
        console.error(err);
        setErro("Não foi possível carregar os dados da loja.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  return { loja, produtos, loading, erro, id };
}
