const STATE = require('STATE')

const statedbFile = STATE(__filename)
const { sdb } = statedbFile(defaults)

const rangeSliderInteger = require('..')

setTimeout(() => main().catch(console.error), 0)

async function main () {
  const [sub] = await sdb.watch(onbatch)
  const rsi = await rangeSliderInteger(sub)
  document.body.append(rsi)
}

function onbatch (batch) {
}

function defaults (opts) {
  const _ = {
    '..': {
      0: ''
    }
  }
  return { _ }
}
