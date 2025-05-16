## Getting Started

### Prerequisites

- Docker & Docker Compose  
- Node.js (>= 16) & npm (or Yarn)  
- Git

---

### 1. Clone the repository

```bash
git clone git@github.com:JorgeIvanPuyo/gastronomia-api-jip.git
cd gastronomia-api-jip
```

### 2. Start the Postgres database

```bash
docker-compose up -d
```

This will start a `postgres:15` container with:

- Database: `gastronomia`  
- User/Password: `postgres` / `postgres`  
- Exposed port: `5432`

Verify it's running:

```bash
docker ps
# You should see 'gastronomia-postgres' in the list, status 'Up'
```

### 3. Install dependencies

```bash
npm install
# or, if you prefer Yarn:
# yarn install
```

### 4. Configure environment variables

Create a `.env` file in the project root (already gitignored) with:

```dotenv
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=gastronomia
```

### 5. Run the application in development mode

```bash
npm run start:dev
```

By default, NestJS listens on port `3000`. You should see output similar to:

```
[Nest] XXXX   - 2025-05-16 09:00:00   [TypeOrmModule] Database connected
[Nest] XXXX   - 2025-05-16 09:00:00   [NestApplication] Nest application successfully started on port 3000
```

### 6. Verify the application is running

You can test the root endpoint:

```bash
curl http://localhost:3000/
# Expected output: "Hello World!"
```

### 7. Run Tests and Generate Coverage Report

To run the unit tests:

```bash
npm run test
```

To generate a test coverage report:

```bash
npm run test:cov
```

This will run Jest with coverage enabled and output a report in the coverage/ directory.  

To view the HTML coverage report, open: `coverage/lcov-report/index.html` in your browser.

---