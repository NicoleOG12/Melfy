    const step1 = document.getElementById("step1");
    const step2 = document.getElementById("step2");
    const nextBtn = document.getElementById("nextBtn");
    const backBtn = document.getElementById("backBtn");
    const stepText = document.getElementById("stepText");
    const progressBar = document.getElementById("progressBar");
    const description = document.querySelector("description");
    const card = document.querySelector("card")
    const btnCadastrar = document.getElementById("cadastrar");



// steps do cadastro
    nextBtn.onclick = () => {
      step1.classList.remove("visible-step");
      step1.classList.add("hidden-step");

      step2.classList.remove("hidden-step");
      step2.classList.add("visible-step");

      stepText.textContent = "Passo 2 de 2";
      progressBar.style.width = "100%";


      // description.remove();
    };

    backBtn.onclick = () => {
      step2.classList.remove("visible-step");
      step2.classList.add("hidden-step");

      step1.classList.remove("hidden-step");
      step1.classList.add("visible-step");

      stepText.textContent = "Passo 1 de 2";
      progressBar.style.width = "50%";

      // description.classList.add("description");
      // card.appendChild(description);
    };





    // formatador automatico de numeros

document.getElementById("cpf").addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, ""); 
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    e.target.value = value;
});


document.getElementById("telefone").addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, "");

    value = value.replace(/^(\d{2})(\d)/g, "($1) $2"); 
    value = value.replace(/(\d{5})(\d{4})$/, "$1-$2"); 

    e.target.value = value;
});


///////////

// conexao com api

async function logar(email, senha) {
  const res = await fetch(
    "https://melfy-backend-production.up.railway.app/clientes/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, senha }),
    }
  );

  const json = await res.json();
  console.log(json);


  localStorage.setItem("tokenCliente", json.token);

  return json;
}




async function cadastrar(dados) {
  const res = await fetch(
    "https://melfy-backend-production.up.railway.app/clientes",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    }
  );

  const retorno = await res.json();
  console.log("Cadastro:", retorno);

  return retorno;
}


// cadastrar cliente
btnCadastrar.addEventListener("click", async function () {


  const nome = document.getElementById("nome").value.trim();
  const telefone = document.getElementById("telefone").value.trim();
  const email = document.getElementById("email").value.trim();
  const cpf = document.getElementById("cpf").value.trim();
  const data_nasc = document.getElementById("dt_nasc").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const senhaCon = document.getElementById("senhaCon").value.trim();


  const telefoneLimpo = telefone.replace(/\D/g, "");
  const cpfLimpo = cpf.replace(/\D/g, "");

  console.log("NOME:", nome);
  console.log("TEL:", telefone);
  console.log("EMAIL:", email);
  console.log("CPF:", cpf);
  console.log("NASC:", data_nasc);
  console.log("SENHA:", senha);
  console.log("SENHA CONF:", senhaCon);

  if (senha !== senhaCon) {
    alert("Digite sua senha corretamente!");
    return;
  }


  const dados = { 
    nome, 
    telefone: telefoneLimpo, 
    email, 
    cpf: cpfLimpo, 
    data_nasc, 
    senha 
  };

  console.log("ENVIANDO PARA API:", dados);
  
  await cadastrar(dados);

  const login = await logar(email, senha);

  if (!login.token) {
    alert("Erro ao fazer login após cadastro.");
    return;
  }

  window.location.href = "../../pages/cliente/doces.html";
});