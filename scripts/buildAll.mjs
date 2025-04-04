// scripts/buildAll.mjs
import webpack from "webpack";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

import HtmlWebpackPlugin from "html-webpack-plugin";
import ModuleFederationPlugin from "webpack/lib/container/ModuleFederationPlugin.js";

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

function mergeShared(hostShared, remoteDeps) {
  return { ...hostShared };
}

async function loadRemotes() {
  const jsonStr = await fs.readFile(path.resolve(__dirname, "../host/public/remotes.json"), "utf-8");
  return JSON.parse(jsonStr);
}

function createHostConfig(remotesMap) {
  const hostDeps = require("../package.json").dependencies;
  const shared = generateShared(hostDeps);
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
      }),
      new ModuleFederationPlugin({
        name: "host",
        remotes: remotesMap,
        shared,
      }),
    ],
  };
}

function createRemoteConfig(remote, hostShared) {
  const remoteDeps = require(`../${remote.folder}/package.json`).dependencies;
  const shared = mergeShared(hostShared, remoteDeps);
  return {
    mode: "production",
    entry: path.resolve(__dirname, `../${remote.entry}`),
    output: {
      filename: "bundle.js",
      path: path.resolve(__dirname, `../dist/${remote.name}`),
      publicPath: "auto",
      library: { type: "var", name: remote.name },
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
      new HtmlWebpackPlugin({ title: remote.name }),
      new ModuleFederationPlugin({
        name: remote.name,
        filename: "remoteEntry.js",
        exposes: remote.exposes,
        shared,
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

async function buildAll() {
  const remotes = await loadRemotes();
  const hostDeps = require("../package.json").dependencies;
  const hostShared = generateShared(hostDeps);

  for (const remote of remotes) {
    const config = createRemoteConfig(remote, hostShared);
    await runWebpack(config, remote.name);
  }

  const remotesMap = {};
  remotes.forEach((r) => {
    remotesMap[r.name] = `${r.name}@/dist/${r.name}/remoteEntry.js`;
  });

  const hostConfig = createHostConfig(remotesMap);
  await runWebpack(hostConfig, "host");

  console.log("\n🎉 All builds complete.");
}

buildAll().catch((err) => {
  console.error("❌ Build process failed:", err);
  process.exit(1);
});
