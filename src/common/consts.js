const codices = [
    'CODEX A',
    'CODEX B',
    'CODEX C',
    'CODEX D',
    'CODEX E',
    'CODEX F',
    'CODEX G',
    'CODEX H',
    'CODEX I',
    'CODEX J',
    'CODEX K',
    'CODEX L',
    'CODEX M',
    'CODEX N',
    'CODEX O',
    'CODEX P',
    'CODEX Q',
    'CODEX R',
    'CODEX S',
    'CODEX T',
    'CODEX U',
    'CODEX V',
    'CODEX W',
    'CODEX X',
    'CODEX Y',
    'CODEX Z',
    'Appendix A: NPC Codex'
]

const brokenDecodedTextList = [
    {
        brokenEncoding: '%26',
        fixedEncoding: 'ft',
        flagElements: 1
    },
    {
        brokenEncoding: '%23',
        fixedEncoding: 'th',
        flagElements: 1
    },
    {
        brokenEncoding: '%22',
        fixedEncoding: 'wh',
        flagElements: 1
    },
    {
        brokenEncoding: ')',
        fixedEncoding: 'fl',
        flagElements: 1
    },
    {
        brokenEncoding: '!',
        fixedEncoding: 'fi',
        flagElements: 1
    },
    {
        brokenEncoding: "'",
        fixedEncoding: 'fi',
        flagElements: 1
    },
    {
        brokenEncoding: '$',
        fixedEncoding: 'ff',
        alternateFixedEncoding: 'Th',
        flagElements: 1
    }
]

const emailMeta = 'Sean Carmichael - sean.carimchael2@gmail.com - 267728'
const codicesBreakPoint = 'Zoog'
const finalCodicesPage = '397'

module.exports.finalCodicesPage = finalCodicesPage
module.exports.brokenDecodedTextList = brokenDecodedTextList
module.exports.emailMeta = emailMeta
module.exports.codicesBreakPoint = codicesBreakPoint
module.exports.codices = codices
