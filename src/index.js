const range =require('range-slider-anna')
const integer =require('input-integer-ui-anna')

module.exports =rangeSliderInteger

function rangeSliderInteger (opts)
{
    const el = document.createElement('div')
    const shadow = el.attachShadow({mode: 'closed'})

    const rangeSlider = range(opts,listen)
    const inputInteger = integer(opts, listen)

    const output = document.createElement('div')
    output.innerText=0

    shadow.append(rangeSlider, inputInteger, output)
    return el
    function listen(message){
        const {type, body} = message 
        if (type==='update') output.innerText = body
    }

}