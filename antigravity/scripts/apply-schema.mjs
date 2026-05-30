import fs from 'node:fs'
import pg from 'pg'

const sql = fs.readFileSync(new URL('../supabase/schema.sql', import.meta.url), 'utf8')

const client = new pg.Client({
  connectionString:
    'postgresql://postgres:Kellampalli%4018@db.nbgkafzkbtqxjiumnnyu.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false },
})

try {
  await client.connect()
  console.log('Connected to Supabase Postgres')
  await client.query(sql)
  console.log('Schema applied successfully!')

  const { rows } = await client.query(
    "SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename"
  )
  console.log('Public tables:', rows.map((r) => r.tablename).join(', '))
} catch (error) {
  console.error('Failed:', error.message)
  process.exit(1)
} finally {
  await client.end()
}
