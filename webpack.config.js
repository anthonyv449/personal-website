const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const deps = require("./package.json").dependencies;

// Build a shared-deps map with explicit versions (not workspace:* or caret ranges)
const sharedDeps = Object.entries(deps).reduce((shared, [pkg, reqVersion]) => {
  let version = reqVersion;
  try {
    // Attempt to read the installed version from node_modules
    version = require(path.join(__dirname, "node_modules", pkg, "package.json")).version;
  } catch (err) {
    console.warn(`⚠️ could not resolve version for ${pkg}, using requiredVersion ${reqVersion}`);
  }
  shared[pkg] = {
    singleton: true,
    strictVersion: true,
    requiredVersion: reqVersion,
    version,
  };
  return shared;
}, {});

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
    // Share all root dependencies as singletons with explicit versions
    new ModuleFederationPlugin({
      name: "shell",
      shared: sharedDeps,
    }),

    new HtmlWebpackPlugin({
      template: "./host/public/index.html",
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
