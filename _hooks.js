import { spawnSync } from 'node:child_process'
import { resolve } from 'node:path'

let firstScript = true

export function load(url, context, nextLoad) {
    if (firstScript) {
        let tscPath
        if (process.platform === 'win32') {
            tscPath = resolve(import.meta.dirname, 'node_modules', '@typescript', 'native-preview', 'bin', 'tsgo.js')
        } else {
            tscPath = resolve(import.meta.dirname, 'lib', 'node_modules', '@typescript', 'native-preview', 'bin', 'tsgo.js')
        }

        const { status: tscStatus, stdout: tscStdout } = spawnSync('node', [tscPath])

        if (tscStatus === 1) {
            console.error("Error: tsconfig.json not found, run tsnode --init")
            process.exit(1)
        }

        if (tscStatus !== 0) {
            process.stderr.write(tscStdout)
            process.exit(1)
        }

        firstScript = false
    }

    return nextLoad(url, context)
}
