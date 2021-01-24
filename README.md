# dnd-pdf-parsing
Parse your PDFs of dnd monster content for easily manipulated JSON output

## How to use these scripts
1. Download the Creature Codex by Kobold Press.
2. Save the file to `resources/pdf` and rename to `creature-codex-5e.pdf` (currently working on making this name easier to do).
3. Run the script `yarn install` to install dependencies for building the JSON.
4. Run script `yarn convertpdf` to convert from PDF to an Array of Strings (this will not be usable for most people, but it's the longest step, so I've left it in - should take approx. 2 minutes).
5. Run script `yarn parsecodices` to convert the Array of Strings from the last step into a pseudo 'machine readable' format. At the moment, this consists of creating an Array of Objects. There is a sample below.
6. Feel free to play around with or tweak stuff. The output from commands is often found in `resources/json` so you can tell what's happening. Report any script errors in GitHub Issues and I'll track them.

## How to use with Improved Initiative
:construction: WIP :construction: <br><br>

### Sample Monster Codex from `parsecodices`
#### **WARNING: Code subject to change**
```
[
    {
        creature: 'Aatxe',
        page: '6',
        statblock: {
            health: '4d10 (20)',
            attack: ['melee, spell']
        }
    },
    {
        creature: 'Acid Ant',
        page: '8',
        statblock: {
            health: '3d6 (8)',
            attack: ['ranged, melee, spell']
        }
    }
]
```

# DISCLAIMER
I **DO NOT** endorse/condone the sharing of PDFs... You should purchase every PDF yourself, give back to the DnD community and the fabulous people working on custom content. This **DOES NOT** connect to the internet, and you will have no means of sharing - deliberately or accidentally.