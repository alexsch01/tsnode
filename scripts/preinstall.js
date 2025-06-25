if(!process.env.npm_config_global) {
    console.log('This npm module can only be installed globally')
    process.exit(1)
}
