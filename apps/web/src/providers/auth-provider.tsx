'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { AuthService, type AuthSession, type SignUpParams, type SignInParams } from '@/services/auth.service'
import type { User, Organization, UserRole } from '@/types'

interface AuthContextType {
  user: User | null
  organization: Organization | null
  role: UserRole | null
  isLoading: boolean
  isAuthenticated: boolean
  signIn: (params: SignInParams) => Promise<void>
  signUp: (params: SignUpParams) => Promise<void>
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession>({
    user: null,
    organization: null,
    role: null,
  })
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const refreshSession = useCallback(async () => {
    try {
      setIsLoading(true)
      const currentSession = await AuthService.getCurrentSession()
      setSession(currentSession)
    } catch (err) {
      console.error('Failed to load auth session:', err)
      setSession({ user: null, organization: null, role: null })
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshSession()
  }, [refreshSession])

  const signIn = async (params: SignInParams) => {
    setIsLoading(true)
    try {
      const newSession = await AuthService.signIn(params)
      setSession(newSession)
      router.push('/dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (params: SignUpParams) => {
    setIsLoading(true)
    try {
      const newSession = await AuthService.signUp(params)
      setSession(newSession)
      router.push('/dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    setIsLoading(true)
    try {
      await AuthService.signOut()
      setSession({ user: null, organization: null, role: null })
      router.push('/login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user: session.user,
        organization: session.organization,
        role: session.role,
        isLoading,
        isAuthenticated: Boolean(session.user),
        signIn,
        signUp,
        signOut,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
