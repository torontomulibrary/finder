const sass = require('@stencil/sass');

exports.config = {
  enableCache: false,
  namespace: 'finder',
  globalScript: 'src/global/lazy-store.ts',
  plugins: [
    sass({ includePaths: ['./node_modules', './src/global']}),
  ],
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
};
