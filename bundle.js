(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (__filename){(function (){
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

}).call(this)}).call(this,"/demo/demo.js")
},{"..":5,"STATE":2}],2:[function(require,module,exports){

},{}],3:[function(require,module,exports){
module.exports = inputInteger

const sheet = new CSSStyleSheet()
const theme=get_theme()
sheet.replaceSync(theme)
var id=0
function inputInteger (opts, protocol)
{
    const {min = 0,max = 1000} = opts
    const name = `input-integer-${id++}`
    
    const notify = protocol({from: name},listen)
     function listen(message)
    {
        const {type,data}=message
        if(type === "update")
        {
            input.value=data
        }

    }

    const el = document.createElement('div')
    const shadow = el.attachShadow({mode: 'closed'})
    const input= document.createElement('input')
    input.type='number'
    input.min=min //or u could write opts.min
    input.max=max
    input.onkeyup = (e) => handle_onkeyup(e, input, min, max)
    input.onmouseleave = (e) =>  handle_onmouseleave_and_blur(e, input, min)
    input.onblur = (e) =>  handle_onmouseleave_and_blur(e, input, min)
    shadow.append(input)
   
    shadow.adoptedStyleSheets = [sheet]
    return el
    //handlers
    function handle_onkeyup(e, input, min, max)
    {
        const val= Number(e.target.value)
        const val_len=val.toString().length
        const min_len=min.toString().length
        if(val>max)input.value=max
        else if (val_len ==min_len && val<min) input.value=min
        
        notify({from:name ,type:'update',data:val})
    }

    function handle_onmouseleave_and_blur(e, input, min)
    {
        const val= Number(e.target.value)
        if(val<min)input.value=''
    }
}

function get_theme()
{
  return `
        :host {
            --b: 9, 0%;
            --color-white: var(--b), 100%;
            --color-black: var(--b), 4%;
            --color-grey: var(--b), 85%;
            --bg-color: var(--color-grey);
            --shadow-xy: 0 8px;
            --shadow-blur: 8px;
            --shadow-color: var(--color-black);
            --shadow-opacity: 0;
            --shadow-opacity-focus: 0.65;
        }

        input {
            text-align: left;
            font-size: 1.4rem;
            font-weight: 200;
            color: hsla(var(--color-black), 1);
            background-color: hsla(var(--bg-color), 1);
            padding: 8px 12px;
            box-shadow: var(--shadow-xy) var(--shadow-blur) hsla(var(--shadow-color), var(--shadow-opacity));
            transition: font-size .3s, color .3s, background-color .3s, box-shadow .3s ease-in-out;
            outline: none;
            border: 1px solid hsla(var(--bg-color), 1);
            border-radius: 8px;
            width: 100px;
        }

        input:focus {
            --shadow-color: var(--color-black);
            --shadow-opacity: var(--shadow-opacity-focus);
            --shadow-xy: 4px 4px;
            box-shadow: var(--shadow-xy) var(--shadow-blur) hsla(var(--shadow-color), var(--shadow-opacity));
        }

        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
            -webkit-appearance: none;
        }
    `
}

},{}],4:[function(require,module,exports){
module.exports = rangeSlider

var id=0;

function rangeSlider(opts, protocol){
   
    const { min=0, max=1000 }=opts
    const name = `range-${id++}`

    const notify =protocol({from: name},listen) //notify parent
    function listen(message)
    {
        const {type,data}=message
        if(type === "update")
        {
            input.value=data
            fill.style.width = `${data/max*100}%`
            input.focus()
        }

    }
    const el=document.createElement('div')
    el.classList.add('container')

    const shadow = el.attachShadow({mode:'closed'})
    const input =document.createElement('input')
    input.type='range'
    input.min=min
    input.max=max
    input.value=min

    input.oninput=handle_input
    const bar = document.createElement('div')
    bar.classList.add('bar')
    const ruler= document.createElement('div')
    ruler.classList.add('ruler')
    const fill= document.createElement('div')
    fill.classList.add('fill')
    bar.append(ruler,fill)
    const style = document.createElement('style')
    style.textContent=get_theme()
    
    shadow.append(style, input, bar)
    return el
    function handle_input(e)
    {
        const val= Number(e.target.value)
        console.log(val);
        fill.style.width = `${val/max*100}%`
        notify({from:name,type:'update',data:val})
    }
}

function get_theme()
{
    return `
    :host{
        box-sizing: border-box;
    }
    *, *:before, *:after{
        box-sizing: inherit;
    }
    :host {
        --white: hsla(0, 0%, 100%, 1);
        --transparent : hsla(0,0%,0%, 0);
        --grey : hsla(0 ,0% ,90% , 1);
        --blue : hsla(207 ,88% , 66% , 1);
        position: relative;
        width: 100%;
        height: 16px; 
    }   
    input{
       position: absolute;
       top: 0;
       left: 0;
       width: 100%;
       -webkit-appearance: none;
       outline:none;
       margin: 0;
       z-index: 2;
       background-color: var(--transparent);
    }
    .bar {
        position: absolute;
        top: 3px;
        left: 0;
        z-index: 0;
        height: 10px;
        width: 100%;
        border-radius: 8px;
        overflow: hidden;
        background-color: var(--grey);
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .ruler {
        position: absolute;
        height: 6px;
        width: 100%;
        transform: scale(-1, 1);
        background-size: 20px 8px;
        background-image: repeating-linear-gradient(
            to right,
            var(--grey) 0px,
            var(--grey) 17px,
            var(--white) 17px,
            var(--white) 20px
        );
    }
    .fill {
        position: absolute;
        height: 100%;
        width: 0%;
        background-color: var(--grey);
    }
    input:focus + .bar .fill,
    input:focus-within + .bar .fill,
    input:active + .bar .fill {
        background-color: var(--blue);
    }
    input::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background-color: var(--white);
        border: 1px solid var(--grey);
        cursor: pointer;
        box-shadow: 0 3px 6px rgba(0, 0, 0, .4);
        transition: background-color .3s, box-shadow .15s linear;
    }
    input::-webkit-slider-thumb:hover {
        box-shadow: 0 0 0 14px rgba(94, 176, 245, .8);
    }
    `
}

},{}],5:[function(require,module,exports){
(function (__filename){(function (){
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

}).call(this)}).call(this,"/src/index.js")
},{"STATE":2,"input-integer-ui-anna":3,"range-slider-anna":4}]},{},[1]);
