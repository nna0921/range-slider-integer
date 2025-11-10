let STATE
if (typeof window === 'undefined') {
  STATE = require('STATE')
} else {
  STATE = window.STATE || require('STATE')
}

const statedbRoot = STATE()

if (typeof statedbRoot.admin === 'function') {
  const adminApi = statedbRoot.admin()
  if (adminApi && typeof adminApi.add_admins === 'function') {
    adminApi.add_admins([__filename])
  }
}

const rangeSliderInteger = require('..')

async function main () {
  const opts = {
    sid: Symbol('range-slider-0'),
    min: 0,
    max: 100
  }

  const rsi = await rangeSliderInteger(opts)
  if (typeof document !== 'undefined') {
    document.body.appendChild(rsi)
  } else {
    console.log('Component created in Node environment:', rsi)
  }
}

main().catch(console.error)
