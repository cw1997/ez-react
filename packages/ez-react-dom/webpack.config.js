const path = require('path');

module.exports = {
  entry: {
    index: './src/index.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash].min.js',
    // if use cdn, remember adding publicPath
    // publicPath: 'https://cdn.example.com/assets/[hash]/',
    library: 'ez-react-dom',
    libraryTarget: 'umd',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [{
      test: /\.([jt])sx?$/,
      use: [
        {
          loader: 'babel-loader',
        },
      ],
      exclude: '/node_modules/',
    }]
  },
  plugins: [
  ],
  mode: "development",
  devtool: 'cheap-module-source-map',
};
