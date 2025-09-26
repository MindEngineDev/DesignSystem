export default {
  source: ['tokens/tokens.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'site/dist/',
      files: [
        { destination: 'tokens.css', format: 'css/variables', options: { selector: ':root' } },
        { destination: 'tokens.dark.css', format: 'css/variables', options: { selector: ':root[data-theme="dark"]' } },
        { destination: 'tokens.json', format: 'json/flat' }
      ]
    }
  }
}
