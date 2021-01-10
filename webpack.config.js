const { resolve } = require('path');
const { DefinePlugin, HotModuleReplacementPlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

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
    minimizer: [
      new CssMinimizerPlugin(),
    ],
  },
  plugins: [
    new CaseSensitivePathsPlugin(),
    new ESLintPlugin(),
    new DefinePlugin({
      'process.env': {
        NODE_ENV: isProduction ? `"${MODE_PRODUCTION}"` : `"${MODE_DEVELOPMENT}"`,
      },
    }),
    new HtmlWebpackPlugin({
      template: resolve(__dirname, './public/index.html'),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
      {
        test: /\.s(c|a)ss$/,
        use: [
          isProduction ? { loader: MiniCssExtractPlugin.loader } : 'style-loader',
          'css-loader',
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              // eslint-disable-next-line global-require
              implementation: require('sass'),
              sassOptions: {
                // eslint-disable-next-line global-require
                fiber: require('fibers'),
              },
            },
          },
        ],
      },
    ],
  },
};

if (isProduction) {
  config.mode = MODE_PRODUCTION;

  config.plugins = [
    ...config.plugins,
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'styles/[name].css',
      chunkFilename: 'styles/[name].css',
      ignoreOrder: true,
    }),
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
