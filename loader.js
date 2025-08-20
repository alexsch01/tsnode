import { registerHooks } from 'node:module'
import { existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { resolve } from 'node:path'

const tscPath = resolve(import.meta.dirname, 'node_modules', '@typescript', 'native-preview', 'bin', 'tsgo.js')
if (process.argv[1] !== tscPath) {
    const myArgs = process.argv
    const packageJSON = resolve(process.cwd(), 'package.json')
    const tsconfigJSON = resolve(process.cwd(), 'tsconfig.json')
    
    if ( myArgs.find(a => a.endsWith('.ts')) === undefined ) {
        console.error("Error: must provide a ts file")
        process.exit(1)
    }
    
    if (!existsSync(packageJSON) || !existsSync(tsconfigJSON)) {
        console.error("Error: run npx tsnode --init")
        process.exit(1)
    }
    
    let firstScript = true
    
    registerHooks({
        load(url, context, nextLoad) {
            if (firstScript) {
                const { status: tscStatus } = spawnSync('node', [tscPath], { stdio: ['inherit', process.stderr, 'inherit'] })
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
}
