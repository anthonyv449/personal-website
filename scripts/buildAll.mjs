import webpack from "webpack";
import path from "path";
import fs from "fs/promises";
import { createRequire } from "module";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ModuleFederationPlugin from "webpack/lib/container/ModuleFederationPlugin.js";

const require = createRequire(import.meta.url);

async function loadRemotes() {
  const file = path.resolve(process.cwd(), "host/public/remotes.json");
  const json = await fs.readFile(file, "utf-8");
  return JSON.parse(json);
}

function generateShared(hostDeps) {
  const shared = {};
  for (const pkg of Object.keys(hostDeps)) {
    let version;
    try {
      version = require(path.join(pkg, "package.json")).version;
    } catch {
      version = hostDeps[pkg].replace(/^[\^~]/, "");
    }
    shared[pkg] = {
      singleton: true,
      strictVersion: true,
      requiredVersion: version,
      eager: true,
    };
  }
  return shared;
}

function mergeShared(hostShared) {
  return hostShared;
}

function createRemoteConfig(remote, hostShared, version) {
  return {
    mode: "production",
    entry: path.resolve(process.cwd(), remote.entry),
    output: {
      path: path.resolve(process.cwd(), "dist", remote.name, version),
      filename: "bundle.js",
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
    resolve: { extensions: [".js", ".jsx"] },
    plugins: [
      new HtmlWebpackPlugin({ title: remote.name }),
      new ModuleFederationPlugin({
        name: remote.name,
        filename: "remoteEntry.js",
        exposes: remote.exposes,
        shared: mergeShared(hostShared),
      }),
    ],
  };
}

function createHostConfig(remotesMap, hostShared) {
  return {
    mode: "production",
    entry: path.resolve(process.cwd(), "host/src/index.js"),
    output: {
      path: path.resolve(process.cwd(), "dist/host"),
      filename: "bundle.js",
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
            options: { presets: ["@babel/preset-env", "@babel/preset-react"] },
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
    resolve: { extensions: [".js", ".jsx"] },
    plugins: [
      new HtmlWebpackPlugin({ template: path.resolve(process.cwd(), "host/public/index.html") }),
      new ModuleFederationPlugin({
        name: "host",
        remotes: remotesMap,
        shared: hostShared,
      }),
    ],
  };
}

function runWebpack(config, label) {
  return new Promise((resolve, reject) => {
    webpack(config, (err, stats) => {
      if (err || stats.hasErrors()) {
        console.error(`❌ ${label} build failed`);
        console.error(stats.toString({
          colors: true,
        }));
        return reject(err || new Error("Build error"));
      }
      console.log(`✅ ${label} built`);
      resolve();
    });
  });
}

async function buildAll() {
  let remotes = await loadRemotes();
  const only = process.env.REMOTE_NAMES
    ? process.env.REMOTE_NAMES.split(/[,\s]+/).filter(Boolean)
    : null;
  if (only) {
    remotes = remotes.filter(r =>
      only.includes(r.name) || only.includes(r.name.toLowerCase())
    );
  }
  const hostDeps = require(path.resolve(process.cwd(), "package.json")).dependencies;
  const hostShared = generateShared(hostDeps);

  const remotesMap = {};
  for (const r of remotes) {
    const pkg = require(path.resolve(process.cwd(), r.folder, 'package.json'));
    const version = pkg.version;
    await runWebpack(createRemoteConfig(r, hostShared, version), `${r.name} v${version}`);
    const versionPath = path.resolve(process.cwd(), 'dist', r.name, version);
    const latestPath = path.resolve(process.cwd(), 'dist', r.name, 'latest');
    await fs.rm(latestPath, { recursive: true, force: true });
    await fs.cp(versionPath, latestPath, { recursive: true });
    remotesMap[r.name] = `${r.name}@/remotes/${r.name.toLowerCase()}/latest/remoteEntry.js`;
  }

  await runWebpack(createHostConfig(remotesMap, hostShared), "host");
  console.log("🎉 All builds done.");
}

buildAll().catch(e => {
  console.error("Build process failed:", e);
  process.exit(1);
});
