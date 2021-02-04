const moment = require('moment')
const date = moment()
console.log(`Date: ${date}`)
// const dateval = date.valueOf()
// console.log(`Date Val: ${dateval}`)
// const localDate = date.toLocaleString('en-AU')
// console.log(`Local Date: ${localDate}`)
const isoLocalDate = date.format()
console.log(`ISO Local Date: ${isoLocalDate}`)

const target = 115

// setInterval(() => {
//     process.stdout.write('\rTime remaining: ' + target + ' seconds')
//     target--
// }, 1000)
