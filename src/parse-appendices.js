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
    let finishappendices = false
    const appendicesObjects = []
    const fileContent = fs.readFileSync(fileName)
    const easyArray = JSON.parse(fileContent)

    // console.dir(easyArray)
    try {
        easyArray.forEach((text, textsIndex) => {

            if (text === "C: CREATURES BY CHALLENGE") {
                let i = textsIndex + 1
                while (easyArray[i] !== 'CHALLENGE 0 (0 XP)') {
                    i += 1
                }
                i += 1

                while (easyArray[i] !== 'D: CREATURES BY TERRAIN') {
                    if (finishappendices) {
                        throw BreakException
                    }
                    let incrementalObjectIndices = 3

                    if(easyArray[i].includes('CHALLENGE')) {
                        i += 1
                    }

                    if(easyArray[i].includes('@gmail.com')) {
                        if (easyArray[i+2] === 'D: CREATURES BY TERRAIN') {
                            throw BreakException
                            break
                        }
                        i += incrementalObjectIndices
                    }

                    const appendixObject = {
                        creature: easyArray[i],
                        page: easyArray[i + 2]
                    }

                    if (appendixObject.creature === consts.appendicesBreakPoint)
                        finishappendices = true

                    while(!Number.isInteger(parseInt(easyArray[i + 2]))){
                        appendixObject.creature = appendixObject.creature.concat(easyArray[i + 1])
                        i += 1
                    }
                    appendixObject.page = easyArray[i + 2]
                    if (appendixObject.creature !== consts.emailMeta) {
                        appendicesObjects.push(appendixObject)
                    }
                    i += incrementalObjectIndices
                }
            }
        })
    } catch (e) {
        if (e !== BreakException) throw e
        console.log(
            `Successfully finished creating Creature Appendices with ${appendicesObjects.length} creatures`
        )
    }

    fs.writeFile(
        path.join(
            __dirname,
            '..',
            `/resources/json/${isoDate}-easyappendices.json`
        ),
        JSON.stringify(appendicesObjects),
        () => {
            console.dir(appendicesObjects, { maxArrayLength: 4 })
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
