const baseURL = window.location.origin + "/";

export const rotasCliente = {
  carrinho: `${baseURL}pages/cliente/carrinho.html`,
  doces: `${baseURL}pages/cliente/doces.html`,
  loja: `${baseURL}pages/cliente/loja.html`,
  lojas: `${baseURL}pages/cliente/lojas.html`,
  pedidos: `${baseURL}pages/cliente/pedidos.html`,
  perfilEnderecos: `${baseURL}pages/cliente/perfil-enderecos.html`,
  perfilFormasPag: `${baseURL}pages/cliente/perfil-formas-pag.html`,
  perfil: `${baseURL}pages/cliente/perfil.html`,
  produtos: `${baseURL}pages/cliente/produtos.html`
};

export const rotasConfeiteira = {
  cadastro: `${baseURL}pages/confeiteira/cadastro.html`,
  cadastroLoja: `${baseURL}pages/confeiteira/cadastroLoja.html`,
  meusProdutos: `${baseURL}pages/confeiteira/meusProdutos.html`,
  painelADM: `${baseURL}pages/confeiteira/dashboard.html`,
  pedidos: `${baseURL}pages/confeiteira/pedidos.html`,
};

export const rotasGerais = {
  home: `${baseURL}index.html`,
  login: `${baseURL}pages/login.html`,
  cadastro: `${baseURL}pages/cadastrar.html`,
  esqueceuSenha: `${baseURL}pages/esqueceuSenha.html`,
  sobre: `${baseURL}pages/sobre.html`
};

const cssFiles = [
  `${baseURL}css/components.css`,
  `${baseURL}css/layout.css`,
  `${baseURL}css/base.css`
];

cssFiles.forEach(href => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
});
