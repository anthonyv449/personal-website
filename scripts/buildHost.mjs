import webpack from "webpack";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import fs from "fs/promises";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import ModuleFederationPlugin from "webpack/lib/container/ModuleFederationPlugin.js";

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function generateShared(hostDeps) {
  const shared = {};
  Object.keys(hostDeps).forEach((pkg) => {
    shared[pkg] = {
      singleton: true,
      eager: true,
      requiredVersion: hostDeps[pkg],
      strictVersion: true,
    };
  });
  return shared;
}

async function loadRemotes() {
  const jsonStr = await fs.readFile(
    path.resolve(__dirname, "../host/public/remotes.json"),
    "utf-8"
  );
  return JSON.parse(jsonStr);
}

function createHostConfig(remotesMap, shared) {
  return {
    mode: "production",
    entry: path.resolve(__dirname, "../host/src/index.js"),
    output: {
      filename: "bundle.js",
      path: path.resolve(__dirname, "../dist/host"),
      publicPath: "/",
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"],
            },
          },
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.svg$/,
          issuer: /\.[jt]sx?$/,
          use: [{ loader: "@svgr/webpack" }],
        },
      ],
    },
    resolve: {
      extensions: [".js", ".jsx"],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "../host/public/index.html"),
        filename: "index.html",
      }),
      new ModuleFederationPlugin({
        name: "host",
        remotes: remotesMap,
        shared,
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: "host/public/content.json", to: "content.json" },
          { from: "host/public/remotes.json", to: "remotes.json" },
          { from: "host/public/env.json", to: "env.json" },
          { from: "host/public/favicon.ico", to: "favicon.ico" },
        ],
      }),
    ],
  };
}

function runWebpack(config, name) {
  return new Promise((resolve, reject) => {
    webpack(config, (err, stats) => {
      if (err || stats.hasErrors()) {
        console.error(`❌ Error building ${name}`);
        console.error(stats.toString({ colors: true }));
        return reject(err || new Error("Build error"));
      }
      console.log(`✅ ${name} built successfully.`);
      resolve();
    });
  });
}
// all we need from remotes.json here is name
async function buildHost() {
  const remotes = await loadRemotes();
  const remotesMap = {};
  remotes.forEach((r) => {
    remotesMap[r.name] = `${
      r.name
    }@/remotes/${r.name.toLowerCase()}/latest/remoteEntry.js`;
  });
  const hostDeps = require("../package.json").dependencies;
  const shared = generateShared(hostDeps);
  const hostConfig = createHostConfig(remotesMap, shared);
  await runWebpack(hostConfig, "host");
  console.log("\n🎉 Host build complete.");
}

buildHost().catch((err) => {
  console.error("❌ Build process failed:", err);
  process.exit(1);
});
