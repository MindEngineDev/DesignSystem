export default {
  source: ['packages/tokens/global.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'site/dist/',
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables',
          options: {
            selector: ':root',
            outputReferences: true
          }
        },
        {
          destination: 'tokens.dark.css',
          format: 'css/variables',
          options: {
            selector: ':root[data-theme="dark"]',
            outputReferences: true
          }
        },
        {
          destination: 'tokens.json',
          format: 'json/flat'
        },
        {
          destination: 'tokens.module.js',
          format: 'javascript/es6'
        }
      ]
    }
  }
};
