const { resolve } = require('path');
const { DefinePlugin, HotModuleReplacementPlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const MODE_PRODUCTION = 'production';
const MODE_DEVELOPMENT = 'development';

const isProduction = process.env.NODE_ENV === MODE_PRODUCTION;

const config = {
  mode: MODE_DEVELOPMENT,
  target: ['web', 'es5'],
  entry: resolve(__dirname, './src/main.js'),
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'js/[name].js',
    chunkFilename: 'js/[name].js',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  plugins: [
    new DefinePlugin({
      'process.env': {
        NODE_ENV: isProduction ? `"${MODE_PRODUCTION}"` : `"${MODE_DEVELOPMENT}"`,
      },
    }),
    new HtmlWebpackPlugin({
      template: resolve(__dirname, './public/index.html'),
    }),
  ],
};

if (isProduction) {
  config.mode = MODE_PRODUCTION;

  config.plugins = [
    ...config.plugins,
    new CleanWebpackPlugin(),
  ];
} else {
  config.devtool = 'source-map';

  config.plugins = [
    ...config.plugins,
    new HotModuleReplacementPlugin({}),
  ];

  config.devServer = {
    compress: true,
    host: '0.0.0.0',
    port: 8080,
    hot: true,
    liveReload: false,
    historyApiFallback: true,
    overlay: {
      warnings: true,
      errors: true,
    },
  };
}

module.exports = config;
