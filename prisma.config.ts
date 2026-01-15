import path from 'node:path'
import { defineConfig } from 'prisma/config'

// Load env manually
import { config } from 'dotenv'
config({ path: path.join(__dirname, '.env') })

const DIRECT_URL = process.env.DIRECT_URL || ''

export default defineConfig({
  schema: path.join(__dirname, 'prisma', 'schema.prisma'),
  datasource: {
    url: DIRECT_URL,
  },
})
