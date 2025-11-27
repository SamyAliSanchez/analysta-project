import { registerAs } from '@nestjs/config'

type AppConfig = {
  apiPort: number
  jwtAccessSecret: string
  jwtRefreshSecret: string
  priceTickIntervalMs: number
  frontendOrigin: string
}

export default registerAs<AppConfig>('app', () => ({
  apiPort: parseInt(process.env.API_PORT ?? '3000', 10),
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET ?? 'change-me',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET ?? 'change-me',
  priceTickIntervalMs: parseInt(process.env.PRICE_TICK_INTERVAL_MS ?? '3000', 10),
  frontendOrigin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173',
}))
