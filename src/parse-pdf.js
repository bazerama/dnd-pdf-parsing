const fs = require('fs');
const path = require('path');
const PDFParser = require('pdf2json');
// const figlet = require('figlet');
// const shell = require('shelljs');

const pdfParser = new PDFParser();

pdfParser.on('pdfParser_dataError', (errData) => {
    console.error(errData.parserError);
});

pdfParser.on('pdfParser_dataReady', (pdfData) => {
    const date = new Date().toLocaleString('en-AU');
    const isoDate = new Date(date).toISOString();

    console.log('Parsed PDF Data');

    let counter = 0;
    const textArray = [];
    const pages = pdfData['formImage']['Pages'];
    pages.forEach(page => {
        const texts = page['Texts'];
        texts.forEach(text => {
            const representation = text['R'][0];
            const textString = representation['T'];
            const decodedText = decodeURIComponent(textString);
            counter += textArray.push(decodedText);
        });
    });

    console.log(`Collected ${counter} text strings`);

    fs.writeFileSync(path.join(__dirname, '..', `/resources/json/${isoDate}-easyarray.json`), JSON.stringify(textArray), () => {
        console.dir(textArray);
    });

    fs.writeFileSync(path.join(__dirname, '..', `/resources/json/${isoDate}-rawpdfconversion.json`), JSON.stringify(pdfData), () => {
        console.dir(pdfData);
    });

    // let target = 110;
    // setInterval(() => {
    //     process.stdout.write('\rTime remaining: ' + target + ' seconds');
    //     target--;
    // }, 1000);

    // formImage.Pages
    // foreach(pages.Texts)
    // foreach(texts.R[0])
    // R.T === the text object...
});

const myArgs = process.argv.slice(2);
pdfParser.loadPDF(path.join(__dirname, '..', `/resources/pdf/${myArgs[0]}`));
