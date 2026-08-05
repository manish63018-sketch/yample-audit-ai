import type { UserRole } from '@/types'

/**
 * Role-Based Access Control (RBAC) Permissions Matrix
 * Roles: admin, developer, billing, client
 */

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  admin: 4,
  developer: 3,
  billing: 2,
  client: 1,
}

export interface PermissionCheck {
  role: UserRole
  requiredRole: UserRole
}

/**
 * Check if a role meets or exceeds a minimum required role level.
 */
export function hasRole(currentRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[currentRole] >= ROLE_HIERARCHY[requiredRole]
}

/**
 * Permission guards for common application actions.
 */
export const Permissions = {
  canManageTeam: (role: UserRole) => hasRole(role, 'admin'),
  canManageBilling: (role: UserRole) => role === 'admin' || role === 'billing',
  canRunAudits: (role: UserRole) => hasRole(role, 'developer'),
  canManageLeads: (role: UserRole) => hasRole(role, 'developer'),
  canViewReports: (role: UserRole) => hasRole(role, 'client'),
  canExportReports: (role: UserRole) => hasRole(role, 'developer'),
  canManageApiKeys: (role: UserRole) => hasRole(role, 'admin'),
}
