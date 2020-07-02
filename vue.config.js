process.env.VUE_APP_VERSION = require('./package.json').version

module.exports = {
  productionSourceMap: false,
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = 'Mave Registry'
        return args
      })
  }
}