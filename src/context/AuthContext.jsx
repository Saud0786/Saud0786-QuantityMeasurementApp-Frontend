import { createContext, useContext, useState } from 'react'
import { getSession, setSession, clearSession } from '../utils/storage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSessionState] = useState(() => getSession())

  function login(s) {
    setSession(s)
    setSessionState(s)
  }

  function logout() {
    clearSession()
    setSessionState(null)
  }

  return (
    <AuthContext.Provider value={{ session, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
