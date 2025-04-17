"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "../lib/supabase"
import type { Session, User, AuthError } from "@supabase/supabase-js"

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  isVerified: boolean
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signUp: (
    email: string,
    password: string,
    name: string,
  ) => Promise<{
    error: AuthError | null
    needsVerification: boolean
  }>
  signOut: () => Promise<void>
  forgotPassword: (email: string) => Promise<{ error: AuthError | null }>
  resendVerificationEmail: (email: string) => Promise<{ error: AuthError | null }>
  verifyOtp: (email: string, token: string, type: "signup" | "recovery") => Promise<{ error: AuthError | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isVerified, setIsVerified] = useState(false)

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setIsVerified(session?.user?.email_confirmed_at != null)
      setIsLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setIsVerified(session?.user?.email_confirmed_at != null)
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      return { error }
    } catch (error) {
      return { error: error as AuthError }
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          emailRedirectTo: "sagrapp://verify-email",
        },
      })

      // Check if user needs to verify their email
      const needsVerification = !error && !data.session

      return { error, needsVerification }
    } catch (error) {
      return { error: error as AuthError, needsVerification: false }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.log("Error signing out:", error)
    }
  }

  const forgotPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "sagrapp://reset-password",
      })
      return { error }
    } catch (error) {
      return { error: error as AuthError }
    }
  }

  const resendVerificationEmail = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: "sagrapp://verify-email",
        },
      })
      return { error }
    } catch (error) {
      return { error: error as AuthError }
    }
  }

  const verifyOtp = async (email: string, token: string, type: "signup" | "recovery") => {
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type,
      })
      return { error }
    } catch (error) {
      return { error: error as AuthError }
    }
  }

  const value = {
    user,
    session,
    isLoading,
    isVerified,
    signIn,
    signUp,
    signOut,
    forgotPassword,
    resendVerificationEmail,
    verifyOtp,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
