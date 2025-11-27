import { registerAs } from '@nestjs/config'

type MongoConfig = {
  uri: string
  dbName: string
}

export default registerAs<MongoConfig>('mongo', () => ({
  uri: process.env.MONGO_URI ?? 'mongodb://localhost:27017/analysta',
  dbName: process.env.MONGO_DB ?? 'analysta',
}))
