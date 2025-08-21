# versão node  v22.13.0

# 📊 Desafio Técnico - API de Transações (NestJS + Clean Architecture)

Este projeto é uma API RESTful desenvolvida em **NestJS com TypeScript**, seguindo os princípios da **Clean Architecture**, que recebe transações e retorna estatísticas baseadas nos últimos 60 segundos.

---

## 🚀 Tecnologias Utilizadas
- [NestJS](https://nestjs.com/) + TypeScript
- [Jest](https://jestjs.io/) para testes unitários e de integração
- [Swagger](https://swagger.io/) para documentação da API
- [Winston](https://github.com/winstonjs/winston) ou [Pino](https://github.com/pinojs/pino) para logs estruturados
- [Helmet](https://helmetjs.github.io/) para segurança
- [Docker](https://www.docker.com/) e **docker-compose**

---

## 📂 Estrutura do Projeto (Clean Architecture)
- **Controllers** → Camada de entrada (HTTP).
- **Use Cases** → Regras de negócio.
- **Entities** → Objetos de domínio.
- **Repositories** → Armazenamento em memória.
- **Interfaces** → Contratos e serviços externos.

---

## ⚙️ Requisitos
- Node.js **>= 20**
- NPM (Node Package Manager)
- Docker e docker-compose (opcional, mas recomendado)

---

## 📦 Instalação

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/costatavares/test-transaction-api.git
cd desafio-nestjs

# Instalar dependências
npm install
```

---

## ▶️ Executando o Projeto

### 1. Modo desenvolvimento
```bash
npm run start:dev
```

### 2. Produção (compilado)
```bash
npm run build
npm run start:prod
```

### 3. Usando Docker
```bash
docker-compose up --build
```

A API estará disponível em:  
👉 `http://localhost:3000`

---

## 📘 Documentação Swagger
Após iniciar o projeto, acesse:  
👉 `http://localhost:3000/api`

---

## ✅ Testes Automatizados

### Executar todos os testes
```bash
npm run test
```

### Testes e2e
```bash
npm run test:e2e
```

---

## 🔗 Endpoints da API

### Criar transação
`POST /transactions`
```json
{
  "amount": 123.45,
  "timestamp": "2024-02-20T12:34:56.789Z"
}
```

### Deletar todas transações
`DELETE /transactions`

### Obter estatísticas
`GET /statistics`
```json
{
  "count": 10,
  "sum": 1234.56,
  "avg": 123.45,
  "min": 12.34,
  "max": 456.78
}
```

### Healthcheck
`GET /health`

---

## 🐳 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto, exemplo:

```env
PORT=3000
RATE_LIMIT=100
```

---

## 📝 Diferenciais
- CI/CD com GitHub Actions
- Métricas com Prometheus + Grafana
- Atualizações em tempo real com WebSockets

---

## 👨‍💻 Como Contribuir
1. Faça um fork do repositório
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

## 📄 Licença
Este projeto é open-source e está sob a licença MIT.
