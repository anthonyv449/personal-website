const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./host/src/index.js",
  output: {
    path: path.resolve(__dirname, "host/dist"),
    filename: "bundle.js",
    publicPath: "/",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        options: { presets: ['@babel/env','@babel/preset-react'] },
      },
      {
        test: /\.svg$/,
        issuer: /\.[jt]sx?$/,
        use: ["@svgr/webpack"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./host/public/index.html",
      filename: "index.html",
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "host/public/content.json", to: "content.json" },
        { from: "host/public/remotes.json", to: "remotes.json" },
      ],
    }),
  ],
};
