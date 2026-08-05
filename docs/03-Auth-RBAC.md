# 03 — Auth & RBAC (Supabase)

## Goals
- Authenticate users with Supabase Auth
- Use JWT claims to enforce tenant scoping with Row Level Security (RLS)
- Provide roles: `admin`, `developer`, `billing`, `client`

## Supabase Setup
- Enable Supabase Auth providers (email/password, OAuth for SSO)
- Configure JWT claims to include `org_id` on session creation when user belongs to an organization

## RLS Example

Example policy for `websites` table to allow only members of the organization:

```
CREATE POLICY "org_is_member" ON websites
FOR ALL USING (
  organization_id = (current_setting('jwt.claims.org_id')::uuid)
);
```

## Role mapping
- Use `app_metadata` in Supabase to map user to organization and role.
- On sign-up or invite, create a row in `user_organizations(user_id, organization_id, role)` and set JWT claim via custom JWT or RLS using membership table.

## Admin Roles
- `admin` can manage org settings, billing, users, and RLS-exempt actions via service role keys.

## Service Role & Secrets
- Use Supabase service role key only in secure server contexts (not in client-side code). Protect migrations and backup tasks.

## Next Steps
- Implement membership table and seed initial roles. Add migration scripts to `database/migrations/`.
