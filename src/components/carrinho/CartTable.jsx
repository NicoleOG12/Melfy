import React, { useMemo } from "react";
import { formatarPreco, imagemProduto } from "../../utils/cartUtils";

export default function CartTable({ sacola, selecionados, carregando, operacao, onToggle, onQuantidade, onRemover }) {
  const grupos = useMemo(() => {
    const result = {};
    //console.log('sacola', sacola)
    sacola.forEach((produto, idx) => {
      const idLoja = produto.loja.id_loja || 0;
      if (!result[idLoja]) {
        result[idLoja] = {
          id_loja: idLoja,
          nomeLoja: produto.loja.nome_loja || "Loja",
          logoLoja: produto.loja.logo_loja || "img/default-loja.png",
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
              const valor = Number.parseFloat(produto.preco_unitario ?? 0);
              const quantidade = Number.parseInt(produto.quantidade ?? 1, 10);

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
                        disabled={Boolean(operacao)}
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
                      <button
                        type="button"
                        onClick={() => onQuantidade(idx, -1)}
                        disabled={Boolean(operacao)}
                        aria-busy={operacao === `quantidade-${idx}`}
                      >
                        {operacao === `quantidade-${idx}` ? <span className="carrinho-spinner" aria-label="Atualizando" /> : <i className="bx bx-minus"></i>}
                      </button>
                      <span>{quantidade}</span>
                      <button
                        type="button"
                        onClick={() => onQuantidade(idx, 1)}
                        disabled={Boolean(operacao)}
                        aria-busy={operacao === `quantidade-${idx}`}
                      >
                        {operacao === `quantidade-${idx}` ? <span className="carrinho-spinner" aria-label="Atualizando" /> : <i className="bx bx-plus"></i>}
                      </button>
                    </div>
                  </td>

                  <td>R$ {formatarPreco(valor * quantidade)}</td>

                  <td>
                    <button
                      type="button"
                      className="remover"
                      onClick={() => onRemover(idx)}
                      disabled={Boolean(operacao)}
                      aria-busy={operacao === `remover-${idx}`}
                    >
                      {operacao === `remover-${idx}` ? <span className="carrinho-spinner" aria-label="Removendo" /> : <i className="bx bx-x"></i>}
                    </button>
                  </td>
                </tr>
              );
            })}
          </React.Fragment>
        ))}
        {carregando && sacola.length === 0 && (
          <tr>
            <td colSpan="5" className="carrinho-loading">Carregando sua sacola...</td>
          </tr>
        )}
        {!carregando && sacola.length === 0 && (
          <tr>
            <td colSpan="5" className="carrinho-loading">Sua sacola está vazia.</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
