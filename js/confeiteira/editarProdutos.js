document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const produtoId = urlParams.get('idProduto'); 

    let produtos = JSON.parse(localStorage.getItem('Produtos')) || [];
    const produto = produtos.find(p => p.idProduto === parseInt(produtoId)); 

    if (produto) {
        document.querySelector('#nome').value = produto.nome;
        document.querySelector('#subtitulo').value = produto.subtitulo || '';
        document.querySelector('#categoria').value = produto.categoria || '';
        document.querySelector('#descricao').value = produto.descricao || '';
        document.querySelector('#pesoInput').value = produto.peso || '';
        document.querySelector('#precoInput').value = produto.preco || '';

        if (produto.foto) {
            const imagemExibida = document.querySelector('#imagemExibida');
            imagemExibida.src = produto.foto;
            imagemExibida.style.display = 'block'; 
        }

        function updatePesoCounter(peso) {
            if (peso >= 1000) {
                let pesoKg = peso / 1000;
                document.querySelector('#pesoCounter').textContent = `${pesoKg.toFixed(2)} kg`;
            } else {
                document.querySelector('#pesoCounter').textContent = `${peso} g`;
            }
        }

        document.querySelector('.button-save').addEventListener('click', function (event) {
            event.preventDefault(); 
            
            produto.nome = document.querySelector('#nome').value;
            produto.subtitulo = document.querySelector('#subtitulo').value;
            produto.categoria = document.querySelector('#categoria').value;
            produto.descricao = document.querySelector('#descricao').value;
            produto.peso = document.querySelector('#pesoInput').value;
            produto.preco = document.querySelector('#precoInput').value;
            produto.foto = document.querySelector('#imagemExibida').src || produto.foto; 

            const index = produtos.findIndex(p => p.idProduto === parseInt(produtoId));
            produtos[index] = produto;
            localStorage.setItem('Produtos', JSON.stringify(produtos));

            alert('Produto atualizado com sucesso!');
            window.location.href = './meusProdutos.html';
        });

        document.querySelector('.button-delete').addEventListener('click', function (event) {
            event.preventDefault(); 

            const confirmDelete = confirm('Tem certeza que deseja excluir este produto?');
            if (confirmDelete) {
                produtos = produtos.filter(p => p.idProduto !== parseInt(produtoId));
                localStorage.setItem('Produtos', JSON.stringify(produtos));

                window.location.href = './meusProdutos.html';
            }
        });

        window.exibirImagem = function(event) {
            const file = event.target.files[0];
            const reader = new FileReader();

            reader.onload = function (e) {
                const imagemExibida = document.querySelector('#imagemExibida');
                imagemExibida.src = e.target.result;
                imagemExibida.style.display = 'block'; 
            };

            if (file) {
                reader.readAsDataURL(file);
            }
        };

        const nomeInput = document.querySelector('#nome');
        const subtituloInput = document.querySelector('#subtitulo');
        const pesoInput = document.querySelector('#pesoInput');
        const precoInput = document.querySelector('#precoInput');

        function updateCounter(input, counterElement, maxLength) {
            const currentLength = input.value.length;
            counterElement.textContent = `${currentLength} / ${maxLength}`;

            if (currentLength > maxLength) {
                counterElement.classList.add("red");
            } else {
                counterElement.classList.remove("red");
            }
        }

        nomeInput.addEventListener('input', function() {
            updateCounter(nomeInput, document.querySelector('#nomeCounter'), 21);
        });

        subtituloInput.addEventListener('input', function() {
            updateCounter(subtituloInput, document.querySelector('#subtituloCounter'), 35);
        });

        pesoInput.addEventListener('input', function() {
            const peso = parseFloat(pesoInput.value);
            updatePesoCounter(peso);
        });

        precoInput.addEventListener('input', function() {
            const preco = precoInput.value;
            document.querySelector('#precoCounter').textContent = `R$ ${parseFloat(preco).toFixed(2)}`;
        });

        updateCounter(nomeInput, document.querySelector('#nomeCounter'), 21);
        updateCounter(subtituloInput, document.querySelector('#subtituloCounter'), 35);

        const pesoInicial = parseFloat(pesoInput.value);
        updatePesoCounter(pesoInicial);

        document.querySelector('#precoCounter').textContent = `R$ ${parseFloat(precoInput.value).toFixed(2)}`;

    } else {
        alert('Produto não encontrado.');
    }

    
});
