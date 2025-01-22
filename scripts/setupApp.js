import inquirer from "inquirer";
import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";
import path from "path";
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ModuleFederationPlugin from "webpack/lib/container/ModuleFederationPlugin.js";

/**
 * Utility for ESM __dirname
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Define your remotes.
 * Each remote has:
 *  - name         -> The remote's Module Federation name (e.g., "remote1")
 *  - port         -> Unique port where this remote will run
 *  - folder       -> The path to this remote's folder
 *  - entry        -> The path to the remote's main React entry file
 *  - publicDir    -> The path to the remote's public folder
 *  - exposes      -> An object specifying Module Federation "exposes"
 */
const REMOTES = [
  {
    name: "remote1",
    port: 3001,
    folder: "remotes/remote-1",
    entry: "./remotes/remote-1/src/index.js",
    publicDir: "./remotes/remote-1/public",
    exposes: {
      "./Component": "./remotes/remote-1/src/Component.js",
    },
  },
  {
    name: "remote2",
    port: 3002,
    folder: "remotes/remote-2",
    entry: "./remotes/remote-2/src/index.js",
    publicDir: "./remotes/remote-2/public",
    exposes: {
      "./Component": "./remotes/remote-2/src/Component.js",
    },
  },
  {
    name: "remote3",
    port: 3003,
    folder: "remotes/remote-3",
    entry: "./remotes/remote-3/src/index.js",
    publicDir: "./remotes/remote-3/public",
    exposes: {
      "./Component": "./remotes/remote-3/src/Component.js",
    },
  },
];

/**
 * Create the in-memory Webpack config for the HOST application.
 * We assume it lives in `./host/` with an `index.js` and `public/` folder.
 */
function createHostConfig(remotesMap) {
  return {
    mode: "development",
    entry: "/host/src/index.js",
    devServer: {
      static: path.join(__dirname, "../host/public"),
      port: 3000,
      open: true, // auto-open browser for the host
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
        shared: {
          react: {
            singleton: true,
            eager: true,
            requiredVersion: "^19.0.0", // or from package.json
            strictVersion: true,
          },
          "react-dom": {
            singleton: true,
            eager: true,
            requiredVersion: "^19.0.0", // or from package.json
            strictVersion: true,
          },
          lodash: {
            requiredVersion: "^4.17.21",
          },
        },
      }),
    ],
  };
}

/**
 * Create the in-memory Webpack config for a given remote definition.
 */
function createRemoteConfig(remote) {
  return {
    mode: "development",
    entry: remote.entry,
    devServer: {
      static: path.resolve(__dirname, remote.publicDir),
      port: remote.port,
      open: false, // can set to true, but multiple remotes => multiple tabs
      hot: true,
    },
    output: {
      filename: "bundle.js",
      publicPath: `http://localhost:${remote.port}/`,
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
      ],
    },
    resolve: {
      extensions: [".js", ".jsx"],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, remote.publicDir, "index.html"),
      }),
      new ModuleFederationPlugin({
        name: remote.name,
        filename: "remoteEntry.js",
        exposes: remote.exposes,
        shared: {
          react: {
            singleton: true,
            eager: true,
            requiredVersion: "^19.0.0", // or from package.json
            strictVersion: true,
          },
          "react-dom": {
            singleton: true,
            eager: true,
            requiredVersion: "^19.0.0", // or from package.json
            strictVersion: true,
          },
          lodash: {
            requiredVersion: "^4.17.21",
            singleton: false,
          },
        },
      }),
    ],
  };
}

/**
 * Helper to run Webpack Dev Server in-memory.
 */
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

/**
 * Start the host dev server, referencing only the selected remotes.
 */
async function startHost(selectedRemotes) {
  // Build the "remotes" object for ModuleFederationPlugin in the host
  const remotesMap = {};
  selectedRemotes.forEach((remote) => {
    remotesMap[
      remote.name
    ] = `${remote.name}@http://localhost:${remote.port}/remoteEntry.js`;
  });

  // Create the ephemeral host config
  const hostConfig = createHostConfig(remotesMap);

  // Run the dev server
  await runDevServer(hostConfig);
  console.log("Host is running at http://localhost:3000");
}

/**
 * Start each selected remote in parallel.
 */
async function startRemotes(selectedRemotes) {
  await Promise.all(
    selectedRemotes.map(async (remote) => {
      const config = createRemoteConfig(remote);
      await runDevServer(config);
      console.log(`${remote.name} running at http://localhost:${remote.port}`);
    })
  );
}

/**
 * Main interactive function:
 *  - Prompts which remotes to run (checkbox).
 *  - Always starts the host.
 *  - Starts only the chosen remotes in parallel.
 */
async function setupApp() {
  try {
    // Prompt user to select remotes
    const { selectedNames } = await inquirer.prompt([
      {
        type: "checkbox",
        name: "selectedNames",
        message: "Select which remotes to run:",
        choices: REMOTES.map((r) => r.name),
        default: [],
      },
    ]);

    const selectedRemotes = REMOTES.filter((r) =>
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

// Execute
setupApp();
