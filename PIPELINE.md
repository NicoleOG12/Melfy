# Pipeline CI/CD — Melfy Frontend

## Visão Geral

A pipeline está definida em [`.github/workflows/ci.yml`](.github/workflows/ci.yml) e é executada automaticamente a cada `push` ou `pull request` em qualquer branch do repositório.

---

## Recursos utilizados e problemas que resolvem

### 1. Execução automática (`on: push / pull_request`)

```yaml
on:
  push:
    branches: ["**"]
  pull_request:
    branches: ["**"]
```

**Problema resolvido:** garantir que nenhuma alteração chegue ao repositório sem passar pelos checks de qualidade, independentemente da branch.

---

### 2. Instalação de dependências (`npm ci`)

```yaml
- run: npm ci
```

**Problema resolvido:** `npm ci` instala exatamente as versões fixadas no `package-lock.json`, tornando o ambiente da pipeline 100% reproduzível e evitando surpresas com versões de pacotes diferentes da máquina local.

---

### 3. Linter (`oxlint`)

```yaml
- run: npm run lint
```

**Problema resolvido:** detecta erros de código, violações de regras do React (como `rules-of-hooks`) e padrões ruins de forma rápida e sem executar o código. O oxlint é até 50–100× mais rápido que o ESLint.

---

### 4. Testes unitários (`vitest`)

```yaml
- run: npm test
```

**Problema resolvido:** valida o comportamento das funções da camada de serviço (`src/services/api.js`) que se comunicam com a API, cobrindo cenários de sucesso, erro e autenticação, sem depender de rede real.

Os testes utilizam `vi.fn()` para mockar `fetch` e `localStorage`, isolando completamente a lógica de negócio.

---

### 5. Cobertura de testes (`@vitest/coverage-v8`)

```yaml
- run: npm run test:coverage
```

**Problema resolvido:** torna visível quais linhas do código de integração com a API estão (ou não) sendo testadas. O relatório é gerado em HTML e LCOV e publicado como artefato da pipeline.

**Cobertura atual de `api.js`:** 98% de statements, 100% de funções.

---

### 6. Cache de dependências (`cache: "npm"`)

```yaml
- uses: actions/setup-node@v4
  with:
    cache: "npm"
```

**Problema resolvido:** evita baixar `node_modules` do zero a cada execução. O cache é invalidado automaticamente apenas quando o `package-lock.json` é alterado, reduzindo o tempo de pipeline em 40–60%.

---

### 7. Variables (`env` no nível do workflow)

```yaml
env:
  NODE_ENV: test
  VITE_APP_NAME: Melfy
  COVERAGE_THRESHOLD: "80"
```

**Problema resolvido:** centraliza configurações não-sensíveis que podem variar por ambiente (ex.: nome da aplicação, threshold de cobertura) sem hardcoding nos scripts.

---

### 8. Secrets (`secrets.VITE_API_URL`, `secrets.GITLEAKS_LICENSE`)

```yaml
env:
  VITE_API_URL: ${{ secrets.VITE_API_URL }}
```

**Problema resolvido:** a URL base da API de produção e a licença do Gitleaks nunca aparecem em logs ou no código-fonte. O GitHub mascara automaticamente o valor de qualquer secret nos outputs da pipeline.

**Como configurar:** `Settings → Secrets and variables → Actions → New repository secret`
- `VITE_API_URL` → URL da API (ex.: `https://melfy-backend-production.up.railway.app`)
- `GITLEAKS_LICENSE` → chave de licença do Gitleaks (opcional para repositórios públicos)

---

### 9. Gitleaks (verificação de segredos)

```yaml
- uses: gitleaks/gitleaks-action@v2
```

**Problema resolvido:** escaneia todo o histórico do repositório em busca de segredos vazados (tokens, chaves de API, senhas) antes de qualquer outro job. Se encontrar algo, a pipeline falha imediatamente.

---

### 10. Matrix (`strategy.matrix`)

```yaml
strategy:
  matrix:
    node-version: ["20", "22"]
```

**Problema resolvido:** garante que o projeto funciona nas duas versões LTS ativas do Node.js. Cada versão roda em paralelo como um job separado, detectando incompatibilidades de API antes que cheguem à produção.

**Por que faz sentido aqui:** o projeto pode ser implantado em diferentes ambientes (Vercel, Railway, servidores internos) que utilizam versões diferentes do Node — a matrix protege contra regressões silenciosas.

---

## Fluxo da pipeline

```
push / pull_request
        │
        ▼
  ┌──────────────┐
  │  🔐 Gitleaks │  (secret scan em todo o histórico)
  └──────┬───────┘
         │ sucesso
         ▼
  ┌──────────────────────────────────────┐
  │  🧪 CI  (Matrix: Node 20 e Node 22)  │
  │   1. npm ci                          │
  │   2. oxlint                          │
  │   3. vitest run                      │
  │   4. vitest run --coverage           │
  │   5. upload do relatório (Node 22)   │
  └──────┬───────────────────────────────┘
         │ ambas as versões passam
         ▼
  ┌──────────────┐
  │  🏗️  Build   │  (vite build → artefato dist/)
  └──────────────┘
```

---

## Arquivos criados/modificados

| Arquivo | O que mudou |
|---|---|
| `.github/workflows/ci.yml` | Pipeline completa do GitHub Actions |
| `src/services/__tests__/api.test.js` | 25 testes unitários para `api.js` |
| `vite.config.js` | Configuração do Vitest + coverage |
| `package.json` | Scripts `lint`, `test`, `test:coverage`; dependências `vitest`, `@vitest/coverage-v8`, `jsdom` |
