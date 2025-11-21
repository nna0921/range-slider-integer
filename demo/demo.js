const STATE = require('STATE')
const statedb = STATE(__filename)
statedb.admin()

const { sdb } = statedb(defaults)

const range_slider_integer = require('..')

main().catch(console.error)

async function main () {
  const subs = await sdb.watch(onbatch)
  const [{ sid }] = subs
  if (!sid) throw new Error('No instance SID returned from sdb.watch')
  const rsi = await range_slider_integer({ sid })
  document.body.append(rsi)
}

function onbatch (batch) {
  console.log('drive batch update:', batch)
}

function defaults () {
  const _ = {
    '..': {
      0: { min: 0, max: 100 }
    }
  }

  return { _, api }

  function api (opts = {}) {
    return {

    }
  }
}
