const baseURL = window.location.origin + "/";

export const rotasCliente = {
  carrinho: `${baseURL}pages/cliente/carrinho.html`,
  doces: `${baseURL}pages/cliente/doces.html`,
  loja: `${baseURL}pages/cliente/loja.html`,
  pedidos: `${baseURL}pages/cliente/pedidos.html`,
  perfil: `${baseURL}pages/cliente/perfil.html`,
};

export const rotasConfeiteira = {
  home: `${baseURL}pages/confeiteira/home.html`,
};

export const rotasGerais = {
  home: `${baseURL}index.html`,
  cadastro: `${baseURL}pages/cadastro.html`,
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
