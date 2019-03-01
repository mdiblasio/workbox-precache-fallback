const { InjectManifest } = require('workbox-webpack-plugin');
const path = require('path');

module.exports = [{
  mode: 'development',
  entry: {
    file1: './src/file1.js',
    file2: './src/file2.js',
    file3: './src/file3.js',
    file4: './src/file4.js',
    file5: './src/file5.js',
    main: './src/main.js'
  },
  output: {
    filename: '[name]-bundle.[chunkhash].js',
    path: path.resolve(__dirname, 'build')
  },

  plugins: [
    new InjectManifest({
      swSrc: './src/sw.js',
      swDest: 'sw.js',
      importWorkboxFrom: 'cdn'
    })
  ]
}];