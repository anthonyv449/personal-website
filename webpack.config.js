// webpack.config.js (Host Production Build)
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const rootDeps = require("./package.json").dependencies;

// Generate a shared-deps map with concrete versions
function generateShared(deps) {
  const shared = {};
  Object.keys(deps).forEach(pkg => {
    let version;
    try {
      version = require(path.join(pkg, "package.json")).version;
    } catch {
      // strip leading ^ or ~ if installed version unavailable
      version = deps[pkg].replace(/^[\^~]/, "");
    }
    shared[pkg] = {
      singleton: true,
      strictVersion: true,
      requiredVersion: version,
      eager: true,
    };
  });
  return shared;
}

const sharedDeps = generateShared(rootDeps);

module.exports = {
  mode: "production",
  entry: path.resolve(__dirname, "host/src/index.js"),
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
        exclude: /node_modules/,
        loader: "babel-loader",
        options: { presets: ["@babel/env", "@babel/preset-react"] },
      },
      {
        test: /\.svg$/,
        issuer: /\.[jt]sx?$/,
        use: ["@svgr/webpack"],
      },
    ],
  },
  resolve: { extensions: [".js", ".jsx"] },
  plugins: [
    new ModuleFederationPlugin({
      name: "shell",
      shared: sharedDeps,
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "host/public/index.html"),
      filename: "index.html",
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "host/public/content.json", to: "content.json" },
        { from: "host/public/remotes.json", to: "remotes.json" },
        { from: "host/public/env.json", to: "env.json" },
      ],
    }),
  ],
};
