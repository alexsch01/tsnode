const { execSync } = require('node:child_process')
const { resolve } = require('node:path')

execSync(`npm install typescript --prefix "${resolve(__dirname, '..')}" --no-bin-links`)
