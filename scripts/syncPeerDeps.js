const fs = require("fs");
const path = require("path");

// CONFIGURE THIS IF YOU HAVE MULTIPLE REMOTES
const remotesDir = path.resolve(__dirname, "../remotes");
const remotes = fs
  .readdirSync(remotesDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);
const hostPkgPath = path.resolve(__dirname, "../package.json"); // host package.json

function syncPeerDependencies() {
  const hostPkg = JSON.parse(fs.readFileSync(hostPkgPath, "utf-8"));
  const mfSharedList = hostPkg.mfShared || [];
  const hostDeps = hostPkg.dependencies || {};

  if (!mfSharedList.length) {
    console.log("❌ No mfShared field found in host package.json.");
    return;
  }

  remotes.forEach((remoteName) => {
    const remotePath = path.resolve(
      __dirname,
      `../remotes/${remoteName}/package.json`
    );
    const remotePkg = JSON.parse(fs.readFileSync(remotePath, "utf-8"));

    remotePkg.peerDependencies = remotePkg.peerDependencies || {};
    remotePkg.devDependencies = remotePkg.devDependencies || {};

    mfSharedList.forEach((pkg) => {
      const version = hostDeps[pkg];
      if (!version) {
        console.warn(`⚠️ Host does not list "${pkg}" in dependencies.`);
        return;
      }

      // Set in peerDependencies
      remotePkg.peerDependencies[pkg] = version;

      // Ensure it's available for dev (for local testing)
      if (!remotePkg.devDependencies[pkg]) {
        remotePkg.devDependencies[pkg] = version;
      }
    });

    // Write back the updated package.json
    fs.writeFileSync(remotePath, JSON.stringify(remotePkg, null, 2));
    console.log(`✅ Synced peerDependencies for ${remoteName}`);
  });
}

syncPeerDependencies();
