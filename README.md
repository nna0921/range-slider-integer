# range-slider-integer

A **STATE module component** that synchronizes a **range slider** ([range-slider-anna](https://github.com/alyhxn/range-slider-anna)) and a **number input** ([input-integer-ui-anna](https://github.com/alyhxn/input-integer-ui-anna)) for reactive, two-way data binding in the **DataShell Shim Runtime**.

---

## Development

### Install dependencies
```bash
npm install
npm start
```
This command runs budo for live-reloading.
It is configured to use the -i STATE flag — the correct way to build for the shim.js runtime.

## Usage as a Submodule

To use this component inside another **STATE** module:

### 1. Require the module
```js
const rangeSliderInteger = require('range-slider-integer-anna')
```

### 2.Declare it in defaults()
Your module’s defaults function must declare it in the _ property:
```js
function defaults() {
  return {
    api,
    _: {
      'range-slider-integer-anna': { $: '' }
    }
  }
}
```
### 3. Create an instance
Your parent module’s defaults or api should define an instance:
```js
function defaults(opts) {
  const _ = {
    '..': { // '..' is the module that requires rangeSliderInteger
      0: ''  // This creates instance 0 of '..'
    }
  }
  return { _ }
}
```

### 4. Watch and append

In your parent module, get the instance sid from sdb.watch() and pass it to the component:
// In your parent module’s main async function
```js
const [rsiSub] = await sdb.watch(onbatch)
const rsi = await rangeSliderInteger(rsiSub)
shadow.append(rsi)
```
