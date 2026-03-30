import { useState } from 'react'
import Navbar from '../components/dashboard/Navbar'
import TypeGrid from '../components/dashboard/TypeGrid'
import ActionTabs from '../components/dashboard/ActionTabs'
import InputPanel from '../components/dashboard/InputPanel'

export default function DashboardPage() {
  const [measureType, setMeasureType] = useState('length')
  const [action, setAction]           = useState('comparison')

  return (
    <div className="min-h-screen bg-[#f0f4ff] font-nunito text-[#1a1a2e]">
      <Navbar />

      <main className="max-w-[880px] mx-auto px-5 py-7 flex flex-col gap-5 max-sm:px-3 max-sm:py-3.5 max-sm:gap-3.5">

        {/* Choose Type */}
        <section
          className="bg-white rounded-2xl px-7 py-6 shadow-[0_2px_16px_rgba(59,91,219,0.08)] animate-fadeIn max-sm:px-4 max-sm:py-5"
        >
          <p className="text-[11px] font-extrabold tracking-[2px] text-[#6b7280] mb-4">CHOOSE TYPE</p>
          <TypeGrid selected={measureType} onSelect={setMeasureType} />
        </section>

        {/* Choose Action */}
        <section
          className="bg-white rounded-2xl px-7 py-6 shadow-[0_2px_16px_rgba(59,91,219,0.08)] animate-fadeIn max-sm:px-4 max-sm:py-5"
          style={{ animationDelay: '0.07s' }}
        >
          <p className="text-[11px] font-extrabold tracking-[2px] text-[#6b7280] mb-4">CHOOSE ACTION</p>
          <ActionTabs selected={action} onSelect={setAction} />
        </section>

        {/* Input & Result */}
        <section
          className="bg-white rounded-2xl px-7 py-6 shadow-[0_2px_16px_rgba(59,91,219,0.08)] animate-fadeIn max-sm:px-4 max-sm:py-5"
          style={{ animationDelay: '0.14s' }}
        >
          <InputPanel measureType={measureType} action={action} />
        </section>

      </main>
    </div>
  )
}
