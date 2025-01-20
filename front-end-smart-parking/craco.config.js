const path = require('path')

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.cache = {
        type: 'filesystem',
        cacheDirectory: path.resolve(__dirname, 'node_modules/.cache/webpack')
      }
      return webpackConfig
    },
    alias: {
      '@': path.resolve(__dirname, 'src/'),
      '@Components': path.resolve(__dirname, 'src/components'),
      '@image': path.resolve(__dirname, 'src/assets/image')
    }
  }
}
