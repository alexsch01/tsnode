const { execSync } = require('child_process')
const { resolve } = require('path')

execSync(`npm install typescript --prefix "${resolve(__dirname, '..')}"`)
