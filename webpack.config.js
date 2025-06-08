const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

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
        test: /\.(js|jsx)$/,         // Handle .js and .jsx files
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],     // Allows importing without extension
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./host/public/index.html",
      filename: "index.html",
    }),
  ],
};
