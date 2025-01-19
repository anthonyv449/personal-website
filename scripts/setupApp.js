// setupApp.js
import inquirer from "inquirer";
import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";
import path from "path";
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ModuleFederationPlugin from "webpack/lib/container/ModuleFederationPlugin.js";

// Derive __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** 
 * Define your remotes. Each remote can have its own port, entry file(s), 
 * and modules it exposes via Module Federation. Adjust as needed.
 */
const REMOTES = [
  {
    name: "remote-1",
    port: 3001,
    entry: "./remotes/remote-1/src/index.js",
    publicDir: "./remotes/remote-1/public",
    exposes: {
      "./Component": "./remotes/remote-1/src/Component.js",
    },
  },
  {
    name: "remote-2",
    port: 3002,
    entry: "./remotes/remote-2/src/index.js",
    publicDir: "./remotes/remote-2/public",
    exposes: {
      "./Component": "./remotes/remote-2/src/Component.js",
    },
  },
  // add more remotes as desired
];

/**
 * 1) Programmatically create the HOST Webpack config in memory.
 *    This assumes your HOST source code is in `./src/` 
 *    and your HOST's public folder is `./public/`.
 */
function createHostConfig() {
  return {
    mode: "development",
    entry: "/host/src/index.js", // host entry
    devtool: "inline-source-map",
    devServer: {
      static: path.join(__dirname, "public"),
      port: 3000, // Host port
      open: true, // auto-open browser for host
      hot: true,
      historyApiFallback: true, // if using React Router
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
        template: "/host/public/index.html",
      }),
      new ModuleFederationPlugin({
        name: "host",
        /** 
         * The 'remotes' field will be dynamically configured 
         * depending on which remotes you want to run. 
         * We'll fill it in after user selection.
         */
        remotes: {},
        shared: {
          react: { singleton: true, eager: true },
          "react-dom": { singleton: true, eager: true },
        },
      }),
    ],
  };
}

/**
 * 2) Programmatically create each REMOTE config in memory.
 */
function createRemoteConfig(remote) {
  return {
    mode: "development",
    entry: remote.entry,
    devtool: "inline-source-map",
    devServer: {
      static: path.resolve(__dirname, remote.publicDir),
      port: remote.port,
      open: true, // auto-open a browser tab for each remote (optional!)
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
        template: path.resolve(__dirname, remote.publicDir, "index.html"),
      }),
      new ModuleFederationPlugin({
        name: remote.name,
        filename: "remoteEntry.js",
        exposes: remote.exposes,
        shared: {
          react: { singleton: true, eager: true },
          "react-dom": { singleton: true, eager: true },
        },
      }),
    ],
  };
}

/**
 * Helper function to "run" a WebpackDevServer instance using the Node API
 */
async function runDevServer(config) {
  return new Promise((resolve, reject) => {
    const compiler = webpack(config);
    const server = new WebpackDevServer(config.devServer, compiler);

    server
      .start()
      .then(() => {
        resolve(server);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * 3) Start the HOST dev server with the chosen remote definitions
 */
async function startHost(selectedRemotes) {
  // 1. Build the host config
  const hostConfig = createHostConfig();

  // 2. Generate a "remotes" object for the Host ModuleFederationPlugin
  //    Only for the user-selected remotes
  const hostRemotes = {};
  selectedRemotes.forEach((r) => {
    const { name, port } = r;
    // e.g., remote1: "remote1@http://localhost:3001/remoteEntry.js"
    hostRemotes[name] = `${name}@http://localhost:${port}/remoteEntry.js`;
  });

  // 3. Inject that into the host's ModuleFederationPlugin
  const mfPlugin = hostConfig.plugins.find(
    (p) => p.constructor.name === "ModuleFederationPlugin"
  );
  if (mfPlugin) {
    mfPlugin._options.remotes = hostRemotes;
  }

  // 4. Start the host dev server
  await runDevServer(hostConfig);
  console.log("✅ Host running at http://localhost:3000");
}

/**
 * 4) Start each selected remote in parallel
 */
async function startRemotes(selectedRemotes) {
  return Promise.all(
    selectedRemotes.map(async (r) => {
      const config = createRemoteConfig(r);
      await runDevServer(config);
      console.log(`✅ ${r.name} running at http://localhost:${r.port}`);
    })
  );
}

/**
 * 5) Main Interactive Function:
 *    - Prompt user to select which remotes to run
 *    - Always start the host
 *    - Start only the selected remotes
 */
async function setupApp() {
  try {
    // Let user pick which remotes to run
    const { selectedRemoteNames } = await inquirer.prompt([
      {
        type: "checkbox",
        name: "selectedRemoteNames",
        message: "Select which remotes you want to run (space to toggle):",
        choices: REMOTES.map((r) => r.name),
        default: [],
      },
    ]);

    // Filter the REMOTES array to only the ones selected
    const selectedRemotes = REMOTES.filter((r) =>
      selectedRemoteNames.includes(r.name)
    );

    // Start the host with the chosen remote definitions
    const hostPromise = startHost(selectedRemotes);

    // Start the selected remotes
    const remotePromise = startRemotes(selectedRemotes);

    // Wait for all to spin up
    await Promise.all([hostPromise, remotePromise]);

    console.log("\nAll selected servers are running:");
    if (selectedRemotes.length > 0) {
      console.log(
        `   Remotes: ${selectedRemotes.map((r) => r.name).join(", ")}`
      );
    } else {
      console.log("   No remotes selected, only host is running.");
    }
  } catch (error) {
    console.error("Error during setup:", error);
    process.exit(1);
  }
}

// Execute our setup function
setupApp();
