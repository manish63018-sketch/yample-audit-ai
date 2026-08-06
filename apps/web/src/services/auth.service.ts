import {
  createSupabaseClient,
  UserRepository,
  OrganizationRepository,
} from '@auditai/db'
import type { User, Organization, UserRole } from '@/types'

export interface SignUpParams {
  email: string
  password: string
  fullName: string
  companyName: string
}

export interface SignInParams {
  email: string
  password: string
}

export interface AuthSession {
  user: User | null
  organization: Organization | null
  role: UserRole | null
}

export class AuthService {
  private static getClient() {
    return createSupabaseClient()
  }

  /**
   * Register a new user, create their default organization, and assign them as admin.
   */
  static async signUp({ email, password, fullName, companyName }: SignUpParams): Promise<AuthSession> {
    const client = this.getClient()

    // 1. Sign up with Supabase Auth
    const { data: authData, error: authError } = await client.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          company_name: companyName,
        },
      },
    })

    if (authError) {
      throw new Error(authError.message)
    }

    const authUser = authData.user
    if (!authUser) {
      throw new Error('Sign up failed. Please check your credentials.')
    }

    const userRepo = new UserRepository(client)
    const orgRepo = new OrganizationRepository(client)

    // 2. Create database user record
    const user = await userRepo.create({
      id: authUser.id,
      email: authUser.email || email,
      full_name: fullName,
    })

    // 3. Create organization with slug
    const slug = companyName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || `org-${Date.now()}`

    const org = await orgRepo.create({
      name: companyName,
      slug: `${slug}-${Math.floor(Math.random() * 1000)}`,
    })

    // 4. Add user as admin to team_members
    await orgRepo.addMember(org.id, user.id, 'admin')

    return {
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        avatar_url: user.avatar_url,
        created_at: user.created_at,
      },
      organization: {
        id: org.id,
        name: org.name,
        slug: org.slug,
        plan: 'free',
        billing_customer_id: org.billing_customer_id,
        created_at: org.created_at,
      },
      role: 'admin',
    }
  }

  /**
   * Sign in existing user with email and password.
   */
  static async signIn({ email, password }: SignInParams): Promise<AuthSession> {
    const client = this.getClient()

    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw new Error(error.message)
    }

    const authUser = data.user
    if (!authUser) {
      throw new Error('Login failed.')
    }

    return this.getCurrentSession()
  }

  /**
   * Send password reset email.
   */
  static async resetPassword(email: string): Promise<void> {
    const client = this.getClient()
    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      throw new Error(error.message)
    }
  }

  /**
   * Sign out current user.
   */
  static async signOut(): Promise<void> {
    const client = this.getClient()
    await client.auth.signOut()
  }

  /**
   * Get current authenticated user session, organization, and role.
   */
  static async getCurrentSession(): Promise<AuthSession> {
    const client = this.getClient()
    const { data: { session } } = await client.auth.getSession()

    if (!session?.user) {
      return { user: null, organization: null, role: null }
    }

    const userRepo = new UserRepository(client)
    const orgRepo = new OrganizationRepository(client)

    const dbUser = await userRepo.findById(session.user.id)
    if (!dbUser) {
      return { user: null, organization: null, role: null }
    }

    // Get user's active organization membership
    const members = await orgRepo.getMembers(dbUser.id)
    const firstMember = members[0]

    let org: Organization | null = null
    let role: UserRole | null = null

    if (firstMember) {
      const dbOrg = await orgRepo.findById(firstMember.organization_id)
      if (dbOrg) {
        org = {
          id: dbOrg.id,
          name: dbOrg.name,
          slug: dbOrg.slug,
          plan: 'free',
          billing_customer_id: dbOrg.billing_customer_id,
          created_at: dbOrg.created_at,
        }
        role = (firstMember.role as UserRole) || 'admin'
      }
    }

    return {
      user: {
        id: dbUser.id,
        email: dbUser.email,
        full_name: dbUser.full_name,
        avatar_url: dbUser.avatar_url,
        created_at: dbUser.created_at,
      },
      organization: org,
      role,
    }
  }
}
