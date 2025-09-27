export default {
  source: ['tokens/tokens.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'styles/',
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
          },
          filter: function(token) {
            return token.path && token.path.includes('modes') && token.path.includes('dark');
          }
        }
      ]
    },
    js: {
      transformGroup: 'js',
      buildPath: 'utils/',
      files: [
        {
          destination: 'tokens.js',
          format: 'javascript/es6'
        }
      ]
    }
  }
};
