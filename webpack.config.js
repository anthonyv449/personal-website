// webpack.config.js (in root)
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./host/src/index.js", // or your actual entry file
  output: {
  path: path.resolve(__dirname, "host/dist"),
  filename: "bundle.js",
  publicPath: "/",
  clean: true,
},
  plugins: [
    new HtmlWebpackPlugin({
      template: "./host/public/index.html", // template source
      filename: "index.html", // output file
    }),
  ],
};
