# Database Migrations

Use Supabase CLI for migrations. Example local workflow:

1. Install Supabase CLI: `npm i -g supabase`
2. Create a migration: `supabase migration new 0001_init`
3. Push migrations: `supabase db push` (requires credentials / service role key)

CI should run migrations with `SUPABASE_SERVICE_ROLE_KEY` set as a secret.

Core schema maintained in `database/schema.sql` and per-migration files in `database/migrations/`.
