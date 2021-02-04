const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
// const chalk = require('chalk')
const consts = require('./common/consts')
const moment = require('moment')

const date = moment()
const isoDate = date.format()

const files = fs.readdirSync(path.join(__dirname, '..', 'resources/json'))

const questions = [
    {
        type: 'list',
        name: 'FILELOCATION',
        message: 'Which JSON file should be loaded?',
        choices: files
    }
]

const loadFile = (fileName) => {
    const BreakException = {}
    let finishCodices = false
    const codicesObjects = []
    const fileContent = fs.readFileSync(fileName)
    const easyArray = JSON.parse(fileContent)

    // console.dir(easyArray)
    try {
        easyArray.forEach((text, textsIndex) => {
            // if (easyArray[textsIndex + 1] === consts.codicesBreakPoint) {
            //     finishCodices = true
            //     console.log(`finishing at ${easyArray[textsIndex + 1]}`)
            // }
            consts.codices.forEach((codex, codicesIndex) => {
                if (text === codex) {
                    // console.log('equal:', "'" + text + "'", "'" + codex + "'")
                    let i = textsIndex + 1
                    // console.log('i =', i)
                    // console.log(`easyArray[${i}] = ${easyArray[i]}`)
                    while (easyArray[i] !== consts.codices[codicesIndex + 1]) {
                        if (finishCodices) {
                            throw BreakException
                        }
                        // console.log('current: ' + easyArray[i])
                        // console.log(
                        //     'potential next page num char: ' +
                        //         easyArray[i + 3].toString().charAt(0)
                        // )
                        let incrementalObjectIndices = 3
                        const codexObject = {
                            creature: easyArray[i],
                            page: easyArray[i + 2]
                        }
                        let j = ''
                        if (codexObject.creature === consts.codicesBreakPoint)
                            finishCodices = true
                        if (easyArray[i + 3].toString().charAt(0) === '–') {
                            // console.log('page of: ' + codexObject.page)
                            // console.log('dashed field: ' + easyArray[i + 3])
                            if (easyArray[i + 3].toString() === '–') {
                                j = easyArray[i + 3].toString()
                                i += 1
                            }
                            if (/([0-9]|\-)+/g.test(easyArray[i + 3])) {
                                // console.log('passed first')
                                codexObject.page = codexObject.page.concat(
                                    j,
                                    easyArray[i + 3]
                                )
                                incrementalObjectIndices += 1
                            } else if (
                                /([a-zA-Z]|\-)+/g.test(easyArray[i + 3])
                            ) {
                                // console.log('passed second')
                                codexObject.creature = codexObject.creature.concat(
                                    easyArray[i + 3]
                                )
                                incrementalObjectIndices += 1
                            } else if (/^\–/g.test(easyArray[i + 3])) {
                                // console.log('passed third')
                                const previous = parseInt(codexObject.page)
                                const next = parseInt(easyArray[i + 4])
                                if (
                                    Number.isInteger(previous) &&
                                    Number.isInteger(next)
                                ) {
                                    codexObject.page = codexObject.page.concat(
                                        easyArray[i + 3],
                                        easyArray[i + 4]
                                    )
                                } else {
                                    codexObject.creature = codexObject.creature.concat(
                                        easyArray[i + 3],
                                        easyArray[i + 4]
                                    )
                                }
                                incrementalObjectIndices += 2
                            }
                            // console.log('\n')
                        }
                        if (codexObject.creature !== consts.emailMeta) {
                            codicesObjects.push(codexObject)
                        }
                        i += incrementalObjectIndices
                    }
                }
            })
        })
    } catch (e) {
        if (e !== BreakException) throw e
        console.log(
            `Successfully finished creating Creature Codices with ${codicesObjects.length} creatures`
        )
    }

    fs.writeFile(
        path.join(
            __dirname,
            '..',
            `/resources/json/${isoDate}-easycodices.json`
        ),
        JSON.stringify(codicesObjects),
        () => {
            console.dir(codicesObjects, { maxArrayLength: 4 })
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
