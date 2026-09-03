import React, { useMemo } from "react";
import { formatarPreco, imagemProduto } from "../../utils/cartUtils";

export default function CartTable({ sacola, selecionados, onToggle, onQuantidade, onRemover }) {
  const grupos = useMemo(() => {
    const result = {};
    sacola.forEach((produto, idx) => {
      const idLoja = produto.id_loja || 0;
      if (!result[idLoja]) {
        result[idLoja] = {
          id_loja: idLoja,
          nomeLoja: produto.nomeLoja || "Loja",
          logoLoja: produto.logoLoja || "img/default-loja.png",
          itens: [],
        };
      }
      result[idLoja].itens.push({ produto, idx });
    });
    return Object.values(result);
  }, [sacola]);

  return (
    <table>
      <thead>
        <tr>
          <th>Produto</th>
          <th>Preço</th>
          <th>Quantidade</th>
          <th>Total</th>
          <th>-</th>
        </tr>
      </thead>

      <tbody id="tabela-carrinho">
        {grupos.map((loja, grupoIndex) => (
          <React.Fragment key={String(loja.id_loja)}>
            {grupoIndex > 0 && (
              <tr className="linha-separadora">
                <td colSpan="5" className="td-separador"></td>
              </tr>
            )}

            {loja.itens.map(({ produto, idx }) => {
              const valor = Number.parseFloat(produto.valor_uni ?? produto.valorUnitario ?? produto.preco ?? 0);
              const quantidade = Number.parseInt(produto.quantidade ?? produto.qtd ?? 1, 10);

              return (
                <tr
                  className="linha-produto"
                  key={produto.id_item_carrinho ?? `${produto.id_produto ?? produto.id}-${idx}`}
                >
                  <td>
                    <div className="produto">
                      <input
                        type="checkbox"
                        className="check-produto"
                        checked={selecionados.has(idx)}
                        onChange={() => onToggle(idx)}
                        data-index={idx}
                        data-id_loja={loja.id_loja}
                      />
                      <img
                        src={imagemProduto(produto)}
                        alt={produto.nome}
                        className="foto-produto"
                      />
                      <div className="info">
                        <h3>{produto.nome}</h3>
                      </div>
                    </div>
                  </td>

                  <td>R$ {formatarPreco(valor)}</td>

                  <td>
                    <div className="qtd">
                      <button type="button" onClick={() => onQuantidade(idx, -1)}>
                        <i className="bx bx-minus"></i>
                      </button>
                      <span>{quantidade}</span>
                      <button type="button" onClick={() => onQuantidade(idx, 1)}>
                        <i className="bx bx-plus"></i>
                      </button>
                    </div>
                  </td>

                  <td>R$ {formatarPreco(valor * quantidade)}</td>

                  <td>
                    <button
                      type="button"
                      className="remover"
                      onClick={() => onRemover(idx)}
                    >
                      <i className="bx bx-x"></i>
                    </button>
                  </td>
                </tr>
              );
            })}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
}
