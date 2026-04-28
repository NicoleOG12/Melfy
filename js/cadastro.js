document.addEventListener("DOMContentLoaded", () => {

  const content = {
    cliente: { 
      title: "Seja um Cliente Feliz!",
      subtitle: "Crie sua conta e encomende os melhores doces da sua região.",
      bgImage: "url('../../assents/img/Login/cliente1.png')"
    },
    confeiteira: { 
      title: "Seja nossa Parceira!",
      subtitle: "Cadastre-se para vender seus doces e expandir seu negócio.",
      bgImage: "url('../../assents/img/Login/confeiteira1.png')"
    },
    entregador: { 
      title: "Faça Parte da Frota!",
      subtitle: "Cadastre-se para realizar entregas e aumentar sua renda.",
      bgImage: "url('../../assents/img/Login/entregador2.png')"
    }
  }

  let currentType = "cliente"
  const typeCards = document.querySelectorAll(".type-card")
  
  typeCards.forEach(card => {
    card.addEventListener("click", () => {
      typeCards.forEach(c => c.classList.remove("active"))
      card.classList.add("active")
      currentType = card.dataset.type

      const titleEl = document.getElementById("title")
      const subtitleEl = document.getElementById("subtitle")
      const leftPanel = document.getElementById("leftPanel")

      if (titleEl) titleEl.textContent = content[currentType].title
      if (subtitleEl) subtitleEl.textContent = content[currentType].subtitle
      if (leftPanel) leftPanel.style.backgroundImage = content[currentType].bgImage
    })
  })



  document.querySelectorAll(".fa-eye").forEach(icon => {
    icon.addEventListener("click", () => {
      const input = icon.previousElementSibling
      if (input.type === "password") {
        input.type = "text"
        icon.classList.replace("fa-eye", "fa-eye-slash")
      } else {
        input.type = "password"
        icon.classList.replace("fa-eye-slash", "fa-eye")
      }
    })
  })



  const form = document.getElementById("mainForm")
  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault()

      const submitBtn = form.querySelector("button[type='submit']")
      if (!submitBtn) return

      if (submitBtn.disabled) return
      submitBtn.disabled = true

      const originalText = submitBtn.textContent
      submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Carregando...`

      const nome = document.getElementById("nome")?.value.trim() || ""
      const email = document.getElementById("email")?.value.trim() || ""
      const senha = document.getElementById("senha")?.value.trim() || ""
      const senhaCon = document.getElementById("senhaCon")?.value.trim() || ""
      function resetButton() {
        submitBtn.disabled = false
        submitBtn.textContent = originalText
      }

      if (!nome || !email || !senha || !senhaCon) {
        alertError("Preencha nome, email e senha!")
        resetButton()
        return
      }

      if (senha !== senhaCon) {
        alertError("As senhas não coincidem!")
        resetButton()
        return
      }

      function gerarCpfAleatorio() {
        const numeros = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
        const calcularDigito = (pesoInicial, arr) => {
          const soma = arr.reduce((total, valor, i) => total + valor * (pesoInicial - i), 0);
          const resto = soma % 11;
          return resto < 2 ? 0 : 11 - resto;
        };

        const digito1 = calcularDigito(10, numeros);
        const digito2 = calcularDigito(11, [...numeros, digito1]);
        return [...numeros, digito1, digito2].join('');
      }

      const dados = {
        nome,
        email,
        senha,
        telefone: "11999999999",
        cpf: gerarCpfAleatorio(),
        data_nasc: "2000-01-01"
      }

      try {
        await cadastrar(dados, currentType)
        const logado = await logarComRetry(email, senha, currentType)
        if (!logado) {
          resetButton()
          return
        }
        await alertSuccess(`Cadastro realizado com sucesso! Bem-vindo(a), ${nome.split(" ")[0] || nome}!`)
        if (currentType === "cliente") {
          window.location.href = "../../pages/cliente/doces.html"
        } else if (currentType === "confeiteira") {
          window.location.href = "../../pages/confeiteira/home.html" // Atualizar 
        } else {
          window.location.href = "../../pages/entregador/home.html" // Atualizar 
        }
      } catch (err) {
        alertError(err.message || "Erro ao cadastrar")
        resetButton()
      }
    })
  }

  async function cadastrar(dados, tipo) {
    let endpoint = "clientes"
    if (tipo === "confeiteira") endpoint = "confeiteiras"
    if (tipo === "entregador") endpoint = "entregadores"

    const res = await fetch(
      `https://melfy-backend-production.up.railway.app/${endpoint}`,
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(dados) }
    )
    const retorno = await res.json()
    if (!res.ok) throw new Error(retorno.message || retorno.erro || "Erro ao cadastrar")
    return retorno
  }

  async function logar(email, senha, tipo) {
    let endpoint = "clientes"
    if (tipo === "confeiteira") endpoint = "confeiteiras"
    if (tipo === "entregador") endpoint = "entregadores"

    const res = await fetch(
      `https://melfy-backend-production.up.railway.app/${endpoint}/login`,
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, senha }) }
    )
    const data = await res.json()
    if (data.error === false) {
      const token = data.token || data.accessToken
      if (!token || !data.dados) return false
      
      const capitalizedType = tipo.charAt(0).toUpperCase() + tipo.slice(1)
      localStorage.setItem("token" + capitalizedType, token)
      localStorage.setItem("info" + capitalizedType, JSON.stringify(data.dados))
      return true
    }
    return false
  }

  async function logarComRetry(email, senha, tipo) {
    const tentativas = 5
    for (let i = 0; i < tentativas; i++) {
      const sucesso = await logar(email, senha, tipo)
      if (sucesso) return true
      await new Promise(resolve => setTimeout(resolve, 700))
    }
    return false
  }

})