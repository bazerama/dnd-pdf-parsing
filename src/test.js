const moment = require('moment')
const consts = require('./common/consts')
const date = moment()
console.log(`Date: ${date}`)
const isoLocalDate = date.format()
console.log(`ISO Local Date: ${isoLocalDate}`)

let flagFutureElements = 0
decodedText = 'Bearfolk Chie'
consts.brokenDecodedTextList.forEach((brokenText) => {
    if (decodedText === brokenText.brokenEncoding) {
        decodedText = brokenText.fixedEncoding
        flagFutureElements += brokenText.flagElements.valueOf()
        console.log(`flagFutureElements set to ${flagFutureElements}`)
    }
})
// if (flagFutureElements <= 0) {
//     counter += textArray.push(decodedText)
// } else {
//     console.log(`flagFutureElements is ${flagFutureElements}`)
//     console.log(`skipping adding ${decodedText}`)
// }
// console.log(`decodedText is ${decodedText}`)

const teststr = '192-205'
const test = parseInt(teststr)
console.log(test.toString())

const target = 115

// setInterval(() => {
//     process.stdout.write('\rTime remaining: ' + target + ' seconds')
//     target--
// }, 1000)
