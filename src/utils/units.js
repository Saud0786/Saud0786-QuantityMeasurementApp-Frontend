export const UNITS = {
  length: {
    base: 'Meter',
    units: {
      Kilometer:  1000,
      Meter:      1,
      Centimeter: 0.01,
      Millimeter: 0.001,
      Mile:       1609.344,
      Yard:       0.9144,
      Foot:       0.3048,
      Inch:       0.0254,
    },
  },
  weight: {
    base: 'Kilogram',
    units: {
      Kilogram:  1,
      Gram:      0.001,
      Milligram: 0.000001,
      Pound:     0.453592,
      Ounce:     0.0283495,
      Tonne:     1000,
    },
  },
  temperature: null,
  volume: {
    base: 'Liter',
    units: {
      Liter:         1,
      Milliliter:    0.001,
      Gallon:        3.78541,
      Quart:         0.946353,
      Pint:          0.473176,
      Cup:           0.24,
      'Fluid Ounce': 0.0295735,
      Cubic_Meter:   1000,
    },
  },
}

export const TEMP_UNITS = ['Celsius', 'Fahrenheit', 'Kelvin']

export function getUnitList(type) {
  if (type === 'temperature') return TEMP_UNITS
  return Object.keys(UNITS[type].units)
}

function toTempBase(value, unit) {
  if (unit === 'Celsius')    return value
  if (unit === 'Fahrenheit') return (value - 32) * 5 / 9
  return value - 273.15
}

function fromTempBase(celsius, unit) {
  if (unit === 'Celsius')    return celsius
  if (unit === 'Fahrenheit') return celsius * 9 / 5 + 32
  return celsius + 273.15
}

export function convertToBase(value, unit, type) {
  if (type === 'temperature') return toTempBase(value, unit)
  return value * UNITS[type].units[unit]
}

export function convertFromBase(baseValue, unit, type) {
  if (type === 'temperature') return fromTempBase(baseValue, unit)
  return baseValue / UNITS[type].units[unit]
}

export function convertValue(value, fromUnit, toUnit, type) {
  if (fromUnit === toUnit) return value
  const base = convertToBase(value, fromUnit, type)
  return convertFromBase(base, toUnit, type)
}

export function formatNum(n) {
  if (Math.abs(n) >= 1e6 || (Math.abs(n) < 0.0001 && n !== 0)) {
    return n.toExponential(4)
  }
  return parseFloat(n.toFixed(4)).toString()
}
