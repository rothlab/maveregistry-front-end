process.env.VUE_APP_VERSION = require('./package.json').version
const SentryWebpackPlugin = require('@sentry/webpack-plugin');

module.exports = {
  productionSourceMap: true,
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = 'Mave Registry'
        return args
      })
  },
  configureWebpack: {
    plugins: [
      new SentryWebpackPlugin({
        include: './dist/',
        ignoreFile: '.sentrycliignore',
        ignore: ['node_modules', 'webpack.config.js'],
        configFile: 'sentry.properties',
        validate: true,
        debug: process.env.NODE_ENV === "test",
        dryRun: process.env.NODE_ENV === "development",
        release: 'mave-registry-frontend@' + process.env.VUE_APP_VERSION
      })
    ],
    devtool: 'source-map'
  },
  devServer: {
    disableHostCheck: true
  }
}