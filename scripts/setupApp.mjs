import { createRequire } from "module";
const require = createRequire(import.meta.url);

import inquirer from "inquirer";
import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ModuleFederationPlugin from "webpack/lib/container/ModuleFederationPlugin.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Helper: Generate a shared config object for all dependencies from the host's package.json.
 */
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

/**
 * Helper: Merge host shared configuration with remote dependencies.
 * Any package that is not defined in the host will be left out from shared,
 * so the remote will use its own copy.
 */
function mergeShared(hostShared, remoteDeps) {
  // For packages defined in hostShared, use those settings.
  // Leave out any remote-only packages.
  return { ...hostShared };
}

/**
 * Load remotes from a local JSON file (using fs/promises).
 */
async function loadRemotes() {
  try {
    const filePath = "./host/public/remotes.json";
    const jsonStr = await fs.readFile(filePath, "utf-8"); // read file from disk
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Failed to load remotes.json:", error);
    return [];
  }
}

/**
 * Create the in-memory Webpack config for the HOST application.
 */
function createHostConfig(remotesMap) {
  const shared = generateShared();
  return {
    mode: "development",
    entry: path.join(__dirname, "../host/src/index.js"),
    devServer: {
      static: path.join(__dirname, "../host/public"),
      port: 3000,
      open: true,
      hot: true,
      historyApiFallback: true,
    },
    output: {
      filename: "bundle.js",
      publicPath: "http://localhost:3000/",
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
          issuer: /\.[j]sx?$/, // ensures that only JS/TS files import svg files
          use: [
            {
              loader: "@svgr/webpack",
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: [".js", ".jsx"],
      modules: [path.resolve(__dirname, "../node_modules"), "node_modules"],
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

function createRemoteConfig(remote) {
  try {
    // Assume remote.folder is provided in the remotes.json file to locate its package.json.
    const remotePkg = require(`../${remote.folder}/package.json`);
    const remoteDeps = remotePkg.dependencies || {};
    const remotePeerDeps = remotePkg.peerDependencies || {};
    
    // Get the host's shared configuration to be used in remotes.
    const hostShared = generateShared();
    
    // Merge host shared settings and include peer dependencies that are also in host shared
    const shared = { ...hostShared };
    
    // Add peer dependencies that are in the host's shared list
    Object.keys(remotePeerDeps).forEach(pkg => {
      if (hostShared[pkg]) {
        shared[pkg] = hostShared[pkg];
      }
    });
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
      mode: "development",
      entry: `./remotes/${remote.name.toLowerCase()}/index.js`,
      devServer: {
        port: remote.port,
        open: false,
        headers: {
          "Access-Control-Allow-Origin": "*", // or specify the allowed origin(s)
        },
      },
      output: {
        filename: "bundle.js",
        publicPath: "auto",
        library: { type: "var", name: remote.name },
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
            issuer: /\.[j]sx?$/, // ensures that only JS/TS files import svg files
            use: [
              {
                loader: "@svgr/webpack",
              },
            ],
          },
        ],
      },
      resolve: {
        extensions: [".js", ".jsx"],
        modules: [path.resolve(__dirname, "../node_modules"), "node_modules"],
      },
      plugins: [
        new HtmlWebpackPlugin({
          // Generates a minimal HTML if you omit 'template'
          title: "Remote Minimal",
        }),
        new ModuleFederationPlugin({
          name: remote.name,
          filename: "remoteEntry.js",
          exposes: exposedModules,
          shared,
        }),
      ],
    };
  } catch (error) {
    console.log(error);
    console.log("runtime error");
  }
}

function runDevServer(config) {
  return new Promise((resolve, reject) => {
    const compiler = webpack(config);
    const server = new WebpackDevServer(config.devServer, compiler);
    server
      .start()
      .then(() => {
        resolve(server);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

async function startHost(selectedRemotes) {
  // Build the "remotes" object for ModuleFederationPlugin in the host
  const remotesMap = {};
  selectedRemotes.forEach((remote) => {
    remotesMap[
      remote.name
    ] = `${remote.name}@http://localhost:${remote.port}/remoteEntry.js`;
  });

  const hostConfig = createHostConfig(remotesMap);
  await runDevServer(hostConfig);
  console.log("Host is running at http://localhost:3000");
}

async function startRemotes(selectedRemotes) {
  await Promise.all(
    selectedRemotes.map(async (remote) => {
      const config = createRemoteConfig(remote);
      await runDevServer(config);
      console.log(`${remote.name} running at http://localhost:${remote.port}`);
    })
  );
}

async function setupApp() {
  try {
    const remotes = await loadRemotes();
    if (!remotes || remotes.length === 0) {
      console.log("No remotes found in remotes.json");
      return;
    }

    // Prompt user to select remotes
    const { selectedNames } = await inquirer.prompt([
      {
        type: "checkbox",
        name: "selectedNames",
        message: "Select which remotes to run:",
        choices: remotes.map((r) => r.name),
        default: [],
      },
    ]);

    const selectedRemotes = remotes.filter((r) =>
      selectedNames.includes(r.name)
    );

    // Start the host referencing only these chosen remotes
    const hostPromise = startHost(selectedRemotes);

    // Start the selected remotes
    const remotePromise = startRemotes(selectedRemotes);

    // Wait for all to start
    await Promise.all([hostPromise, remotePromise]);

    console.log("\nAll selected servers are running.");
    if (selectedRemotes.length > 0) {
      console.log("Remotes:", selectedRemotes.map((r) => r.name).join(", "));
    } else {
      console.log("No remotes selected, only the host is running.");
    }
  } catch (error) {
    console.error("Error during setup:", error);
    process.exit(1);
  }
}

setupApp();
