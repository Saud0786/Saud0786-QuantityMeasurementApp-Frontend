import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PasswordInput from './PasswordInput'
import { useAuth } from '../../context/AuthContext'
import { getUsers } from '../../utils/storage'
import { useFormError } from '../../hooks/useFormError'

export default function LoginForm({ onSwitch }) {
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors]   = useState({})
  const { error, showError }  = useFormError()
  const { login }             = useAuth()
  const navigate              = useNavigate()

  function markError(fields) {
    const map = {}
    fields.forEach((f) => (map[f] = true))
    setErrors(map)
  }

  function clearFieldError(field) {
    setErrors((prev) => ({ ...prev, [field]: false }))
  }

  function handleLogin() {
    if (!email)    { markError(['email']);    showError('Please enter your email.');    return }
    if (!password) { markError(['password']); showError('Please enter your password.'); return }

    const user = getUsers().find((u) => u.email === email && u.password === password)
    if (!user) {
      markError(['email', 'password'])
      showError('Invalid email or password.')
      return
    }

    login({ name: user.name, email: user.email, mobile: user.mobile })
    navigate('/dashboard')
  }

  const inputBase = 'w-full px-3.5 py-2.5 border-[1.5px] rounded-lg font-nunito text-sm text-[#1a1a2e] outline-none transition-all duration-200'
  const inputNormal = 'border-[#e0e0e0] hover:border-[#b0b8e0] focus:border-[#3b5bdb] focus:shadow-[0_0_0_3px_rgba(59,91,219,0.12)] focus:bg-[#f8faff]'
  const inputErr = 'border-danger-500 bg-red-50'

  return (
    <div className="flex flex-col gap-4">
      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-bold text-[#1a1a2e]">Email Id</label>
        <input
          type="email"
          value={email}
          placeholder="Enter your email"
          onChange={(e) => { setEmail(e.target.value); clearFieldError('email') }}
          className={`${inputBase} ${errors.email ? inputErr : inputNormal}`}
        />
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-bold text-[#1a1a2e]">Password</label>
        <PasswordInput
          id="loginPassword"
          value={password}
          placeholder="Enter your password"
          onChange={(v) => { setPassword(v); clearFieldError('password') }}
          hasError={errors.password}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="text-[12px] text-danger-500 font-semibold bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
          {error}
        </div>
      )}

      {/* Button */}
      <button
        type="button"
        onClick={handleLogin}
        className="mt-1 bg-danger-500 hover:bg-danger-700 text-white rounded-lg py-3 font-nunito text-[15px] font-extrabold tracking-wide
          shadow-[0_4px_16px_rgba(229,57,53,0.35)] hover:shadow-[0_8px_24px_rgba(229,57,53,0.45)]
          transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
      >
        Login
      </button>

      <p className="text-center text-[13px] text-[#6b7280]">
        Don&apos;t have an account?{' '}
        <button type="button" onClick={onSwitch} className="text-danger-500 font-bold hover:underline">
          Sign Up
        </button>
      </p>
    </div>
  )
}
