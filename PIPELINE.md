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

### 11. Quality gate de cobertura (`coverage.thresholds`)

```js
// vite.config.js
const coverageMin = Number(process.env.COVERAGE_THRESHOLD) || 80;
// ...
thresholds: { lines: coverageMin, statements: coverageMin, functions: coverageMin }
```

**Problema resolvido:** até aqui a cobertura era apenas *medida*. Agora é um critério de qualidade: se ficar abaixo do mínimo (80%, vindo da variável `COVERAGE_THRESHOLD` do `ci.yml`), o `npm run test:coverage` falha e o CI para, impedindo a entrega.

---

## Entrega Contínua (CD) — `.github/workflows/cd.yml`

### 12. Encadeamento com o CI (`workflow_run`)

```yaml
on:
  workflow_run:
    workflows: ["CI – Melfy Frontend"]
    types: [completed]
```

Todos os jobs têm `if: github.event.workflow_run.conclusion == 'success'`.

**Problema resolvido:** o CD só começa **depois** que o CI inteiro (Gitleaks, lint, testes, cobertura e build) terminar com sucesso. Se qualquer etapa obrigatória do CI falhar, o CD não executa e nenhuma imagem é publicada.

> O GitHub só dispara `workflow_run` quando o `cd.yml` está na branch `main`.

---

### 13. Segurança das dependências (`npm audit`)

```yaml
- run: npm audit --omit=dev --audit-level=high
```

**Problema resolvido:** bloqueia a entrega se houver vulnerabilidade **alta ou crítica** nas dependências que vão para produção. `--omit=dev` ignora ferramentas de desenvolvimento (vite, vitest), que não entram na imagem.

---

### 14. Docker (`Dockerfile`)

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 8080
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "8080"]
```

- **`FROM`:** imagem base com Node 22.
- **`WORKDIR`:** pasta de trabalho dentro do container.
- **`COPY` + `RUN npm ci`:** copia só o `package.json` e o lock primeiro e instala as dependências (o Docker reaproveita essa camada quando o código muda, mas as dependências não).
- **`COPY . .` + `RUN npm run build`:** copia o código e gera o build do Vite.
- **`EXPOSE`:** porta que a aplicação usa.
- **`CMD`:** comando que inicia a aplicação (`vite preview` servindo o build).
- **`.dockerignore`:** deixa `node_modules`, `.env` e `.git` fora da imagem (mais rápido e sem vazar segredos).

---

### 15. Teste da imagem (job `docker`)

1. `docker build` constrói a imagem.
2. `docker run -d -p 8080:8080` sobe o container.
3. Um `curl` em `http://localhost:8080/` confirma que a aplicação responde; se não responder, o job falha.

**Problema resolvido:** garante que a imagem não só compila, mas **sobe e responde**, antes de ser publicada.

---

### 16. Publicação (job `publish`) — Docker Hub

```yaml
needs: [audit, docker]
if: ... head_branch == 'main' && event == 'push'
```

Passos: `docker login` → `docker build` → `docker tag` → `docker push`.

Tags publicadas em `<DOCKER_USER>/melfy`:

- `latest` — última versão validada;
- `<sha do commit>` — versão rastreável, permite voltar para uma versão anterior.

**Problema resolvido:** uma versão validada fica disponível para execução. Só publica a partir da `main` e só se `audit` **e** `docker` passaram.

**Secrets necessários** (`Settings → Secrets and variables → Actions`):

- `DOCKER_USER` → usuário do Docker Hub
- `DOCKER_PASS` → token do Docker Hub (`Account Settings → Personal access tokens`, permissão *Read & Write*)

**Como executar a imagem publicada:**

```bash
docker run -p 8080:8080 <DOCKER_USER>/melfy:latest
```

Aplicação em http://localhost:8080

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
  │   4. vitest run --coverage (≥ 80%)   │
  │   5. upload do relatório (Node 22)   │
  └──────┬───────────────────────────────┘
         │ ambas as versões passam
         ▼
  ┌──────────────┐
  │  🏗️  Build   │  (vite build → artefato dist/)
  └──────┬───────┘
         │ CI concluído com sucesso (workflow_run)
         ▼
  ┌───────────────────────────────────────────────┐
  │  🚀 CD  (cd.yml)                              │
  │                                               │
  │   ┌─────────────┐   ┌──────────────────────┐  │
  │   │ npm audit   │   │ Docker: build        │  │
  │   │ (produção)  │   │ + teste do container │  │
  │   └──────┬──────┘   └──────────┬───────────┘  │
  │          └──────────┬──────────┘              │
  │                     ▼                         │
  │   ┌──────────────────────────────────────┐    │
  │   │ Publicar no Docker Hub (main)        │    │
  │   │  :latest  e  :sha-<commit>           │    │
  │   └──────────────────────────────────────┘    │
  └───────────────────────────────────────────────┘

Qualquer etapa que falhar interrompe as seguintes — nada é publicado.
```

---

## Arquivos criados/modificados

| Arquivo | O que mudou |
|---|---|
| `.github/workflows/ci.yml` | Pipeline de Integração Contínua |
| `.github/workflows/cd.yml` | Entrega Contínua: audit, build e teste da imagem Docker, publicação no Docker Hub |
| `Dockerfile` | Imagem da aplicação (build do Vite e execução na porta 8080) |
| `.dockerignore` | Reduz o contexto de build e evita vazar segredos |
| `src/services/__tests__/api.test.js` | 25 testes unitários para `api.js` |
| `vite.config.js` | Configuração do Vitest + coverage + limite mínimo de cobertura |
| `package.json` | Scripts `lint`, `test`, `test:coverage`; dependências `vitest`, `@vitest/coverage-v8`, `jsdom` |
