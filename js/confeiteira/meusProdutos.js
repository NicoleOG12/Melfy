document.addEventListener("DOMContentLoaded", function () { 
    let produtos = JSON.parse(localStorage.getItem('Produtos')) || [];
    let lojas = JSON.parse(localStorage.getItem('Lojas')) || [];
    const idLojaAtual = parseInt(localStorage.getItem('idLojaAtual')); 

    if (produtos.length > 0) {
        const cardsWrapper = document.querySelector('.cards-wrapper');

        const produtosDaLojaLogada = produtos.filter(produto => parseInt(produto.idLoja) === idLojaAtual);

        if (produtosDaLojaLogada.length > 0) {
            produtosDaLojaLogada.forEach(produto => {
                const idLojaProduto = parseInt(produto.idLoja);
                const loja = lojas.find(l => l.idLoja === idLojaProduto);

                const card = document.createElement('div');
                card.classList.add('card');

                card.innerHTML = `
                    <div class="border-card">
                        <img src="${produto.foto}" alt="Imagem do Produto" class="imagem-produto">
                        <div class="descricao">
                            <h3>${produto.nome}</h3>
                            <p>${produto.subtitulo}</p>
                        </div>
                        <div class="footerNovidades">
                            <div class="preco">
                                <span class="icone-preco">$</span>
                                <span class="valor">${produto.preco}</span>
                            </div>
                            <button class="botao-editar">Editar</button>
                        </div>
                    </div>
                `;

                const botaoEditar = card.querySelector('.botao-editar');
                botaoEditar.addEventListener('click', function () {
                    window.location.href = `./editarProdutos.html?idProduto=${produto.idProduto}`;
                });

                cardsWrapper.appendChild(card);
            });
        } else {
            cardsWrapper.innerHTML = '<p>Nenhum produto encontrado para esta loja.</p>';
        }
    } else {
        const cardsWrapper = document.querySelector('.cards-wrapper');
        cardsWrapper.innerHTML = '<p>Nenhum produto encontrado.</p>';
    }
});
