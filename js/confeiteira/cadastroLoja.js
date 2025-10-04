import { carregarTodosOsDados } from './dicionario.js';

document.addEventListener('DOMContentLoaded', () => {
  carregarTodosOsDados();
});

function continuar() { 
  const nomeLoja = document.getElementById('nomeloja').value.trim();
  const horario = document.getElementById('horario').value.trim();
  const descricao = document.getElementById('descricao').value.trim();
  const fotoPerfil = document.getElementById('fotoExibida').src;
  
  if (!nomeLoja || !horario || !descricao) {
    alert("Por favor, preencha todos os campos da loja.");
    return;
  }

  const dadosLoja = {
    nomeLoja: nomeLoja,
    horario: horario,
    descricao: descricao,
    fotoPerfil: fotoPerfil,
    idConfeiteira: localStorage.getItem('idConfeiteiraAtual') 
  };

  const idLoja = gerarIdLoja();

  let lojas = JSON.parse(localStorage.getItem('Lojas')) || [];
  lojas.push({ idLoja, ...dadosLoja });
 
  localStorage.setItem('Lojas', JSON.stringify(lojas));

  localStorage.setItem('idLojaAtual', idLoja);

  alert("Dados da loja salvos com sucesso!");
  location.href = "adicionarProdutos.html";
}

function gerarIdLoja() {
  let lojas = JSON.parse(localStorage.getItem('Lojas')) || [];
  return lojas.length > 0 ? Math.max(...lojas.map(l => l.idLoja)) + 1 : 1;
}

function mostrarFotoPerfil(event) {
  const foto = document.getElementById('fotoExibida');
  const arquivo = event.target.files[0];

  if (arquivo) {
    const leitor = new FileReader();
    leitor.onload = function (e) {
      foto.src = e.target.result;
      foto.style.display = 'block';
    };
    leitor.readAsDataURL(arquivo);
  }
}

function autoResize(textarea) {
  textarea.style.height = "auto";
  textarea.style.height = textarea.scrollHeight + "px";
}
