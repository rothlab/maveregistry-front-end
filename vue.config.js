process.env.VUE_APP_VERSION = require('./package.json').version
const SentryWebpackPlugin = require('@sentry/webpack-plugin')
const PrerenderSPAPlugin = require('prerender-spa-plugin')
const Renderer = PrerenderSPAPlugin.PuppeteerRenderer
const path = require('path')

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
  configureWebpack: () => {
    if (process.env.NODE_ENV !== 'production') return

    return {
      plugins: [
        new SentryWebpackPlugin({
          include: './dist/',
          ignoreFile: '.sentrycliignore',
          ignore: ['node_modules', 'webpack.config.js'],
          configFile: 'sentry.properties',
          validate: true,
          dryRun: process.env.NODE_ENV === "development",
          release: 'mave-registry-frontend@' + process.env.VUE_APP_VERSION
        }),
        new PrerenderSPAPlugin({
          staticDir: path.join(__dirname, 'dist'),
          routes: [ '/', '/policy/terms', '/policy/privacy'],
          renderer: new Renderer({
            headless: true,
            renderAfterDocumentEvent: 'render-event'
          })
        })
      ],
      devtool: 'source-map'
    }
  },
  devServer: {
    disableHostCheck: true
  }
}