const { execSync } = require('node:child_process')
const { resolve } = require('node:path')

execSync(`npm install @typescript/native-preview --prefix "${resolve(__dirname, '..')}" --global --no-bin-links`)
