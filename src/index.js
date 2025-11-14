const STATE = require('STATE')
const statedb = STATE(__filename)

const { get } = statedb(defaults)

const range = require('range-slider-anna')
const integer = require('input-integer-ui-anna')

module.exports = range_slider_integer

async function range_slider_integer (opts) {
  const { sdb } = await get(opts.sid)
  const { drive } = sdb

  const on = {
    style: inject_style,
    data: ondata
  }

  const _ = {
    range: null,
    integer: null
  }

  const el = document.createElement('div')
  const shadow = el.attachShadow({ mode: 'closed' })
  shadow.innerHTML = `
    <div class="rsi">
      <div class="slider-container">
        <placeholder-slider></placeholder-slider>
      </div>
      <div class="input-container">
        <placeholder-input></placeholder-input>
      </div>
    </div>
  `

  const subs = await sdb.watch(onbatch)

  const el_range = range(subs[0], range_protocol)
  const el_integer = integer(subs[1], integer_protocol)

  shadow.querySelector('placeholder-slider').replaceWith(el_range)
  shadow.querySelector('placeholder-input').replaceWith(el_integer)

  return el

  async function onbatch (batch) {
    for (const { type, paths } of batch) {
      const data = await Promise.all(
        paths.map(path => drive.get(path).then(file => file.raw))
      )
      if (on[type]) on[type](data)
    }
  }

  function inject_style (data) {
    const sheet = new CSSStyleSheet()
    sheet.replaceSync(data[0])
    shadow.adoptedStyleSheets = [sheet]
  }

  function ondata (data) {
    const val = data[0].value
    if (_.range) _.range({ type: 'update', data: val })
    if (_.integer) _.integer({ type: 'update', data: val })
  }

  function range_protocol (send) {
    _.range = send
    return on_submodule_update
  }

  function integer_protocol (send) {
    _.integer = send
    return on_submodule_update
  }

  function on_submodule_update (msg) {
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
          'value.json': { raw: { value: 0 } }
        }
      },
      _: {
        'range-slider-anna': {
          0: { min, max }
        },
        'input-integer-ui-anna': {
          0: { min, max }
        }
      }
    }
  }
}
