// setupApp.js
import inquirer from 'inquirer';
import { exec } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import process from 'node:process';

// If you need file-based operations, you can derive __dirname like this:
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * List of remotes to configure. Adjust these to match your folder names.
 * Each remote should have its own webpack.config.js in remotes/<remoteName>/webpack.config.js
 */
const REMOTES = ['remote-1', 'remote-2', 'remote-3'];

/**
 * Runs Webpack Dev Server for the host application.
 * Assumes your host's webpack config is at `host/webpack.config.js`.
 */
function runHostDevServer() {
  return new Promise((resolvePromise, rejectPromise) => {
    // Adjust the command or path to your webpack config as needed.
    const cmd = 'webpack serve --config ./webpack.config.js';

    const childProc = exec(cmd, (err, stdout, stderr) => {
      if (err) {
        rejectPromise(`Error running Webpack Dev Server for host: ${stderr}`);
      } else {
        console.log(stdout);
        resolvePromise();
      }
    });

    // Pipe the child process output directly to the parent console (optional)
    childProc.stdout.pipe(process.stdout);
    childProc.stderr.pipe(process.stderr);
  });
}

/**
 * Runs Webpack Dev Server for a single remote.
 * Assumes each remote's webpack config is in `remotes/<remoteName>/webpack.config.js`.
 */
function runRemoteDevServer(remoteName) {
  return new Promise((resolvePromise, rejectPromise) => {
    const cmd = `webpack serve --config remotes/${remoteName}/webpack.config.js`;

    const childProc = exec(cmd, (err, stdout, stderr) => {
      if (err) {
        rejectPromise(`Error running Webpack Dev Server for ${remoteName}: ${stderr}`);
      } else {
        console.log(stdout);
        resolvePromise();
      }
    });

    // Pipe the child process output directly to the parent console (optional)
    childProc.stdout.pipe(process.stdout);
    childProc.stderr.pipe(process.stderr);
  });
}

/**
 * Main setup function:
 * 1. Prompts the user to select which remotes to run.
 * 2. Always starts the host dev server.
 * 3. Starts only the selected remotes.
 */
async function setupApp() {
  try {
    // Prompt user with a checkbox list of all possible remotes.
    const { selectedRemotes } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'selectedRemotes',
        message: 'Select which remotes you want to run (space to toggle, enter to confirm):',
        choices: REMOTES,
        default: [], // By default, none are selected
      },
    ]);

    // Always start the host dev server
    const hostPromise = runHostDevServer();

    // Start only the remotes that were selected
    const remotePromises = selectedRemotes.map((remoteName) => runRemoteDevServer(remoteName));

    // Wait until the host and all selected remotes have started
    await Promise.all([hostPromise, ...remotePromises]);

    console.log('\n✅ Development environment is running.');
    console.log('   Host is on port 3000 (or configured port).');
    console.log(
      selectedRemotes.length > 0
        ? `   Remotes started: ${selectedRemotes.join(', ')}`
        : '   No remotes were selected.'
    );
  } catch (error) {
    console.error('Error during setup:', error);
    process.exit(1); // Exit with error code
  }
}

// Execute our setup function
setupApp();
