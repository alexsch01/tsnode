import { execSync } from 'node:child_process'
import { resolve } from 'node:path'

execSync(`npm install @typescript/native-preview --prefix "${resolve(import.meta.dirname, '..')}" --global --no-bin-links`)
