const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: './src/js/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }],
        exclude: '/node_modules/'
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: [{
            loader: 'css-loader',
            options: {
              minimize: true
            }
          }]
        })
      },
      {
        test: /\.(png|jpg|gif|jpeg)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 20480,
            outputPath: 'img'
          }
        }]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'index.html'),
      filename: 'index.html',
      hash: true, // 防止缓存
      minify: {
        removeAttributeQuotes: true // 压缩
      }
    }),
    new CopyWebpackPlugin([{
      from: './src/img',
      to: '../dist/img'
    }]),
    new CopyWebpackPlugin([{
      from: './src/sound',
      to: '../dist/sound'
    }]),
    new ExtractTextPlugin('style.css'),
    new UglifyJsPlugin()
  ]
}
