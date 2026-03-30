import { useState, useEffect, useCallback } from 'react'
import { getUnitList, convertToBase, convertFromBase, convertValue, formatNum } from '../../utils/units'
import OpDropdown, { OP_LABELS } from './OpDropdown'

export default function InputPanel({ measureType, action }) {
  const units                     = getUnitList(measureType)
  const [fromVal, setFromVal]     = useState('1')
  const [toVal, setToVal]         = useState('1000')
  const [fromUnit, setFromUnit]   = useState(units[0])
  const [toUnit, setToUnit]       = useState(units[1] ?? units[0])
  const [op, setOp]               = useState('+')
  const [result, setResult]       = useState('')
  const [isError, setIsError]     = useState(false)
  const [resultKey, setResultKey] = useState(0)

  // Reset when measurement type changes
  useEffect(() => {
    const u = getUnitList(measureType)
    setFromUnit(u[0])
    setToUnit(u[1] ?? u[0])
    setFromVal('1')
    setToVal('1000')
  }, [measureType])

  const calculate = useCallback(() => {
    const fv = parseFloat(fromVal)
    const tv = parseFloat(toVal)

    function setRes(text, err = false) {
      setResult(text)
      setIsError(err)
      setResultKey((k) => k + 1)
    }

    if (action === 'comparison') {
      if (isNaN(fv) || isNaN(tv)) { setRes('Enter values to compare', true); return }
      const fb  = convertToBase(fv, fromUnit, measureType)
      const tb  = convertToBase(tv, toUnit,   measureType)
      const sym = fb < tb ? '<' : fb > tb ? '>' : '='
      setRes(`${formatNum(fv)} ${fromUnit} ${sym} ${formatNum(tv)} ${toUnit}`)

    } else if (action === 'conversion') {
      if (isNaN(fv)) { setRes('Enter a value to convert', true); return }
      const converted = convertValue(fv, fromUnit, toUnit, measureType)
      setToVal(formatNum(converted))
      setRes(`${formatNum(fv)} ${fromUnit} = ${formatNum(converted)} ${toUnit}`)

    } else if (action === 'arithmetic') {
      if (isNaN(fv) || isNaN(tv)) { setRes('Enter both values', true); return }
      const aBase = convertToBase(fv, fromUnit, measureType)
      const bBase = convertToBase(tv, toUnit,   measureType)
      let res
      switch (op) {
        case '+': res = aBase + bBase; break
        case '-': res = aBase - bBase; break
        case '×': res = aBase * bBase; break
        case '÷':
          if (bBase === 0) { setRes('Cannot divide by zero', true); return }
          res = aBase / bBase
          break
        default: return
      }
      const resultInFrom = convertFromBase(res, fromUnit, measureType)
      setRes(`${formatNum(fv)} ${fromUnit} ${OP_LABELS[op].symbol} ${formatNum(tv)} ${toUnit} = ${formatNum(resultInFrom)} ${fromUnit}`)
    }
  }, [fromVal, toVal, fromUnit, toUnit, op, action, measureType])

  useEffect(() => { calculate() }, [calculate])

  const isConversion = action === 'conversion'
  const isArithmetic = action === 'arithmetic'

  const inputCls = 'font-raleway text-[32px] font-extrabold text-[#1a1a2e] border-0 border-b-2 border-[#e0e7ff] outline-none bg-transparent w-full py-1 transition-all duration-200 focus:border-[#3b5bdb] max-sm:text-2xl'
  const selectCls = 'mt-0.5 px-3 py-2 border-[1.5px] border-[#e0e7ff] rounded-lg font-nunito text-[14px] font-bold text-[#1a1a2e] bg-white cursor-pointer outline-none transition-all duration-200 hover:border-[#b0b8e0] focus:border-[#3b5bdb] focus:shadow-[0_0_0_3px_rgba(59,91,219,0.10)] w-full'

  return (
    <div>
      {/* Inputs row */}
      <div className="flex items-end gap-5 flex-wrap max-sm:gap-2.5">

        {/* From / Value A */}
        <div className="flex-1 min-w-[140px] flex flex-col gap-2">
          <p className="text-[11px] font-extrabold tracking-[2px] text-[#6b7280]">
            {isArithmetic ? 'VALUE A' : 'FROM'}
          </p>
          <input
            type="number"
            value={fromVal}
            onChange={(e) => setFromVal(e.target.value)}
            className={inputCls}
          />
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className={selectCls}
          >
            {getUnitList(measureType).map((u) => (
              <option key={u} value={u}>{u.replace('_', ' ')}</option>
            ))}
          </select>
        </div>

        {/* Middle operator / arrow */}
        <div className="flex items-center justify-center pb-7 min-w-[70px] relative max-sm:pb-4">
          {isArithmetic ? (
            <OpDropdown selected={op} onSelect={setOp} />
          ) : (
            <svg viewBox="0 0 40 20" width="40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="4" y1="10" x2="28" y2="10" stroke="#3b5bdb" strokeWidth="2.5" strokeLinecap="round"/>
              <polyline points="22,4 32,10 22,16" stroke="#3b5bdb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>

        {/* To / Value B */}
        <div className="flex-1 min-w-[140px] flex flex-col gap-2">
          <p className="text-[11px] font-extrabold tracking-[2px] text-[#6b7280]">
            {isArithmetic ? 'VALUE B' : 'TO'}
          </p>
          <input
            type="number"
            value={toVal}
            readOnly={isConversion}
            onChange={(e) => !isConversion && setToVal(e.target.value)}
            className={`${inputCls} ${isConversion ? 'opacity-60 cursor-default' : ''}`}
          />
          <select
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            className={selectCls}
          >
            {getUnitList(measureType).map((u) => (
              <option key={u} value={u}>{u.replace('_', ' ')}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Result box */}
      <div
        key={resultKey}
        className="mt-6 flex items-center gap-3.5 bg-[#eef2ff] rounded-[10px] px-5 py-3.5 border-l-4 border-[#3b5bdb] min-h-[52px] animate-popIn"
      >
        <span className={`text-[17px] font-extrabold tracking-wide max-sm:text-sm ${isError ? 'text-[#e53935]' : 'text-[#3b5bdb]'}`}>
          {result || 'Select type and values to begin'}
        </span>
      </div>
    </div>
  )
}
