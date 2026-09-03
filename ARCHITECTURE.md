# 🏗️ Arquitetura do Melfy — Documentação Técnica

> Este documento descreve a estrutura, organização e decisões arquiteturais do front-end do **Melfy**, uma plataforma para confeiteiras divulgarem e venderem seus doces.

---

## 📋 Índice

1. [Visão Geral](#-visão-geral)
2. [Stack de Tecnologias](#-stack-de-tecnologias)
3. [Estrutura de Pastas](#-estrutura-de-pastas)
4. [Camadas da Arquitetura](#-camadas-da-arquitetura)
   - [Roteamento (App.jsx)](#1-roteamento--appjsx)
   - [Páginas (pages/)](#2-páginas--pages)
   - [Componentes (components/)](#3-componentes--components)
   - [Contexto Global (context/)](#4-contexto-global--context)
   - [Hooks Customizados (hooks/)](#5-hooks-customizados--hooks)
   - [Serviços (services/)](#6-serviços--services)
   - [Utilitários (utils/)](#7-utilitários--utils)
   - [Constantes (constants/)](#8-constantes--constants)
   - [Estilos (styles/)](#9-estilos--styles)
5. [Fluxo de Dados](#-fluxo-de-dados)
6. [Autenticação](#-autenticação)
7. [Comunicação com a API](#-comunicação-com-a-api)
8. [Gerenciamento do Carrinho](#-gerenciamento-do-carrinho)
9. [Diagrama de Dependências](#-diagrama-de-dependências)

---

## 🌐 Visão Geral

O Melfy é uma **SPA (Single Page Application)** construída com **React 19** e empacotada via **Vite**. A arquitetura segue o padrão **Feature-Sliced** adaptado, onde os componentes são agrupados por domínio de negócio (auth, carrinho, doces, loja, pedidos, perfil, home, layout, sobre).

```
Browser → React SPA (Vite) → REST API (Railway)
```

A comunicação com o back-end é feita exclusivamente via **fetch nativo** com JWT Bearer Token armazenado no `localStorage`.

---

## 🛠️ Stack de Tecnologias

| Tecnologia | Versão | Papel |
|---|---|---|
| **React** | 19.1 | Biblioteca de UI |
| **React Router DOM** | 7.8 | Roteamento client-side |
| **Vite** | 7.1 | Bundler e dev server |
| **Tailwind CSS** | 4.3 | Estilização utilitária |
| **Lucide React** | 1.39 | Ícones SVG |
| **SweetAlert2** | 11.26 | Modais e alertas |

---

## 📁 Estrutura de Pastas

```
src/
├── App.jsx                  # Raiz: roteamento e providers
├── main.jsx                 # Ponto de entrada do React
│
├── pages/                   # Uma página por rota
│   ├── HomePage.jsx
│   ├── AuthPage.jsx
│   ├── DocesPage.jsx
│   ├── CarrinhoPage.jsx
│   ├── PedidosPage.jsx
│   ├── PerfilPage.jsx
│   ├── LojaPage.jsx
│   └── SobrePage.jsx
│
├── components/              # Componentes agrupados por domínio
│   ├── auth/
│   ├── carrinho/
│   ├── doces/
│   ├── home/
│   ├── layout/              # Header e Footer (globais)
│   ├── loja/
│   ├── pedidos/
│   ├── perfil/
│   └── sobre/
│
├── context/
│   └── AuthContext.jsx      # Estado global de autenticação + contagem do carrinho
│
├── hooks/                   # Lógica reutilizável desacoplada da UI
│   ├── useCounters.js
│   ├── useDragScroll.js
│   ├── useLojaPage.js
│   ├── usePedidos.js
│   ├── usePerfilDados.js
│   ├── usePerfilUsuario.js
│   ├── useReveal.js
│   └── useTeamCarousel.js
│
├── services/
│   ├── api.js               # Todas as chamadas HTTP à API REST
│   └── melfySwal.js         # Wrapper do SweetAlert2 com tema Melfy
│
├── utils/
│   ├── cartUtils.js         # Helpers de exibição do carrinho
│   ├── formatters.js        # Formatação de preços e textos
│   ├── masks.js             # Máscaras de input (CPF, CEP, celular…)
│   └── orderUtils.js        # Normalização e lógica de pedidos
│
├── constants/
│   ├── api.js               # URL base da API
│   ├── categories.js        # Categorias e listas de produtos
│   └── team.js              # Dados do time
│
└── styles/                  # CSS modular por domínio
    ├── colors.css
    ├── layout.css
    ├── components.css
    ├── home.css
    ├── auth.css
    ├── carrinho.css
    ├── sobre.css
    └── cliente/
        ├── doces.css
        ├── loja.css
        ├── modal.css
        ├── pedidos.css
        ├── perfil.css
        └── perfil-pagamentos.css
```

---

## 🧱 Camadas da Arquitetura

### 1. Roteamento — [`App.jsx`](src/App.jsx)

O `App.jsx` é a raiz da aplicação. Ele é responsável por:

- Envolver toda a árvore no **`AuthProvider`** (contexto global de autenticação);
- Declarar todas as rotas com **React Router DOM**.

```jsx
// Todas as rotas da aplicação
<Route path="/"         element={<HomePage />} />
<Route path="/sobre"    element={<SobrePage />} />
<Route path="/doces"    element={<DocesPage />} />
<Route path="/pedidos"  element={<PedidosPage />} />
<Route path="/perfil"   element={<PerfilPage />} />
<Route path="/carrinho" element={<CarrinhoPage />} />
<Route path="/auth"     element={<AuthPage />} />
<Route path="/loja/:id" element={<LojaPage />} />  // rota dinâmica por ID de loja
```

---

### 2. Páginas — [`pages/`](src/pages)

Cada arquivo em `pages/` representa **uma rota**. As páginas são componentes finos — sua responsabilidade é apenas **orquestrar a composição de componentes** e invocar hooks de dados. Elas **não contêm lógica de negócio diretamente**.

| Página | Rota | Descrição |
|---|---|---|
| `HomePage` | `/` | Landing page com hero, lojas em destaque e produtos |
| `AuthPage` | `/auth` | Login e cadastro de clientes |
| `DocesPage` | `/doces` | Catálogo completo de doces com filtros |
| `CarrinhoPage` | `/carrinho` | Sacola de compras e checkout |
| `PedidosPage` | `/pedidos` | Acompanhamento de pedidos ativos e histórico |
| `PerfilPage` | `/perfil` | Dados pessoais, endereços, pagamentos, cupons |
| `LojaPage` | `/loja/:id` | Página individual de uma loja confeiteira |
| `SobrePage` | `/sobre` | Sobre o projeto e o time |

---

### 3. Componentes — [`components/`](src/components)

Os componentes são organizados por **domínio de negócio**, não por tipo técnico. Cada subpasta agrupa todos os componentes visuais relacionados àquele contexto.

#### `layout/` — Componentes globais
- [`Header.jsx`](src/components/layout/Header.jsx) — Navegação principal, botão de carrinho com contagem
- [`Footer.jsx`](src/components/layout/Footer.jsx) — Rodapé global

#### `auth/` — Autenticação
- [`AuthShell.jsx`](src/components/auth/AuthShell.jsx) — Container visual da tela de auth
- [`LoginForm.jsx`](src/components/auth/LoginForm.jsx) — Formulário de login
- [`CadastroForm.jsx`](src/components/auth/CadastroForm.jsx) — Formulário de cadastro
- [`WelcomePanel.jsx`](src/components/auth/WelcomePanel.jsx) — Painel visual de boas-vindas
- [`Field.jsx`](src/components/auth/Field.jsx) — Input genérico reutilizável
- [`PasswordField.jsx`](src/components/auth/PasswordField.jsx) — Input de senha com toggle de visibilidade

#### `home/` — Página inicial
- `HeroSection` · `ProductsSection` · `LojasSection` · `BakersSection` · `HowItWorks` · `CtaSection` · `SearchBar`

#### `doces/` — Catálogo de doces
- [`CardProduto.jsx`](src/components/doces/CardProduto.jsx) — Card de produto individual
- [`CarrosselHex.jsx`](src/components/doces/CarrosselHex.jsx) — Carrossel hexagonal de categorias
- [`HexIcon.jsx`](src/components/doces/HexIcon.jsx) — Ícone hexagonal de categoria
- [`ProductModal.jsx`](src/components/doces/ProductModal.jsx) — Modal de detalhes do produto
- [`ImgWithFallback.jsx`](src/components/doces/ImgWithFallback.jsx) — Imagem com fallback automático

#### `carrinho/` — Sacola de compras
- [`CartTable.jsx`](src/components/carrinho/CartTable.jsx) — Tabela de itens do carrinho
- [`CartSummary.jsx`](src/components/carrinho/CartSummary.jsx) — Resumo com total
- [`CheckoutModal.jsx`](src/components/carrinho/CheckoutModal.jsx) — Modal de finalização do pedido
- [`RecommendationCards.jsx`](src/components/carrinho/RecommendationCards.jsx) — Sugestões de produtos
- [`AnimacaoCarrinho.jsx`](src/components/carrinho/AnimacaoCarrinho.jsx) — Animação de feedback visual

#### `loja/` — Página de loja
- [`LojaHero.jsx`](src/components/loja/LojaHero.jsx) — Banner e identidade da loja
- [`LojaTabs.jsx`](src/components/loja/LojaTabs.jsx) — Abas: cardápio, sobre, avaliações
- [`LojaCardapio.jsx`](src/components/loja/LojaCardapio.jsx) — Grid de produtos da loja
- [`LojaAvaliacoes.jsx`](src/components/loja/LojaAvaliacoes.jsx) — Avaliações da loja
- [`LojaSobre.jsx`](src/components/loja/LojaSobre.jsx) — Informações sobre a loja
- [`Estrelas.jsx`](src/components/loja/Estrelas.jsx) — Componente de avaliação por estrelas

#### `pedidos/` — Acompanhamento de pedidos
- [`PedidosUI.jsx`](src/components/pedidos/PedidosUI.jsx) — Layout principal da página
- [`Pedido.jsx`](src/components/pedidos/Pedido.jsx) — Card de pedido individual
- [`PedidoDetalhes.jsx`](src/components/pedidos/PedidoDetalhes.jsx) — Detalhes expandidos do pedido
- [`PedidoProgresso.jsx`](src/components/pedidos/PedidoProgresso.jsx) — Barra de progresso de status
- [`PedidoMapa.jsx`](src/components/pedidos/PedidoMapa.jsx) — Mapa de localização do entregador
- [`PedidoImagem.jsx`](src/components/pedidos/PedidoImagem.jsx) — Imagem do produto no pedido
- [`PedidoHistorico.jsx`](src/components/pedidos/PedidoHistorico.jsx) — Histórico de pedidos finalizados

#### `perfil/` — Área do usuário
- [`PerfilSidebar.jsx`](src/components/perfil/PerfilSidebar.jsx) — Menu lateral de navegação
- `DadosTab` · `EnderecosTab` · `PagamentosTab` · `CuponsTab` · `HistoricoTab` · `EstabelecimentosTab` · `NotificacoesTab` · `ConfiguracoesTab`
- `ModalEndereco` · `ModalPagamento` — Modais de formulários

#### `sobre/` — Página sobre
- `AboutHero` · `StorySection` · `ValuesSection` · `TeamSection`

---

### 4. Contexto Global — [`context/`](src/context)

O único contexto da aplicação é o [`AuthContext.jsx`](src/context/AuthContext.jsx), que gerencia:

| Estado | Tipo | Descrição |
|---|---|---|
| `usuario` | `object \| null` | Dados do cliente logado (lido do `localStorage`) |
| `cartCount` | `number` | Quantidade total de itens no carrinho |
| `login(token, dados)` | `function` | Salva token e dados no `localStorage` e atualiza o estado |
| `logout()` | `function` | Limpa o `localStorage` e reseta o estado |

**Polling do carrinho:** A cada **5 segundos**, enquanto o usuário estiver logado, o contexto consulta a API para atualizar o `cartCount`. Além disso, escuta dois eventos para atualizações imediatas:
- `storage` — quando outra aba altera o `localStorage`
- `carrinhoAtualizado` — evento customizado disparado após qualquer operação de carrinho

---

### 5. Hooks Customizados — [`hooks/`](src/hooks)

Os hooks extraem **lógica stateful** dos componentes, mantendo-os enxutos.

| Hook | Usado em | Responsabilidade |
|---|---|---|
| [`useLojaPage`](src/hooks/useLojaPage.js) | `LojaPage` | Busca dados da loja e produtos via API pelo `id` da URL |
| [`usePedidos`](src/hooks/usePedidos.js) | `PedidosPage` | Busca, normaliza e separa pedidos ativos e histórico; polling a cada 5s |
| [`usePerfilUsuario`](src/hooks/usePerfilUsuario.js) | `PerfilPage` | Gerencia dados do perfil do usuário |
| [`usePerfilDados`](src/hooks/usePerfilDados.js) | `PerfilPage` | Dados adicionais do perfil (endereços, pagamentos, etc.) |
| [`useCounters`](src/hooks/useCounters.js) | `HomePage` | Animação de contadores numéricos |
| [`useDragScroll`](src/hooks/useDragScroll.js) | Carrosseis | Permite arrastar para scrollar horizontalmente com o mouse |
| [`useReveal`](src/hooks/useReveal.js) | Seções da home | Animação de entrada de elementos ao fazer scroll (IntersectionObserver) |
| [`useTeamCarousel`](src/hooks/useTeamCarousel.js) | `SobrePage` | Lógica de navegação do carrossel de membros do time |

---

### 6. Serviços — [`services/`](src/services)

#### [`api.js`](src/services/api.js)

Centraliza **todas as chamadas HTTP** à API REST. A URL base é importada de [`constants/api.js`](src/constants/api.js).

| Função | Método | Endpoint | Auth? |
|---|---|---|---|
| `fetchProdutos()` | GET | `/produtos` | Não |
| `fetchLojas()` | GET | `/lojas/fetchAll` | Não |
| `fetchLoja(id)` | GET | `/lojas/fetchAll` + filtro | Não |
| `fetchProdutosPorLoja(idLoja)` | GET | `/produtos` + filtro | Não |
| `fetchCarrinho(token)` | GET | `/carrinho` | **Sim** |
| `adicionarAoCarrinho(idProduto, qtd)` | POST | `/carrinho?id=` | **Sim** |
| `removerDoCarrinho(idProduto, qtd)` | DELETE | `/carrinho?id=` | **Sim** |
| `criarPedido(pedido)` | POST | `/pedidos` | **Sim** |
| `fetchPedidos(token)` | GET | `/pedidos` | **Sim** |

> ⚠️ Após qualquer operação no carrinho, um evento customizado `carrinhoAtualizado` é disparado via `window.dispatchEvent`, garantindo que o `AuthContext` atualize o contador imediatamente.

#### [`melfySwal.js`](src/services/melfySwal.js)

Wrapper do **SweetAlert2** com a identidade visual do Melfy pré-configurada (cores, classes CSS customizadas). Qualquer alerta ou modal de confirmação da aplicação passa por este wrapper.

---

### 7. Utilitários — [`utils/`](src/utils)

Funções puras sem dependência de React, reutilizáveis em qualquer camada.

| Arquivo | Funções principais |
|---|---|
| [`formatters.js`](src/utils/formatters.js) | `formatarPreco`, `limitarDescricao`, `normalizar` |
| [`masks.js`](src/utils/masks.js) | `formatarCelular`, `formatarCPF`, `formatarCEP`, `formatarCartao`, `formatarValidade`, `dataISO` |
| [`cartUtils.js`](src/utils/cartUtils.js) | `formatarPreco`, `limitarDescricao`, `imagemProduto`, `imagemLoja` |
| [`orderUtils.js`](src/utils/orderUtils.js) | `normalize`, `statusOf`, `itemsOf`, `finished`, `dateTime`, `money` e mais |

> 📌 **`orderUtils.js`** é o arquivo mais complexo do projeto: contém a função `normalize()` que transforma um pedido bruto da API (que pode vir em vários formatos diferentes) num objeto padronizado e previsível para os componentes de pedidos.

---

### 8. Constantes — [`constants/`](src/constants)

Dados estáticos e configurações globais.

| Arquivo | Conteúdo |
|---|---|
| [`api.js`](src/constants/api.js) | `API_URL` — URL base da API em produção (Railway) |
| [`categories.js`](src/constants/categories.js) | `DOCES_QUERIDINHOS` e `CATEGORIAS` — listas de categorias com ícones SVG |
| [`team.js`](src/constants/team.js) | Dados dos membros do time para a página Sobre |

---

### 9. Estilos — [`styles/`](src/styles)

O projeto usa **Tailwind CSS 4** para utilitários inline e **CSS modules por domínio** para estilos mais específicos. Os arquivos de estilo seguem a mesma divisão por domínio dos componentes.

```
styles/
├── colors.css          # Variáveis de cores globais (tokens de design)
├── layout.css          # Estilos do layout base
├── components.css      # Componentes genéricos reutilizáveis
├── home.css            # Seções da home page
├── auth.css            # Tela de autenticação
├── carrinho.css        # Página do carrinho
├── sobre.css           # Página sobre
└── cliente/            # Área autenticada do cliente
    ├── doces.css
    ├── loja.css
    ├── modal.css
    ├── pedidos.css
    ├── perfil.css
    └── perfil-pagamentos.css
```

---

## 🔄 Fluxo de Dados

```
┌─────────────────────────────────────────────────┐
│                   API REST                       │
│         (Railway — melfy-backend)                │
└──────────────────────┬──────────────────────────┘
                       │ fetch (JWT Bearer)
                       ▼
┌─────────────────────────────────────────────────┐
│              services/api.js                    │
│   fetchProdutos · fetchLojas · fetchPedidos…    │
└──────┬──────────────────────────────┬───────────┘
       │                              │
       ▼                              ▼
┌─────────────┐              ┌────────────────────┐
│   hooks/    │              │  context/Auth      │
│ usePedidos  │              │  CartCount polling │
│ useLojaPage │              └────────┬───────────┘
└──────┬──────┘                       │
       │                              │ useAuth()
       ▼                              ▼
┌─────────────────────────────────────────────────┐
│                  pages/                         │
│  (orquestram componentes + passam props)        │
└──────────────────────┬──────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────┐
│               components/                      │
│      (exibição, interação com o usuário)        │
└─────────────────────────────────────────────────┘
```

---

## 🔐 Autenticação

O Melfy usa autenticação via **JWT (JSON Web Token)**:

1. Ao fazer login, o token e os dados do usuário são salvos no `localStorage`:
   - `tokenCliente` → string do JWT
   - `infoCliente` → array JSON com os dados do usuário

2. O `AuthContext` lê o `localStorage` no mount e hidrata o estado.

3. Todas as rotas protegidas (carrinho, pedidos, perfil) recuperam o token via `localStorage.getItem("tokenCliente")` e o enviam no header `Authorization: Bearer <token>`.

4. Logout limpa ambas as chaves do `localStorage` e reseta o estado global.

> ⚠️ **Não há rotas protegidas no roteador** (sem `<PrivateRoute>`). O controle de acesso é feito dentro de cada página/hook verificando a presença do token.

---

## 🌐 Comunicação com a API

- **Base URL:** `https://melfy-backend-production.up.railway.app` (definida em [`constants/api.js`](src/constants/api.js))
- **Formato:** JSON
- **Autenticação:** Bearer Token no header `Authorization`
- **Tratamento de erros:** A função `parseResponse()` em [`api.js`](src/services/api.js) tenta ler `message` ou `mensagem` do corpo da resposta para erros legíveis

---

## 🛒 Gerenciamento do Carrinho

O carrinho é **server-side** — os itens vivem na API, não no `localStorage`. O fluxo é:

```
Usuário clica "Adicionar" 
  → adicionarAoCarrinho() [api.js]
    → POST /carrinho?id={produto}
      → dispatchEvent("carrinhoAtualizado")
        → AuthContext ouve o evento
          → fetchCarrinho() novamente
            → setCartCount() atualiza o ícone do Header
```

---

## 📊 Diagrama de Dependências

```
main.jsx
  └── App.jsx
        ├── AuthProvider (context/AuthContext)
        │     └── services/api.js → constants/api.js
        └── BrowserRouter
              ├── HomePage    → components/home/*
              ├── AuthPage    → components/auth/*
              ├── DocesPage   → components/doces/*
              ├── CarrinhoPage → components/carrinho/*
              ├── PedidosPage → hooks/usePedidos
              │                   └── services/api.js
              │                   └── utils/orderUtils.js
              ├── PerfilPage  → hooks/usePerfilUsuario, usePerfilDados
              │                   └── components/perfil/*
              ├── LojaPage    → hooks/useLojaPage
              │                   └── services/api.js
              │                   └── components/loja/*
              └── SobrePage   → components/sobre/*
                                  └── hooks/useTeamCarousel
                                  └── constants/team.js
```

---

<p align="center">
  <sub>Melfy © 2026 — Feito com 💛 pelas abelhinhas do time Melfy</sub>
</p>
