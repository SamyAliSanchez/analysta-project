# 🧪 Full Stack Project

**Tema:** "Mercado Intergaláctico de Activos Exóticos"


**Stack:** React + NestJS + MongoDB


### 🎯 Proyecto: "Trading Desk de Activos Exóticos"

Construir una pequeña plataforma de trading donde los usuarios pueden registrar, analizar y operar con activos financieros ficticios, propios de un mercado "intergaláctico".

## ⚙️ Puesta en marcha del monorepo

### Requisitos previos

- Node.js 20+
- pnpm 9.x
- MongoDB accesible en `mongodb://localhost:27017/analysta` (con Docker)
- Docker (para MongoDB)

### Setup inicial

1. Instalar dependencias

   ```bash
   pnpm install
   ```

2. Configurar variables de entorno

   ```bash
   cp .env.example .env
   cp apps/api/.env.example apps/api/.env
   cp apps/web/.env.example apps/web/.env
   ```

3. Levantar MongoDB

```bash
# Docker

No necesitas instalar MongoDB en tu sistema.
```

- `docker-compose up -d mongodb`

Esto levantará MongoDB en un contenedor accesible desde:

- `mongodb://localhost:27017/analysta`

4. Levantar backend y frontend en paralelo

   ```bash
   pnpm dev
   ```

También puedes ejecutarlos por separado con `pnpm dev:api` y `pnpm dev:web`.

5. Probar endpoints de autenticación

   Una vez que la API esté corriendo, puedes probar los endpoints:

   ```bash
   ./scripts/test-auth.sh
   ```

O manualmente con curl:

```bash
# Registrar usuario
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "test123", "displayName": "Test User"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "test123"}'
```

### Scripts útiles

- `pnpm build` – compila ambos proyectos.
- `pnpm test` – ejecuta las pruebas disponibles en cada paquete.
- `pnpm seed` – (pendiente) poblará la base de datos con los activos iniciales.

### Endpoints disponibles (API)

- `POST /auth/register` — Crea un usuario nuevo.
- `POST /auth/login` — Devuelve JWT + usuario.
- `GET /assets` — Lista activos (`?category=`, `?search=` opcionales).
- `GET /assets/:id` — Obtiene un activo por ID.
- `GET /pricing` — Devuelve el último precio simulado de cada activo.
- `GET /pricing/:symbolOrId` — Devuelve el precio de un activo (por símbolo o ID).

#### Activos disponibles:

- "Quantum Credit"
- "Photon Bond"
- "Dark Matter Future"
- "Nebula ETF"

## 📝 Cómo Ejecutar Tests

```bash
# Ejecutar todos los tests
cd apps/api

pnpm test
```

## 🔍 Archivos de Test

**Tests completos (con lógica de negocio):**

- ✅ `apps/api/src/positions/positions.service.spec.ts` - 10 tests
- ✅ `apps/api/src/auth/auth.service.spec.ts` - 5 tests
- ✅ `apps/api/src/pricing/pricing.service.spec.ts` - 6 tests

**Tests básicos (verificación de instanciación):**

- ✅ `apps/api/src/positions/positions.controller.spec.ts`
- ✅ `apps/api/src/auth/auth.controller.spec.ts`
- ✅ `apps/api/src/assets/assets.controller.spec.ts`
- ✅ `apps/api/src/assets/assets.service.spec.ts`
- ✅ `apps/api/src/users/users.service.spec.ts`
- ✅ `apps/api/src/app.controller.spec.ts`

Los tests son **básicos pero funcionales**, cubriendo:

- Funcionalidad core del sistema
- Casos de éxito y error
- Validación de lógica de negocio crítica (cálculo de PnL, simulación de precios)

### 🧬 Modelado de Datos

#### User

- `email`
- `password`
- `displayName`

#### Asset

Este catálogo se deberá prerellenar con un script inicial (seed script) y debe incluir los siguientes campos:

- `id`
- `symbol` (ej.: QCRD, PHBN, DRKM, NBLX)
- `name`
- `category` (equity, bond, derivative, crypto-like, exotic)
- `volatility` (0–1)
- `description`

#### Position

Representa una operación abierta por un usuario:

- `id`
- `userId`
- `assetId`
- `side` (buy/sell)
- `quantity`
- `openPrice`
- `openDate`
- `status` (open / closed)
- `closePrice` (solo si está cerrada)
- `closeDate`

### ⚙️ Funcionalidades Requeridas

#### 1. Autenticación

- Registro
- Login
- Rutas protegidas

#### 2. Catálogo de Activos

- Listar activos disponibles
- Filtro por categoría
- Ver detalles de cada activo
- Los activos se guardan en MongoDB via seed initial script

#### 3. Simulador de Precios (mini-algoritmo)

Frontend o backend (a elección):

- Cada activo tiene un precio simulado que cambia con el tiempo
- El precio base se puede calcular así:

$$\text{price}(t+1) = \text{price}(t) \times (1 + \text{random}(-\text{volatility}, +\text{volatility}))$$

- Debe haber un endpoint o hook para obtener el precio en tiempo real (o simulado cada 3s)

#### 4. Apertura y Cierre de Posiciones

Los usuarios pueden:

- Abrir posiciones de compra o venta
- Ver su cartera
- Cerrar posiciones abiertas (calculando PnL)

**Fórmula de PnL:**

$$
\text{PnL} = \begin{cases}
(\text{closePrice} - \text{openPrice}) \times \text{quantity} & \text{si es Buy} \\
(\text{openPrice} - \text{closePrice}) \times \text{quantity} & \text{si es Sell}
\end{cases}
$$

#### 5. Dashboard del Trader

Debe incluir:

- Lista de posiciones abiertas
- Lista de posiciones cerradas
- PnL total del usuario
- PnL por activo
- Evolución del PnL (si quiere hacer un gráfico, opcional)

### ⭐ Criterios de Evaluación

Valoramos:

- Arquitectura sólida
- Buen diseño de API
- Buen uso de React Query / Zustand / Redux Toolkit
- NestJS modular (Assets, Auth, Positions, Pricing)
- Validaciones
- Simulación de precios
- Mongo bien modelado
- Testing (bonus)
