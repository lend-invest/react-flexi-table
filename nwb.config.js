module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'ReactFlexiTable',
      externals: {
        react: 'React',
        'classnames': 'classnames',
        'react-measure': 'react-measure',
        'lodash': 'lodash',
        'decimal.js-light': 'decimal.js-light'
      }
    }
  }
}
