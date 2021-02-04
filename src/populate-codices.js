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
        name: 'CODICESLOCATION',
        message: 'Which Codices JSON file should be loaded?',
        choices: files
    },
    {
        type: 'list',
        name: 'EASYLOCATION',
        message: 'Which Easy Text Array file should be loaded?',
        choices: files
    }
]

const loadFile = (codicesFileName, easyArrayFileName) => {
    const BreakException = {}
    let fileContent = fs.readFileSync(codicesFileName)
    const creatureCodices = JSON.parse(fileContent)
    fileContent = fs.readFileSync(easyArrayFileName)
    const easyArray = JSON.parse(fileContent)
    const codicesObjects = []

    // populate
    try {
        creatureCodices.forEach((codex, codicesIndex) => {
            let textIncrementer = 0
            const nextCreature = creatureCodices[codicesIndex + 1]
            let nextCreaturePage = ''
            if (nextCreature === undefined) {
                nextCreaturePage = 'codicesFinished'
            } else {
                nextCreaturePage = nextCreature.page
            }
            let creatureFinished = false
            let addCreatureText = false
            const codexRawTextArray = []
            // console.log(`Dealing with a ${codex.creature}`)
            while (textIncrementer < easyArray.length && !creatureFinished) {
                const prevText = easyArray[textIncrementer - 1]
                const text = easyArray[textIncrementer]
                // console.log(text)
                // find creature in question
                if (
                    easyArray[textIncrementer + 1] === consts.emailMeta &&
                    easyArray[textIncrementer + 2] === codex.page
                ) {
                    // found the creature needed, begin adding creature text
                    addCreatureText = true
                    // console.log(`Adding text for ${codex.creature}`)
                    textIncrementer += 2 // skips next two garbage texts (meta + page num)
                } else if (prevText === consts.emailMeta && text === consts.finalCodicesPage) {
                    // console.log(`Stopping last ${easyArray[textIncrementer]}...`)
                    creatureFinished = true
                } else if (prevText === consts.emailMeta && text === parseInt(nextCreaturePage).toString()) {
                    // i.e. this text is the next creature's page, it's time to stop!!!
                    // console.log(`Stopping ${easyArray[textIncrementer]}...`)
                    creatureFinished = true
                } else if (addCreatureText && text !== consts.emailMeta) {
                    // console.log(`Pushing ${easyArray[textIncrementer]}...`)
                    // this is regular text, add to array
                    codexRawTextArray.push(easyArray[textIncrementer])
                }
                textIncrementer += 1
            }
            if (codexRawTextArray !== []) {
                // console.log(`Adding data for ${codex.creature} to file\n`)
                codicesObjects.push(codexRawTextArray)
            }
        })
    } catch (e) {
        if (e !== BreakException) throw e
        console.log(`Successfully finished populating Creature Codices`)
    }

    fs.writeFile(
        path.join(
            __dirname,
            '..',
            `/resources/json/${isoDate}-populatedcodices.json`
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
        const { CODICESLOCATION, EASYLOCATION } = answers
        loadFile(
            path.join(__dirname + '/..' + '/resources/json/' + CODICESLOCATION),
            path.join(__dirname + '/..' + '/resources/json/' + EASYLOCATION)
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
