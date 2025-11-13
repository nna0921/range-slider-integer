const STATE = require('STATE')
const stateDbFile = STATE(__filename)

stateDbFile.admin()

const rangeSliderInteger = require('..')

function defaults () {
  const _ = {
    '..': {
      0: { min: 0, max: 100 }
    }
  }
  return { _, api }
}

function api (opts = {}) {
  return {}
}

async function main () {
  const sid = 'root'
  const stateDbInstance = stateDbFile(defaults)
  const { sdb } = await stateDbInstance.get(sid)
  sdb.watch(onBatch)
  const rsi = await rangeSliderInteger({ sid })
  document.body.append(rsi)
}

function onBatch (batch) {}

main().catch(console.error)
