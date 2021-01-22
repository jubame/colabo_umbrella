const path = require('path');
const glob = require('glob');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = (env, options) => {
  const devMode = options.mode !== 'production';

  return {
    optimization: {
      minimizer: [
        new TerserPlugin({ cache: true, parallel: true, sourceMap: devMode }),
        new OptimizeCSSAssetsPlugin({})
      ]
    },
    entry: {
      'app': glob.sync('./vendor/**/*.js').concat(['./js/app.js'])
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, '../priv/static/js'),
      publicPath: '/js/'
    },
    devtool: devMode ? 'eval-cheap-module-source-map' : undefined,
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        },
        {
          test: /\.[s]?css$/,
          use:  [// [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader',],
            'vue-style-loader',
            MiniCssExtractPlugin.loader,
            'css-loader'
          ]
        },
        {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          loader: 'url-loader'
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          loader: 'url-loader'
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: 'url-loader'
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({ filename: '../css/app.css' }),
      new CopyWebpackPlugin([{ from: 'static/', to: '../' }]),
      new VueLoaderPlugin()
    ]
    .concat(devMode ? [new HardSourceWebpackPlugin()] : []),
    /*
    [Vue warn]: You are using the runtime-only build of Vue where the template
    option is not available. Either pre-compile the templates into render
    functions, or use the compiler-included build.
    https://github.com/vuejs-templates/webpack/issues/215#issuecomment-238095102
    */
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        'vue$': 'vue/dist/vue.esm.js',
        '@': resolve('assets'),
      }
    }
  }
};
