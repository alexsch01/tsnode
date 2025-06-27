#! /usr/bin/env node

const { existsSync, writeFileSync } = require('node:fs')
const { spawnSync } = require('node:child_process')
const { resolve } = require('node:path')

let ts
if (process.platform === 'win32') {
    ts = require('typescript')
} else {
    ts = require(resolve(__dirname, 'lib', 'node_modules', 'typescript'))
}

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

const program = ts.createProgram([firstTSFile], {
    "noEmit": true,
    "target": ts.ScriptTarget.ESNext,
    "module": ts.ModuleKind.NodeNext,
    "rewriteRelativeImportExtensions": true,
    "erasableSyntaxOnly": true,
    "verbatimModuleSyntax": true
})

const allDiagnostics = ts.getPreEmitDiagnostics(program)
if (allDiagnostics.length > 0) {
    const formatter = ts.formatDiagnosticsWithColorAndContext || ts.formatDiagnostics
    console.error(formatter(allDiagnostics, {
        getCurrentDirectory: () => ts.sys.getCurrentDirectory(),
        getNewLine: () => ts.sys.newLine,
        getCanonicalFileName: ts.sys.useCaseSensitiveFileNames ? f => f : f => f.toLowerCase(),
    }).trimEnd())

    process.exit(1)
}

process.exit(spawnSync('node', myArgs, {stdio: 'inherit'}).status)
