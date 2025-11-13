const STATE = require('STATE')
const statedb = STATE(__filename)
const { get } = statedb(defaults)
const range = require('range-slider-anna')
const integer = require('input-integer-ui-anna')
module.exports = rangeSliderInteger

async function rangeSliderInteger (opts) {
  const { sdb } = await get(opts.sid)
  const { drive } = sdb
  const _ = { range: null, integer: null }
  const el = document.createElement('div')
  const shadow = el.attachShadow({ mode: 'closed' })
  shadow.innerHTML = `
    <div class="rsi">
      <div class="slider-container"><placeholder-slider></placeholder-slider></div>
      <div class="input-container"><placeholder-input></placeholder-input></div>
    </div>
  `
  const configFile = await drive.get('data/config.json')
  const { min, max } = configFile.raw
  const subOpts = { min, max }
  const elRange = await range(subOpts, rangeProtocol)
  const elInteger = await integer(subOpts, integerProtocol)
  shadow.querySelector('placeholder-slider').replaceWith(elRange)
  shadow.querySelector('placeholder-input').replaceWith(elInteger)
  return el

  function rangeProtocol (send) {
    _.range = send
    return onSubmoduleUpdate
  }

  function integerProtocol (send) {
    _.integer = send
    return onSubmoduleUpdate
  }

  function onSubmoduleUpdate (msg) {
    if (msg.type === 'update') {
      drive.put('data/value.json', { value: msg.data })
    }
  }
}

function defaults () {
  return {
    api,
    _: {
      'range-slider-anna': { $: '' },
      'input-integer-ui-anna': { $: '' }
    }
  }

  function api (opts = {}) {
    const { min = 0, max = 100 } = opts
    return {
      drive: {
        'style/': {
          'main.css': {
            raw: `
            .rsi {
              display: grid;
              grid-template-columns: 8fr 1fr;
              align-items: center;
              justify-items: center;
              padding: 5%;
              gap: 16px;
              font-family: sans-serif;
            }
            .slider-container, .input-container { width: 100%; }
            `
          }
        },
        'data/': {
          'value.json': { raw: { value: 0 } },
          'config.json': { raw: { min, max } }
        }
      }
    }
  }
}
