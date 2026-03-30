import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BrandPanel from '../components/auth/BrandPanel'
import LoginForm from '../components/auth/LoginForm'
import SignupForm from '../components/auth/SignupForm'
import { useAuth } from '../context/AuthContext'

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState('login')
  const [visible, setVisible]     = useState('login')
  const [animating, setAnimating] = useState(false)
  const { session }               = useAuth()
  const navigate                  = useNavigate()

  useEffect(() => {
    if (session) navigate('/dashboard', { replace: true })
  }, [session, navigate])

  function switchTab(tab) {
    if (tab === activeTab || animating) return
    setAnimating(true)
    setActiveTab(tab)
    setTimeout(() => {
      setVisible(tab)
      setAnimating(false)
    }, 180)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f4ff] font-nunito p-4">
      {/* Animated blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute w-[500px] h-[500px] rounded-full bg-[#a8c0ff] opacity-35 blur-[80px] -top-36 -left-24 animate-float1" />
        <div className="absolute w-[400px] h-[400px] rounded-full bg-[#ffd6d6] opacity-35 blur-[80px] -bottom-24 -right-24 animate-float2" />
        <div className="absolute w-[300px] h-[300px] rounded-full bg-[#ffebc8] opacity-35 blur-[80px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-float3" />
      </div>

      {/* Card */}
      <div className="relative z-10 flex bg-white rounded-[20px] shadow-[0_24px_64px_rgba(0,0,0,0.12)] overflow-hidden w-full max-w-[700px] min-h-[420px] animate-slideUp max-sm:flex-col max-sm:max-w-[420px] max-sm:min-h-0">
        <BrandPanel />

        {/* Form panel */}
        <div className="flex-1 flex flex-col px-10 py-9 max-sm:px-5 max-sm:py-6 overflow-y-auto">
          {/* Tabs */}
          <div className="flex gap-6 mb-7 border-b border-[#e0e0e0]">
            {['login', 'signup'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => switchTab(tab)}
                className={`pb-2 text-[13px] font-bold tracking-[1px] uppercase relative transition-colors duration-200
                  after:content-[''] after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-[2px]
                  after:bg-[#e53935] after:transition-transform after:duration-250 after:origin-left
                  ${activeTab === tab
                    ? 'text-[#1a1a2e] after:scale-x-100'
                    : 'text-[#6b7280] hover:text-[#1a1a2e] after:scale-x-0'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Animated form */}
          <div
            className="transition-all duration-200"
            style={{
              opacity:   animating ? 0 : 1,
              transform: animating ? 'translateX(12px)' : 'translateX(0)',
            }}
          >
            {visible === 'login'
              ? <LoginForm  onSwitch={() => switchTab('signup')} />
              : <SignupForm onSwitch={() => switchTab('login')}  />
            }
          </div>
        </div>
      </div>
    </div>
  )
}
