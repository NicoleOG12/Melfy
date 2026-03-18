document.addEventListener("DOMContentLoaded", () => {

  // Campos extras
  const content = {
    cliente: {
      fields: `
        <div class="input">
          <label>Telefone</label>
          <input type="text" id="telefone" class="form-input">
        </div>
        <div class="input">
          <label>CPF</label>
          <input type="text" id="cpf" class="form-input">
        </div>
        <div class="input">
          <label>Data de Nascimento</label>
          <input type="date" id="dt_nasc" class="form-input">
        </div>
      `
    }
  }

  const extraFields = document.getElementById("extraFields")
  if (extraFields) {
    extraFields.innerHTML = content.cliente.fields
  }

  // Máscaras
  aplicarMascaras()
  function aplicarMascaras() {
    document.getElementById("cpf")?.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "")
      value = value.replace(/(\d{3})(\d)/, "$1.$2")
      value = value.replace(/(\d{3})(\d)/, "$1.$2")
      value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2")
      e.target.value = value
    })

    document.getElementById("telefone")?.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "")
      value = value.replace(/^(\d{2})(\d)/g, "($1) $2")
      value = value.replace(/(\d{5})(\d{4})$/, "$1-$2")
      e.target.value = value
    })
  }

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

  let currentStep = 0
  const steps = document.querySelectorAll(".step")
  const progress = document.getElementById("progress")

  function showStep(index) {
    steps.forEach((step, i) => {
      step.classList.toggle("active", i === index)
    })
    if (progress) {
      progress.style.width = ((index + 1) / steps.length) * 100 + "%"
    }
  }
  showStep(0)

  document.querySelectorAll(".next[type='button']").forEach(btn => {
    btn.onclick = () => {
      if (currentStep < steps.length - 1) {
        currentStep++
        showStep(currentStep)
      }
    }
  })

  document.querySelectorAll(".prev").forEach(btn => {
    btn.onclick = () => {
      if (currentStep > 0) {
        currentStep--
        showStep(currentStep)
      }
    }
  })

  const form = document.getElementById("mainForm")
  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault()

      const nome = document.getElementById("nome")?.value.trim() || ""
      const email = document.getElementById("email")?.value.trim() || ""
      const senha = document.getElementById("senha")?.value.trim() || ""
      const senhaCon = document.getElementById("senhaCon")?.value.trim() || ""
      const telefone = document.getElementById("telefone")?.value.trim() || ""
      const cpf = document.getElementById("cpf")?.value.trim() || ""
      const data_nasc = document.getElementById("dt_nasc")?.value.trim() || ""

      if (!nome || !email || !senha || !senhaCon) {
        alert("Preencha nome, email e senha!")
        return
      }

      if (senha !== senhaCon) {
        alert("As senhas não coincidem!")
        return
      }

      if (!telefone || !cpf || !data_nasc) {
        alert("Preencha todos os campos!")
        return
      }

      const dados = {
        nome,
        telefone: telefone.replace(/\D/g, ""),
        email,
        cpf: cpf.replace(/\D/g, ""),
        data_nasc,
        senha
      }

      try {
        await cadastrar(dados)
        const logado = await logarComRetry(email, senha)
        if (!logado) return
        alert(`Cadastro realizado com sucesso! Bem-vindo(a) ao Melfy`)
        window.location.href = "../../pages/cliente/doces.html"
      } catch (err) {
        alert(err.message)
      }
    })
  }

  async function cadastrar(dados) {
    const res = await fetch(
      "https://melfy-backend-production.up.railway.app/clientes",
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(dados) }
    )
    const retorno = await res.json()
    if (!res.ok) throw new Error(retorno.message || retorno.erro || "Erro ao cadastrar")
    return retorno
  }

  async function logar(email, senha) {
    const res = await fetch(
      "https://melfy-backend-production.up.railway.app/clientes/login",
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, senha }) }
    )
    const data = await res.json()
    if (data.error === false) {
      const token = data.token || data.accessToken
      if (!token || !data.dados) return false
      localStorage.setItem("tokenCliente", token)
      localStorage.setItem("infoCliente", JSON.stringify(data.dados))
      return true
    }
    return false
  }

  async function logarComRetry(email, senha) {
    const tentativas = 5
    for (let i = 0; i < tentativas; i++) {
      const sucesso = await logar(email, senha)
      if (sucesso) return true
      await new Promise(resolve => setTimeout(resolve, 700))
    }
    return false
  }

})