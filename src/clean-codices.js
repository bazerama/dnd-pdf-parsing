const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
// const chalk = require('chalk');
const consts = require('./common/consts')

const date = new Date().toLocaleString('en-AU')
const isoDate = new Date(date).toISOString()

const files = fs.readdirSync(path.join(__dirname, '..', 'resources/json'))

const questions = [
    {
        type: 'list',
        name: 'FILELOCATION',
        message: 'Which Populated Codices file should be loaded?',
        choices: files
    }
]

const loadFile = (fileName) => {
    let strFormatted = ''
    const fileContent = fs.readFileSync(fileName)
    const codices2DArray = JSON.parse(fileContent)

    codices2DArray.forEach((codexStringArray) => {
        codexStringArray.forEach((string, index) => {
            strFormatted = string.toString()
            if (
                strFormatted.charAt(0) === '.' &&
                strFormatted.charAt(1) === ' '
            ) {
                const temp = strFormatted.charAt(2).toUpperCase()
                codexStringArray[index] = temp.concat(strFormatted.substring(3))
            }
        })
    })
    console.log(`Successfully finished cleaning Creature Codices`)

    fs.writeFile(
        path.join(
            __dirname,
            '..',
            `/resources/json/${isoDate}-cleanedcodices.json`
        ),
        JSON.stringify(codices2DArray),
        () => {
            console.dir(codices2DArray, { maxArrayLength: 4 })
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
