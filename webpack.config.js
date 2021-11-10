const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  // entry file
  // https://webpack.js.org/configuration/entry-context/#entry
  entry: {
    app: './src/index.js',
    home: './src/js/home.js',
    map: './src/js/map.js',
    mypage: './src/js/mypage.js',
    list: './src/js/list.js',
    recruit: './src/js/recruit.js',
    sign: './src/js/sign.js',
  },
  // 번들링된 js 파일의 이름(filename)과 저장될 경로(path)를 지정
  // https://webpack.js.org/configuration/output/#outputpath
  // https://webpack.js.org/configuration/output/#outputfilename
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'js/[name].bundle.js',
  },
  // https://webpack.js.org/configuration/module
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        include: [path.resolve(__dirname, 'src/scss')],
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.js$/,
        include: [path.resolve(__dirname, 'src/js')],
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              [
                '@babel/plugin-transform-runtime',
                {
                  // https://babeljs.io/docs/en/babel-plugin-transform-runtime#corejs
                  corejs: 3,
                  proposals: true,
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-url-loader',
            options: {
              limit: 10000,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      chunks: ['app', 'home'],
    }),
    new HtmlWebpackPlugin({
      filename: 'map.html',
      template: 'src/pages/map.html',
      chunks: ['app', 'map'],
    }),
    new HtmlWebpackPlugin({
      filename: 'mypage.html',
      template: 'src/pages/mypage.html',
      chunks: ['app', 'mypage'],
    }),
    new HtmlWebpackPlugin({
      filename: 'list.html',
      template: 'src/pages/list.html',
      chunks: ['app', 'list'],
    }),
    new HtmlWebpackPlugin({
      filename: 'recruit.html',
      template: 'src/pages/recruit.html',
    }),
    new HtmlWebpackPlugin({
      filename: 'sign.html',
      template: 'src/pages/sign.html',
    }),
    // new MiniCssExtractPlugin({ filename: 'css/style.css' }),
    new CopyPlugin({
      patterns: [
        {
          from: path.join(__dirname, 'src/images'),
          to: path.join(__dirname, `public/images`),
        },
      ],
    }),
  ],

  // https://webpack.js.org/configuration/dev-server
  devServer: {
    // https://webpack.js.org/configuration/dev-server/#devserverstatic
    static: {
      // https://webpack.js.org/configuration/dev-server/#directory
      directory: path.join(__dirname, 'public'), //
    },
    // https://webpack.js.org/configuration/dev-server/#devserveropen
    open: true,
    // https://webpack.js.org/configuration/dev-server/#devserverport
    port: 'auto',
    // https://webpack.js.org/configuration/dev-server/#devserverproxy
    proxy: {
      '/': {
        target: 'http://localhost:3001/',
        pathRewrite: { '^/': '/' },
      },
    },
  },
  // 소스 맵(Source Map)은 디버깅을 위해 번들링된 파일과 번들링되기 이전의 소스 파일을 연결해주는 파일이다.
  devtool: 'source-map',
  // https://webpack.js.org/configuration/mode
  mode: 'development',
};
