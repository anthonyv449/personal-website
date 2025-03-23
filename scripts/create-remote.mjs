import path from "path";
import fs from "fs";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

// Emulate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get remote name from command-line
const remoteName = process.argv[2];
if (!remoteName) {
  console.error(
    "❌ Please provide a remote name: npm run create-remote <name>"
  );
  process.exit(1);
}

// Capitalize the remote name for the function name
const capitalizedName =
  remoteName.charAt(0).toUpperCase() + remoteName.slice(1);

// Create folder one level up
const remotePath = path.join(__dirname, "../remotes", remoteName);
if (fs.existsSync(remotePath)) {
  console.error(`❌ Folder "${remoteName}" already exists.`);
  process.exit(1);
}

// Create the remote folder
fs.mkdirSync(remotePath);

// Create index.js with function export
const indexContent = `function ${capitalizedName}() {
  return "Hello from ${capitalizedName}";
}

export default ${capitalizedName};
`;

fs.writeFileSync(path.join(remotePath, "index.js"), indexContent);

// Run npm init -y
try {
  execSync("npm init -y", { cwd: remotePath, stdio: "inherit" });
  console.log(`✅ npm init completed in ${remoteName}`);
} catch (err) {
  console.error("❌ Failed to run npm init:", err.message);
  process.exit(1);
}

console.log(`✅ Remote "${remoteName}" created at ${remotePath}`);
console.log(`📄 index.js created with default export: ${capitalizedName}()`);
