let webpackConfig
module.exports = env => {
  switch (env.NODE_ENV) {
    case 'dev':
    default: {
      webpackConfig = require('./config/webpack.dev.config')
    }
  }
  return webpackConfig
} 