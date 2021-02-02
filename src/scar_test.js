const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
// const chalk = require('chalk');
const consts = require('./common/consts')

const date = new Date(Date.now())
const isoDate = new Date(date).toISOString()

const files = fs.readdirSync(path.join(__dirname, '..', 'resources/json'))

// const loadFile = (fileName) => {
//     const codicesObjects = []
//     const fileContent = fs.readFileSync(fileName)
//     const easyArray = JSON.parse(fileContent)
//
//     console.dir(easyArray)
// }

const loadFile = (lookup, raw) => {
    const codicesObjects = []
    const lookupContent = fs.readFileSync(lookup)
    const easyCodices = JSON.parse(lookupContent)
    const rawContent = fs.readFileSync(raw)
    const rawPdfConversion = JSON.parse(rawContent)

    easyCodices.forEach((codText, codTextsIndex) => {
        const codCreatureName = codText['creature'];
        rawPdfConversion.forEach((rawText, rawTextsIndex) => {
            if (codCreatureName.toUpperCase() === rawText) {

                printXML(rawPdfConversion[rawTextsIndex], 'name');

                const creatureTypes = rawPdfConversion[rawTextsIndex + 1].split(",");
                const creatureSize = creatureTypes[0].split(" ");
                const creatureSizeCode = consts.sizes[creatureSize[0]];
                printXML(creatureSizeCode, 'size');

                let creatureType = '';
                for(let i = 1; i<creatureSize.length; i++) {
                    creatureType = creatureType + ' ' + creatureSize[i];
                }
                printXML(creatureType + ', Creature Codex', 'type');

                printXML(creatureTypes[1], 'alignment');

                printXML(rawPdfConversion[rawTextsIndex + 3], 'ac');
                printXML(rawPdfConversion[rawTextsIndex + 5], 'hp');
                printXML(rawPdfConversion[rawTextsIndex + 7], 'speed');
                printXML(rawPdfConversion[rawTextsIndex + 14].trim().split(' ')[0], 'str');
                printXML(rawPdfConversion[rawTextsIndex + 15].trim().split(' ')[0], 'dex');
                printXML(rawPdfConversion[rawTextsIndex + 16].trim().split(' ')[0], 'con');
                printXML(rawPdfConversion[rawTextsIndex + 17].trim().split(' ')[0], 'int');
                printXML(rawPdfConversion[rawTextsIndex + 18].trim().split(' ')[0], 'wis');
                printXML(rawPdfConversion[rawTextsIndex + 19].trim().split(' ')[0], 'cha');

                let i = 20;
                if(rawPdfConversion[rawTextsIndex + i] === 'Saving Throws') {
                    printXML(rawPdfConversion[rawTextsIndex + i + 1], 'save');
                    i += 2;
                }
                if(rawPdfConversion[rawTextsIndex + i] === 'Skills') {
                    printXML(rawPdfConversion[rawTextsIndex + i + 1], 'skill');
                    i += 2;
                }
                if(rawPdfConversion[rawTextsIndex + i] === 'Damage Resistances') {
                    printXML(rawPdfConversion[rawTextsIndex + i + 1], 'resist');
                    i += 2;
                }
                if(rawPdfConversion[rawTextsIndex + i] === 'Damage Immunities') {
                    printXML(rawPdfConversion[rawTextsIndex + i + 1], 'immune');
                    i += 2;
                }
                if(rawPdfConversion[rawTextsIndex + i] === 'Condition Immunities') {
                    printXML(rawPdfConversion[rawTextsIndex + i + 1], 'conditionImmune');
                    i += 2;
                }
                if(rawPdfConversion[rawTextsIndex + i] === 'Senses') {
                    printXML(rawPdfConversion[rawTextsIndex + i + 1], 'sense');
                    i += 2;
                }
                if(rawPdfConversion[rawTextsIndex + i] === 'Languages') {
                    printXML(rawPdfConversion[rawTextsIndex + i + 1], 'language');
                    i += 2;
                }
                if(rawPdfConversion[rawTextsIndex + i] === 'Challenge') {
                    printXML(rawPdfConversion[rawTextsIndex + i + 1].trim().split(' ')[0], 'cr');
                    i += 2;
                }

                while (rawPdfConversion[rawTextsIndex + i] !== 'ACTIONS') {
                    if(rawPdfConversion[rawTextsIndex + i].charAt(0) === '.'){
                        let j = i + 1;
                        let text = '';
                        while(rawPdfConversion[rawTextsIndex + j].charAt(0) !== '.'){
                            text += rawPdfConversion[rawTextsIndex + j - 1];
                            j += 1;
                        }
                        printXMLLarge('trait', rawPdfConversion[rawTextsIndex + i - 1], text, '');
                        i = j - 2;
                    }
                    i += 1;
                }
            }
        })
    })
}

const printXML = (value, tag) => {
    console.log('<'+tag+'>'+value.trim()+'</'+tag+'>');
};

const printXMLLarge = (type, name, text, attack) => {
    console.log('<' + type + '>');
    if(name !== '') {
        printXML(name, 'name');
    }
    if(text !== '') {
        printXML(text, 'text');
    }
    if(attack !== '') {
        printXML(attack, 'attack');
    }
    console.log('</' + type + '>');
};


loadFile(
    path.join(__dirname + '/..' + '/resources/json/' + '1-easycodices.json'),
    path.join(__dirname + '/..' + '/resources/json/' + '1-easyarray.json')
)


