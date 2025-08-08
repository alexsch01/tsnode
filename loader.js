import { registerHooks } from 'node:module'
import { spawnSync } from 'node:child_process'
import { resolve } from 'node:path'

let firstScript = true

registerHooks({
    load(url, context, nextLoad) {
        if (firstScript) {
            let tscPath
            if (process.platform === 'win32') {
                tscPath = resolve(import.meta.dirname, 'node_modules', '@typescript', 'native-preview', 'bin', 'tsgo.js')
            } else {
                tscPath = resolve(import.meta.dirname, 'lib', 'node_modules', '@typescript', 'native-preview', 'bin', 'tsgo.js')
            }

            const { status } = spawnSync('node', [tscPath], {stdio: 'inherit'})
            if (status !== 0) {
                const output = nextLoad(url, context)
                output.source = Buffer.from('process.exit(1)')
                return output
            }

            firstScript = false
        }

        return nextLoad(url, context)
    },
})
