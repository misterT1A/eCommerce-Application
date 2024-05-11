const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const DotenvWebpackPlugin = require('dotenv-webpack');
const EslingPlugin = require('eslint-webpack-plugin');
const postCss = require('postcss-preset-env');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = ({ mode }) => {
  const isDevMode = mode === 'dev';

  const baseConfig = {
    entry: path.resolve(__dirname, './src/index.ts'),
    mode: isDevMode ? 'development' : 'production',
    devtool: isDevMode ? 'inline-source-map' : undefined,
    devServer: {
      port: 3000,
      historyApiFallback: true,
    },
    module: {
      rules: [
        {
          test: /\.html$/i,
          loader: 'html-loader',
        },
        {
          test: /\.(c|sa|sc)ss$/i,
          exclude: /\.module\.(c|sa|sc)ss$/i,
          use: [
            isDevMode ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                modules: {
                  localIdentName: '[name]__[local]--[hash:base64:5]',
                },
                sourceMap: isDevMode,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [postCss],
                },
              },
            },
            'sass-loader',
            {
              loader: 'sass-resources-loader',
              options: {
                sourceMap: isDevMode,
                resources: ['./src/style/_vars.scss', './src/style/_mixins.scss', './src/style/_functions.scss'],
              },
            },
          ],
        },
        {
          test: /\.ts$/i,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.(jpe?g|jpg|png|webp|gif|svg)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'assets/img/[name][ext]',
          },
        },
        {
          test: /\.(mp3|wav)$/,
          loader: 'file-loader',
          options: {
            outputPath: 'assets/sounds/[name][ext]',
          },
        },
        {
          test: /\.(eot|otf|ttf|woff2?)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[hash][ext][query]',
          },
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      plugins: [new TsconfigPathsPlugin({ configFile: path.resolve(__dirname, './tsconfig.json') })],
    },
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, './dist'),
      clean: true,
      assetModuleFilename: 'assets/[name][ext]',
    },
    plugins: [
      new DotenvWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, './src/index.html'),
        filename: 'index.html',
        // favicon: path.resolve(__dirname, ''),
      }),
      new EslingPlugin({ extensions: 'ts' }),
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),
      new CopyPlugin({
        patterns: [
          {
            from: 'src/assets',
            to: 'assets/img',
          },
        ],
      }),
    ],
  };
  return baseConfig;
};
