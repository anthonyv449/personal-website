import webpack from "webpack";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ModuleFederationPlugin from "webpack/lib/container/ModuleFederationPlugin.js";

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function loadRemotes() {
  const file = path.resolve(process.cwd(), "host/public/remotes.json");
  const json = await fs.readFile(file, "utf-8");
  return JSON.parse(json);
}

function generateShared() {
  const hostPkg = require("../package.json");
  const deps = hostPkg.dependencies || {};
  const mfSharedList = hostPkg.mfShared || [];

  const shared = {};
  mfSharedList.forEach((pkg) => {
    if (!deps[pkg]) {
      console.warn(
        `⚠️ Host mfShared package "${pkg}" is not listed in dependencies.`
      );
      return;
    }

    shared[pkg] = {
      singleton: true,
      requiredVersion: deps[pkg],
      strictVersion: true,
      ...(pkg === "@anthonyv449/ui-kit" ? {} : { eager: true }),
    };
  });

  return shared;
}

function mergeShared(hostShared) {
  return hostShared;
}

function createRemoteConfig(remote, hostShared, version) {
  let exposedModules = {
    [remote.name]: `./remotes/${remote.name.toLowerCase()}/index.js`,
  };
  if (remote.children) {
    remote.children.forEach(
      (child) =>
        (exposedModules[
          child.title
        ] = `./remotes/${remote.name.toLowerCase()}/${child.title}.js`)
    );
  }
  return {
    mode: "production",
    entry: path.resolve(
      process.cwd(),
      `./remotes/${remote.name.toLowerCase()}/index.js`
    ),
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
    resolve: {
      extensions: [".js", ".jsx"],
      modules: [path.resolve(__dirname, "../node_modules"), "node_modules"],
    },
    plugins: [
      new HtmlWebpackPlugin({ title: remote.name }),
      new ModuleFederationPlugin({
        name: remote.name,
        filename: "remoteEntry.js",
        exposes: exposedModules,
        shared: mergeShared(hostShared),
      }),
    ],
  };
}

function runWebpack(config, label) {
  return new Promise((resolve, reject) => {
    webpack(config, (err, stats) => {
      if (err || stats.hasErrors()) {
        console.error(`❌ ${label} build failed`);
        console.error(
          stats.toString({
            colors: true,
          })
        );
        return reject(err || new Error("Build error"));
      }
      console.log(`✅ ${label} built`);
      resolve();
    });
  });
}

async function buildAllRemotes() {
  let remotes = await loadRemotes();
  const only = process.env.REMOTE_NAMES
    ? process.env.REMOTE_NAMES.split(/[,\s]+/).filter(Boolean)
    : null;
  if (only) {
    remotes = remotes.filter(
      (r) => only.includes(r.name) || only.includes(r.name.toLowerCase())
    );
  }
  const hostShared = generateShared();

  const remotesMap = {};
  for (const r of remotes) {
    const pkg = require(path.resolve(process.cwd(), r.folder, "package.json"));
    const version = pkg.version;
    await runWebpack(
      createRemoteConfig(r, hostShared, version),
      `${r.name} v${version}`
    );
    const versionPath = path.resolve(process.cwd(), "dist", r.name, version);
    const latestPath = path.resolve(process.cwd(), "dist", r.name, "latest");
    await fs.rm(latestPath, { recursive: true, force: true });
    await fs.cp(versionPath, latestPath, { recursive: true });
    remotesMap[r.name] = `${
      r.name
    }@/remotes/${r.name.toLowerCase()}/latest/remoteEntry.js`;
  }
  console.log("🎉 All builds done.");
}

buildAllRemotes().catch((e) => {
  console.error("Build process failed:", e);
  process.exit(1);
});
