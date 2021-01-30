const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
// const chalk = require('chalk');
const consts = require('./common/consts');

const date = new Date(Date.now());
const isoDate = new Date(date).toISOString();

const files = fs.readdirSync(path.join(__dirname, '..', 'resources/json'));

// const loadFile = (fileName) => {
//     const codicesObjects = []
//     const fileContent = fs.readFileSync(fileName)
//     const easyArray = JSON.parse(fileContent)
//
//     console.dir(easyArray)
// }

const loadFile = (lookup, raw) => {
    const codicesObjects = [];
    const lookupContent = fs.readFileSync(lookup);
    const easyCodices = JSON.parse(lookupContent);
    const rawContent = fs.readFileSync(raw);
    const rawPdfConversion = JSON.parse(rawContent);
    let i = 0;

    easyCodices.forEach((codText, codTextsIndex) => {
        const codCreatureName = codText['creature'];
        const pages = rawPdfConversion['formImage']['Pages'];
        pages.forEach(page => {
            const texts = page['Texts'];
            texts.forEach(text => {
                i += 1;
                const representation = text['R'][0];
                const rawText = representation['T'];
                const decodedRawText = decodeURIComponent(rawText);
                const decodedCodText = decodeURIComponent(codCreatureName);
                if (decodedCodText.toUpperCase() === decodedRawText) {
                    console.log(decodedRawText);
                    console.log(i);
                }
            });
        });
    });
};

loadFile(
    path.join(__dirname + '/..' + '/resources/json/' + '1-easycodices.json'),  path.join(__dirname + '/..' + '/resources/json/' + '1-rawpdfconversion.json')
);


