#! /usr/bin/env node

import { existsSync, writeFileSync } from 'node:fs'
import { execSync, spawnSync } from 'node:child_process'
import { resolve } from 'node:path'

const myArgs = process.argv.slice(2)

if (myArgs[0] === '--init') {
    if (myArgs.length !== 1) {
        console.error("Error: Unknown command")
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
        "strictNullChecks": true,
        "resolveJsonModule": true,
    }
}`
        )
    }

    process.exit()
}

if (myArgs[0] === '--update') {
    if (myArgs.length !== 1) {
        console.error("Error: Unknown command")
        process.exit(1)
    }

    execSync(`npm install @typescript/native-preview --prefix "${import.meta.dirname}" --global --no-bin-links`)
    process.exit()
}

if ( myArgs.find(a => a.endsWith('.ts') === undefined ) {
    console.error("Error: Must provide a ts file")
    process.exit(1)
}

let tscPath
if (process.platform === 'win32') {
    tscPath = resolve(import.meta.dirname, 'node_modules', '@typescript', 'native-preview', 'bin', 'tsgo.js')
} else {
    tscPath = resolve(import.meta.dirname, 'lib', 'node_modules', '@typescript', 'native-preview', 'bin', 'tsgo.js')
}

const { status: tscStatus, output } = spawnSync('node', [tscPath])
if (tscStatus === 2) {
    console.error(output[1].toString().slice(0, -1))
    process.exit(1)
}

process.exit(spawnSync('node', myArgs, {stdio: 'inherit'}).status)
