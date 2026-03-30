import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PasswordInput from './PasswordInput'
import { useAuth } from '../../context/AuthContext'
import { getUsers, saveUsers } from '../../utils/storage'
import { useFormError } from '../../hooks/useFormError'

export default function SignupForm({ onSwitch }) {
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [mobile, setMobile]   = useState('')
  const [errors, setErrors]   = useState({})
  const { error, showError }  = useFormError()
  const { login }             = useAuth()
  const navigate              = useNavigate()

  const pwTooShort = password.length > 0 && password.length < 6
  const mobInvalid = mobile.length > 0 && mobile.length < 10

  function markError(fields) {
    const map = {}
    fields.forEach((f) => (map[f] = true))
    setErrors(map)
  }

  function clearFieldError(field) {
    setErrors((prev) => ({ ...prev, [field]: false }))
  }

  function handleSignup() {
    if (!name)                    { markError(['name']);     showError('Please enter your full name.');             return }
    if (!email)                   { markError(['email']);    showError('Please enter your email.');                 return }
    if (!password)                { markError(['password']); showError('Please create a password.');               return }
    if (password.length < 6)      { markError(['password']); showError('Password must be at least 6 characters.'); return }
    if (!/^\d{10}$/.test(mobile)) { markError(['mobile']);   showError('Enter a valid 10-digit mobile number.');   return }

    const users = getUsers()
    if (users.find((u) => u.email === email)) {
      markError(['email'])
      showError('This email is already registered.')
      return
    }

    users.push({ name, email, password, mobile })
    saveUsers(users)
    login({ name, email, mobile })
    navigate('/dashboard')
  }

  const inputBase = 'w-full px-3.5 py-2.5 border-[1.5px] rounded-lg font-nunito text-sm text-[#1a1a2e] outline-none transition-all duration-200'
  const inputNormal = 'border-[#e0e0e0] hover:border-[#b0b8e0] focus:border-[#3b5bdb] focus:shadow-[0_0_0_3px_rgba(59,91,219,0.12)] focus:bg-[#f8faff]'
  const inputErr = 'border-danger-500 bg-red-50'

  return (
    <div className="flex flex-col gap-4">
      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-bold text-[#1a1a2e]">Full Name</label>
        <input
          type="text"
          value={name}
          placeholder="Enter your full name"
          onChange={(e) => { setName(e.target.value); clearFieldError('name') }}
          className={`${inputBase} ${errors.name ? inputErr : inputNormal}`}
        />
      </div>

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
          id="signupPassword"
          value={password}
          placeholder="Create a password"
          onChange={(v) => { setPassword(v); clearFieldError('password') }}
          hasError={errors.password}
        />
        {pwTooShort && <span className="text-[12px] text-danger-500">Min 6 characters.</span>}
      </div>

      {/* Mobile */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-bold text-[#1a1a2e]">Mobile Number</label>
        <input
          type="tel"
          value={mobile}
          placeholder="Enter mobile number"
          maxLength={10}
          onChange={(e) => { setMobile(e.target.value.replace(/\D/g, '')); clearFieldError('mobile') }}
          className={`${inputBase} ${errors.mobile ? inputErr : inputNormal}`}
        />
        {mobInvalid && <span className="text-[12px] text-danger-500">Enter valid 10-digit number.</span>}
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
        onClick={handleSignup}
        className="mt-1 bg-danger-500 hover:bg-danger-700 text-white rounded-lg py-3 font-nunito text-[15px] font-extrabold tracking-wide
          shadow-[0_4px_16px_rgba(229,57,53,0.35)] hover:shadow-[0_8px_24px_rgba(229,57,53,0.45)]
          transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
      >
        Create Account
      </button>

      <p className="text-center text-[13px] text-[#6b7280]">
        Already have an account?{' '}
        <button type="button" onClick={onSwitch} className="text-danger-500 font-bold hover:underline">
          Login
        </button>
      </p>
    </div>
  )
}
