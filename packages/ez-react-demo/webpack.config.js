const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');

module.exports = {
  entry: {
    index: './src/index.tsx',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash].min.js',
    // if you use cdn, remember adding publicPath
    // publicPath: 'https://cdn.example.com/assets/[hash]/',
    // libraryTarget: 'umd',
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
    }, {
      test: /\.css$/,
      use: [{
        loader: 'style-loader',
      }, {
        loader: "css-loader",
      },],
      exclude: '/node_modules/',
    }, {
      test: /\.s[ca]ss$/,
      use: [{
        loader: 'style-loader',
      }, {
        loader: 'css-loader',
      }, {
        loader: 'postcss-loader',
      }, {
        loader: 'sass-loader'
      },],
      exclude: '/node_modules/',
    }, {
      test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      use: [{
        loader: 'url-loader',
        options: {
          //1024 == 1kb, pack to base64 inline url if size <- 10240 bytes
          limit: 10240,
          name: path.join('img/[name].[hash:7].[ext]')
        },
      },],
      exclude: '/node_modules/',
    }, {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 10240,
          name: path.join('font/[name].[hash:7].[ext]')
        },
      },],
      exclude: '/node_modules/',
    }, ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'public/index.html',
      inject: true,
    }),
    new ErrorOverlayPlugin(),
  ],
  mode: "development",
  devtool: 'cheap-module-source-map',
  // devtool: 'eval', // 'eval' is not supported by error-overlay-webpack-plugin
  
  devServer: {
    host: "127.0.0.1",
    port: 7991,
    historyApiFallback: true,
    open: true,
    hot: true,
    compress: false,
    http2: false,
    https: false,
  },
};
