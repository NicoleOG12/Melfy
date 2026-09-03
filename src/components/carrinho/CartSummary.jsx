import React from "react";
import { formatarPreco } from "../../utils/cartUtils";

export default function CartSummary({ subtotal, onCheckout }) {
  return (
    <aside>
      <div className="box-finalizar-compra">
        <div className="conteudo">
          <div>
            <span>Subtotal</span>
            <span id="subtotal">R$ {formatarPreco(subtotal)}</span>
          </div>
          <div>
            <span>Taxa de entrega</span>
            <span id="taxa-entrega">Gratuito</span>
          </div>
          <div>
            <button type="button" className="btn-cupom">
              Add cupom de desconto
            </button>
          </div>

          <div className="rodape-total">
            <span>Total</span>
            <span id="total">R$ {formatarPreco(subtotal)}</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="btn-finalizar_compra"
        onClick={onCheckout}
      >
        Finalizar Compra
      </button>
    </aside>
  );
}
