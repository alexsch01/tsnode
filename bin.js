#! /usr/bin/env node

const ts = require('typescript')
const { spawn } = require('child_process')

const myArgs = process.argv.slice(2)
const firstTSFile = myArgs.find(a => a.endsWith('.ts'))
if (firstTSFile === undefined) {
    throw new Error("Must provide a TS file")
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

const child = spawn('node', myArgs, {stdio: 'inherit'})
child.on('close', (code) => {
    process.exit(code)
})
