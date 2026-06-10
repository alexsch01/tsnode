import { existsSync } from 'node:fs'
import { registerHooks } from 'node:module'
import { spawnSync } from 'node:child_process'
import { resolve } from 'node:path'

let tscPath = resolve(import.meta.dirname, 'node_modules', '@typescript', 'native-preview', 'bin', 'tsgo.js')
if (!existsSync(tscPath)) {
    tscPath = resolve(import.meta.dirname, '..', '..', '@typescript', 'native-preview', 'bin', 'tsgo.js')
}

let firstScript = true

registerHooks({
    load(url, context, nextLoad) {
        if (firstScript) {
            const { status: tscStatus } = spawnSync('node', [tscPath], {
                stdio: ['inherit', process.stderr, 'inherit']
            })

            if (tscStatus !== 0) {
                const output = nextLoad(url, context)
                output.source = Buffer.from('process.exit(1)')
                return output
            }

            firstScript = false
        }

        return nextLoad(url, context)
    },
})
