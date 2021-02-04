const fs = require('fs')
const path = require('path')
const PDFParser = require('pdf2json')
// const figlet = require('figlet');
// const shell = require('shelljs');
const consts = require('./common/consts')

const pdfParser = new PDFParser()

pdfParser.on('pdfParser_dataError', (errData) => {
    console.error(errData.parserError)
})

pdfParser.on('pdfParser_dataReady', (pdfData) => {
    const date = new Date().toLocaleString('en-AU')
    console.log(`date: ${date}`)
    const isoDate = new Date(date).toISOString()
    console.log(`isoDate: ${isoDate}`)

    console.log('Parsed PDF Data')

    let counter = 0
    let flagFutureElements = 0
    const textArray = []
    const pages = pdfData['formImage']['Pages']
    pages.forEach((page) => {
        const texts = page['Texts']
        texts.forEach((text, textIndex) => {
            const textString = text['R'][0]['T']
            let decodedText = decodeURIComponent(textString)
            let newText = ''
            let alternateNewText = ''
            consts.brokenDecodedTextList.forEach((brokenText) => {
                if (textString === brokenText.brokenEncoding) {
                    decodedText = brokenText.fixedEncoding
                    flagFutureElements += brokenText.flagElements.valueOf()
                    newText = brokenText.fixedEncoding
                    alternateNewText = brokenText.alternateFixedEncoding
                }
            })
            if (flagFutureElements === 0) {
                counter += textArray.push(decodedText)
            // } else if (newText === 'ameduaodnw') {
            } else if (newText === 'ft' || newText === 'fl') {
                counter--
                const lastText = textArray.pop()
                const nextText = texts[textIndex + 1]
                const fixedText = lastText.concat(
                    newText,
                    decodeURIComponent(nextText['R'][0]['T'])
                )
                // console.log(`adding ${fixedText}`)
                counter += textArray.push(fixedText)
            // } else if (newText === 'ameduaodnw') {
            } else if (newText === 'th' || newText === 'wh' || newText === 'fi' || newText === 'ff') {
                counter--
                let fixedText = ''
                const lastText = textArray.pop()
                const nextText = texts[textIndex + 1]
                if (lastText.slice(lastText.length - 3) === '%20') {
                    fixedText = lastText.concat(
                        newText[0].toUpperCase() + newText.substring(1),
                        decodeURIComponent(nextText['R'][0]['T'])
                    )
                    if (alternateNewText !== undefined)
                        fixedText = alternateNewText
                } else if (Number.isInteger(parseInt(lastText))) {
                    counter += textArray.push(lastText)
                    const temp = newText[0].toUpperCase() + newText.substring(1)
                    fixedText = temp.concat(
                        decodeURIComponent(nextText['R'][0]['T'])
                    )
                } else {
                    fixedText = lastText.concat(
                        newText,
                        decodeURIComponent(nextText['R'][0]['T'])
                    )
                }
                // console.log(`adding ${fixedText}`)
                counter += textArray.push(fixedText)
            } else {
                // console.log(`flagFutureElements is ${flagFutureElements}`)
                // console.log(`skipping adding ${decodedText}`)
                while (flagFutureElements > 0) {
                    flagFutureElements -= 1
                    break
                }
            }
        })
    })

    console.log(`Collected ${counter} text strings`)

    fs.writeFileSync(
        path.join(__dirname, '..', `/resources/json/${isoDate}-easyarray.json`),
        JSON.stringify(textArray),
        () => {
            console.dir(textArray)
        }
    )

    fs.writeFileSync(
        path.join(
            __dirname,
            '..',
            `/resources/json/${isoDate}-rawpdfconversion.json`
        ),
        JSON.stringify(pdfData),
        () => {
            console.dir(pdfData)
        }
    )

    // let target = 110;
    // setInterval(() => {
    //     process.stdout.write('\rTime remaining: ' + target + ' seconds');
    //     target--;
    // }, 1000);

    // formImage.Pages
    // foreach(pages.Texts)
    // foreach(texts.R[0])
    // R.T === the text object...
})

const myArgs = process.argv.slice(2)
if (myArgs[0] === null || myArgs[0] === undefined) {
    console.error(
        'Invalid script call: Please provide PDF for parsing in the format'
    )
    console.log('yarn convertpdf pdfname.pdf')
} else {
    pdfParser.loadPDF(path.join(__dirname, '..', `/resources/pdf/${myArgs[0]}`))
}
