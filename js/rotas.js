const baseURL = window.location.origin + "/"

const rotasCliente = {
  carrinho: `${baseURL}pages/cliente/carrinho.html`,
  doces: `${baseURL}pages/cliente/doces.html`,
  loja: `${baseURL}pages/cliente/loja.html`,
  lojas: `${baseURL}pages/cliente/lojas.html`,
  pedidos: `${baseURL}pages/cliente/pedidos.html`,
  perfilEnderecos: `${baseURL}pages/cliente/perfil-enderecos.html`,
  perfilFormasPag: `${baseURL}pages/cliente/perfil-formas-pag.html`,
  perfil: `${baseURL}pages/cliente/perfil.html`,
  produtos: `${baseURL}pages/cliente/produtos.html`
}

const rotasConfeiteira = {
  adicionarProdutos: `${baseURL}pages/confeiteira/adicionarProdutos.html`,
  cadastro: `${baseURL}pages/confeiteira/cadastro.html`,
  cadastroLoja: `${baseURL}pages/confeiteira/cadastroLoja.html`,
  editarProdutos: `${baseURL}pages/confeiteira/editarProdutos.html`,
  login: `${baseURL}pages/confeiteira/login.html`,
  meusProdutos: `${baseURL}pages/confeiteira/meusProdutos.html`,
  painelADM: `${baseURL}pages/confeiteira/painelADM.html`,
  pedidos: `${baseURL}pages/confeiteira/pedidos.htmlJ`,
  perfilEnderecos: `${baseURL}pages/confeiteira/perfil-enderecos.html`,
  perfilFormasPag: `${baseURL}pages/confeiteira/perfil-formas-pag.html`,
  perfil: `${baseURL}pages/confeiteira/perfil.html`
}

const rotasGerais = {
  home: `${baseURL}index.html`,
  login: `${baseURL}pages/login.html`,
  cadastro: `${baseURL}pages/cadastrar.html`,
  esqueceuSenha: `${baseURL}pages/esqueceuSenha.html`,
  sobre: `${baseURL}pages/sobre.html`
}


// Rotas Gerais
window.location.href = rotasGerais.home
window.location.href = rotasGerais.login
window.location.href = rotasGerais.cadastro
window.location.href = rotasGerais.esqueceuSenha
window.location.href = rotasGerais.sobre

// Rotas Cliente
window.location.href = rotasCliente.carrinho
window.location.href = rotasCliente.doces
window.location.href = rotasCliente.loja
window.location.href = rotasCliente.lojas
window.location.href = rotasCliente.pedidos
window.location.href = rotasCliente.perfilEnderecos
window.location.href = rotasCliente.perfilFormasPag
window.location.href = rotasCliente.perfil
window.location.href = rotasCliente.produtos

// Rotas Confeiteira
window.location.href = rotasConfeiteira.adicionarProdutos
window.location.href = rotasConfeiteira.cadastro
window.location.href = rotasConfeiteira.cadastroLoja
window.location.href = rotasConfeiteira.editarProdutos
window.location.href = rotasConfeiteira.login
window.location.href = rotasConfeiteira.meusProdutos
window.location.href = rotasConfeiteira.painelADM
window.location.href = rotasConfeiteira.pedidos
window.location.href = rotasConfeiteira.perfilEnderecos
window.location.href = rotasConfeiteira.perfilFormasPag
window.location.href = rotasConfeiteira.perfil
