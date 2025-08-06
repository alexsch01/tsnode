#! /usr/bin/env node

import { existsSync, writeFileSync } from 'node:fs'
import { execSync, spawnSync } from 'node:child_process'
import { resolve } from 'node:path'

const myArgs = process.argv.slice(2)

if (myArgs[0] === '--init') {
    if (myArgs.length !== 1) {
        console.error("Error: unknown command")
        process.exit(1)
    }

    const packageJSON = resolve(process.cwd(), 'package.json')
    const tsconfigJSON = resolve(process.cwd(), 'tsconfig.json')

    if (!existsSync(packageJSON)) {
        writeFileSync(packageJSON, 
            `{
    "type": "module"
}`
        )
    }
    if (!existsSync(tsconfigJSON)) {
        writeFileSync(tsconfigJSON,
            `{
    "compilerOptions": {
        "noEmit": true,
        "target": "esnext",
        "module": "nodenext",
        "rewriteRelativeImportExtensions": true,
        "erasableSyntaxOnly": true,
        "verbatimModuleSyntax": true,
        "resolveJsonModule": true,
        "strict": true,
        "noUncheckedIndexedAccess": true,
    }
}`
        )
    }

    process.exit()
}

if (myArgs[0] === '--update') {
    if (myArgs.length !== 1) {
        console.error("Error: unknown command")
        process.exit(1)
    }

    execSync(`npm install @typescript/native-preview --prefix "${import.meta.dirname}" --global --no-bin-links`)
    process.exit()
}

if ( myArgs.find(a => a.endsWith('.ts')) === undefined ) {
    console.error("Error: must provide a ts file")
    process.exit(1)
}

myArgs.unshift('--import', `file:${resolve(import.meta.dirname, '_loader.js').replace(/\\/g, '/')}`)
process.exit(spawnSync('node', myArgs, {stdio: 'inherit'}).status)
