# EasyDesk — Gestão de Chamados Técnicos

Sistema web simples de helpdesk para organizar chamados de suporte técnico.

## Tecnologias

- **Back-end:** Node.js (≥ 22.5) + Express
- **Banco:** SQLite via `node:sqlite` (nativo, sem dependência extra)
- **Front-end:** HTML, CSS e JavaScript puro

## Como rodar localmente

**Pré-requisito:** Node.js 22.5 ou superior.

```bash
# 1. Clone o repositório
git clone https://github.com/loraadev/easyd.git
cd easyd

# 2. Instale as dependências
npm install

# 3. Crie o arquivo de ambiente (já vem preenchido com os valores padrão)
cp .env.example .env

# 4. Suba o servidor
npm run dev   # com reinício automático (nodemon)
# ou
npm start     # produção
```

Acesse [http://localhost:3000](http://localhost:3000).

O arquivo do banco (`easyd.db`) é criado automaticamente na primeira execução.

## Deploy no Render

1. Suba o projeto para um repositório no GitHub.
2. No [Render](https://render.com), crie um novo **Web Service** apontando para o repositório.
3. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node — selecione a versão **22.x** (obrigatório para `node:sqlite`)
4. Adicione a variável de ambiente `NODE_ENV=production`.
5. Clique em **Deploy**.

> O banco SQLite fica no disco efêmero do Render. Os dados são perdidos a cada novo deploy. Para persistência, use um disco persistente (Render Disk) ou migre para PostgreSQL.

## Rotas da API

| Método | Rota                     | Descrição                                                    |
| ------ | ------------------------ | ------------------------------------------------------------ |
| GET    | /api/health              | Healthcheck                                                  |
| GET    | /api/chamados            | Lista chamados (filtros: status, prioridade, busca, ordenar) |
| GET    | /api/chamados/:id        | Retorna um chamado                                           |
| POST   | /api/chamados            | Cria chamado                                                 |
| PATCH  | /api/chamados/:id/status | Atualiza status                                              |
| DELETE | /api/chamados/:id        | Remove chamado                                               |
