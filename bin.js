#! /usr/bin/env node

const { existsSync, writeFileSync } = require('node:fs')
const { spawnSync } = require('node:child_process')
const { resolve } = require('node:path')

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
        "verbatimModuleSyntax": true
    }
}`
        )
    }

    process.exit()
}

const firstTSFile = myArgs.find(a => a.endsWith('.ts'))
if (firstTSFile === undefined) {
    console.error("Error: Must provide a ts file")
    process.exit(1)
}

let tscPath
if (process.platform === 'win32') {
    tscPath = resolve(__dirname, 'node_modules', 'typescript', 'bin', 'tsc')
} else {
    tscPath = resolve(__dirname, 'lib', 'node_modules', 'typescript', 'bin', 'tsc')
}

const tscStatus = spawnSync('node', [
    tscPath,
    '--noEmit',
    '--target', 'esnext',
    '--module', 'nodenext',
    '--rewriteRelativeImportExtensions',
    '--erasableSyntaxOnly',
    '--verbatimModuleSyntax',
    firstTSFile
], {stdio: 'inherit'}).status

if (tscStatus !== 0) {
    process.exit(tscStatus)
}

process.exit(spawnSync('node', myArgs, {stdio: 'inherit'}).status)
