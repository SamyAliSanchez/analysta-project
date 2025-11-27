# 🧪 Prueba Técnica – Full Stack

**Tema:** "Mercado Intergaláctico de Activos Exóticos"

## Estructura de la Prueba

La prueba se divide en:

- **Parte A** — Take-home (3–6 h)
- **Parte B** — Pair programming (60–90 min - conversación técnica y resolución de problemas en vivo a agendar tras entregar la Parte A)

**Stack obligatorio:** React + NestJS + MongoDB

## 🅐 — Take-Home

### 🎯 Proyecto: "Trading Desk de Activos Exóticos"

El candidato debe construir una pequeña plataforma de trading donde los usuarios pueden registrar, analizar y operar con activos financieros ficticios, propios de un mercado "intergaláctico".

#### Activos disponibles:

- "Quantum Credit"
- "Photon Bond"
- "Dark Matter Future"
- "Nebula ETF"

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
