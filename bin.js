#! /usr/bin/env node

import { existsSync, writeFileSync, readFileSync } from 'node:fs'
import { execSync, spawnSync } from 'node:child_process'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

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
    } else {
        writeFileSync(packageJSON, JSON.stringify({
            type: 'module',
            ...JSON.parse(readFileSync(packageJSON).toString())
        }, null, 2))
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

myArgs.unshift('--import', pathToFileURL(resolve(import.meta.dirname, 'loader.js')).href)
process.exit(spawnSync('node', myArgs, {stdio: 'inherit'}).status)
