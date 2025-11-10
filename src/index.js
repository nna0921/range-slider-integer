let STATE
if (typeof window === 'undefined') {
  STATE = require('STATE')
} else {
  STATE = window.STATE || function fallbackSTATE (file) {
    return function (fallback) {
      return async function get (sid) {
        return {
          id: sid,
          sdb: fallback.api(),
          subs: fallback._ || {}
        }
      }
    }
  }
}

const range = require('range-slider-anna')
const integer = require('input-integer-ui-anna')

const statedb = STATE(__filename)
const sdbInstance = statedb(fallbackModule())

function fallbackModule () {
  function fallbackInstance () {
    const tree = {
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
      'data/': { 'value.json': { raw: { value: 0 } } }
    }

    const subsTree = {
      'range-slider-anna': {
        0: {
          id: 'fallback-slider',
          tree: { 'data/': { 'value.json': { raw: { value: 0 } } } }
        },
        mapping: { style: 'style' }
      },
      'input-integer-ui-anna': {
        0: {
          id: 'fallback-input',
          tree: { 'data/': { 'value.json': { raw: { value: 0 } } } }
        },
        mapping: { style: 'style' }
      }
    }

    const drive = {
      get: async path => {
        const parts = path.split('/')
        let node = tree
        for (const part of parts) {
          if (node && node[part]) node = node[part]
          else return null
        }
        return node
      },
      put: async (path, data) => {
        const parts = path.split('/')
        let node = tree
        for (let i = 0; i < parts.length - 1; i++) {
          const part = parts[i]
          node[part] = node[part] || {}
          node = node[part]
        }
        node[parts[parts.length - 1]] = { raw: data }
        return node[parts[parts.length - 1]]
      },
      list: async (path = '') => {
        let node = tree
        if (path) {
          const parts = path.split('/')
          for (const part of parts) {
            if (node[part]) node = node[part]
            else return []
          }
        }
        return Object.keys(node)
      },
      has: async path => !!(await drive.get(path))
    }

    return {
      _: subsTree,
      drive,
      watch: async onbatch => []
    }
  }

  return {
    api: fallbackInstance,
    _: fallbackInstance()._,
    drive: fallbackInstance().drive
  }
}

module.exports = async function rangeSliderInteger (opts) {
  const { sdb: instanceSdb, subs } = await sdbInstance(opts.sid)
  await instanceSdb.watch(onbatch)

  const el = document.createElement('div')
  const shadow = el.attachShadow({ mode: 'closed' })
  shadow.innerHTML = `
    <div class="rsi">
      <div class="slider-container"></div>
      <div class="input-container"></div>
    </div>
  `

  const sliderContainer = shadow.querySelector('.slider-container')
  const inputContainer = shadow.querySelector('.input-container')

  const sliderSub =
    (subs && subs['range-slider-anna'] && subs['range-slider-anna'][0]) ||
    fallbackModule()._['range-slider-anna'][0]
  const inputSub =
    (subs && subs['input-integer-ui-anna'] && subs['input-integer-ui-anna'][0]) ||
    fallbackModule()._['input-integer-ui-anna'][0]

  const sliderEl = await range(sliderSub, createProtocol('slider'))
  const inputEl = await integer(inputSub, createProtocol('input'))

  sliderContainer.append(sliderEl)
  inputContainer.append(inputEl)

  const initialValue =
    (await instanceSdb.drive.get('data/value.json'))?.raw?.value ??
    opts.min ??
    0
  if (sliderEl.value !== undefined) sliderEl.value = initialValue
  if (inputEl.value !== undefined) inputEl.value = initialValue

  return el

  async function onbatch (batch) {
    for (const { type, paths } of batch) {
      const data = await Promise.all(
        paths.map(path => instanceSdb.drive.get(path).then(f => f?.raw))
      )
      if (type === 'data') handleDataChange(data)
      if (type === 'style') injectStyles(data)
    }
  }

  function injectStyles (data) {
    const css = data[0]
    if (css && typeof CSSStyleSheet !== 'undefined') {
      const sheet = new CSSStyleSheet()
      sheet.replaceSync(css)
      shadow.adoptedStyleSheets = [sheet]
    }
  }

  function handleDataChange (data) {
    const valueData = data.find(d => d && d.value !== undefined)
    if (valueData) {
      if (sliderEl.value !== undefined) sliderEl.value = valueData.value
      if (inputEl.value !== undefined) inputEl.value = valueData.value
    }
  }

  function createProtocol (componentName) {
    return function protocol (message, notify) {
      let lastNotified = null
      setInterval(async () => {
        const file = await instanceSdb.drive.get('data/value.json')
        const current = file?.raw?.value
        if (current !== lastNotified) {
          lastNotified = current
          notify({ type: 'update', data: current })
        }
      }, 100)

      return function listen (msg) {
        if (msg.type === 'update') {
          instanceSdb.drive.put('data/value.json', { value: msg.data })
        }
      }
    }
  }
}
