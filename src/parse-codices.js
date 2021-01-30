const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
// const chalk = require('chalk');
const consts = require('./common/consts');

const date = new Date(Date.now());
const isoDate = new Date(date).toISOString();

const files = fs.readdirSync(path.join(__dirname, '..', 'resources/json'))

const questions = [
    {
        type: 'list',
        name: 'FILELOCATION',
        message: 'Which JSON file should be loaded?',
        choices: files,
    },
]

const loadFile = (fileName) => {
    const codicesObjects = []
    const fileContent = fs.readFileSync(fileName)
    const easyArray = JSON.parse(fileContent)

    console.dir(easyArray)
    easyArray.forEach((text, textsIndex) => {
        if (textsIndex < 1600) {
            consts.codices.forEach((codex, codicesIndex) => {
                if (text === codex) {
                    console.log('equal:', "'" + text + "'", "'" + codex + "'")
                    let i = textsIndex + 1
                    console.log('i =', i)
                    console.log(`easyArray[${i}] = ${easyArray[i]}`)
                    let k = 0
                    while (
                        easyArray[i] !== consts.codices[codicesIndex + 1] &&
                        k < 20
                    ) {
                        k += 1
                        console.log('current: ' + easyArray[i])
                        console.log(
                            'potential next page num char: ' + easyArray[i + 3].toString().charAt(0)
                        )
                        let incrementalObjectIndices = 3
                        const codexObject = {
                            creature: easyArray[i],
                            page: easyArray[i + 2],
                        }
                        let j = "";
                        if (
                            easyArray[i + 3].toString().charAt(0) === '–'
                        ) {
                            if (
                                easyArray[i + 3].toString() === '–'
                            ) {
                                j = easyArray[i + 3].toString();
                                i += 1;
                            }
                            console.log('page of: ' + codexObject.page)
                            console.log(
                                'dashed field: ' +
                                j +
                                easyArray[i + 3] +
                                    '\n'
                            )
                            if (/([0-9]|\-)+/g.test(easyArray[i + 3])) {
                                codexObject.page = codexObject.page.concat(
                                    j,
                                    easyArray[i + 3]
                                )
                                incrementalObjectIndices += 1
                            } else if (
                                /([a-zA-Z]|\-)+/g.test(easyArray[i + 3])
                            ) {
                                codexObject.creature = codexObject.creature.concat(
                                    easyArray[i + 3]
                                )
                                incrementalObjectIndices += 1
                            }
                        }
                        codicesObjects.push(codexObject)
                        i += incrementalObjectIndices
                    }
                }
            })
        }
    })
    console.dir(codicesObjects)

    fs.writeFile(
        path.join(__dirname, '..', `/resources/json/${isoDate}-easycodices.json` ),
        JSON.stringify(codicesObjects),
        () => {
            console.dir(codicesObjects)
        }
    )
}

inquirer
    .prompt(questions)
    .then((answers) => {
        const { FILELOCATION } = answers
        loadFile(
            path.join(__dirname + '/..' + '/resources/json/' + FILELOCATION)
        )
    })
    .catch((error) => {
        if (error.isTtyError) {
            console.log(
                "Prompt couldn't be rendered in the current environment"
            )
        } else {
            console.log('Error performing Inquirer:', error)
        }
    })
