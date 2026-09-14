import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchLoja, fetchProdutosPorLoja } from "../services/api";

export function useLojaPage() {
  const { id } = useParams();
  const [loja, setLoja] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [rating, setRating] = useState({ media: 0, total_avaliacoes: 0 });
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setErro(null);

    fetchLoja(id)
      .then(async (data) => {
        if (!data) throw new Error("Loja não encontrada");

        const storeObj = data.store ?? data;
        let prods =
          Array.isArray(data.produtos) && data.produtos.length > 0
            ? data.produtos
            : await fetchProdutosPorLoja(id);

        console.log(prods);

        setLoja(storeObj);
        setProdutos(prods || []);
        setRating(
          data.rating || storeObj.rating || { media: 5, total_avaliacoes: 0 },
        );
      })
      .catch((err) => {
        console.error("Erro ao carregar detalhes da loja:", err);
        setErro("Não foi possível carregar os dados da loja.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  return { loja, produtos, rating, loading, erro, id };
}
