import { execSync } from 'node:child_process'
import { resolve } from 'node:path'

// see https://github.com/microsoft/typescript-go/issues/1493
execSync(`npm install @typescript/native-preview@7.0.0-dev.20250723.1 --prefix "${resolve(import.meta.dirname, '..')}" --global --no-bin-links`)
