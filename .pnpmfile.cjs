const readPackage = (pkg) => {
  // List of dependency fields to check
  const dependencyFields = [
    "dependencies",
    "devDependencies",
    "peerDependencies",
    "optionalDependencies",
  ];

  // Remove rollup and esbuild dependencies from each field
  for (const field of dependencyFields) {
    if (pkg[field]) {
      const keysToRemove = Object.keys(pkg[field]).filter((key) => {
        // Exclude @rollup/pluginutils from removal
        if (key === "@rollup/pluginutils") {
          return false;
        }
        const lowerKey = key.toLowerCase();
        return lowerKey.includes("rollup");
      });

      for (const key of keysToRemove) {
        delete pkg[field][key];
        // Context.log(`Removed ${key} from ${field} in ${pkg.name || "package"}`);
      }

      // Remove the field if it's empty
      const fieldKeys = Object.keys(pkg[field]);
      // oxlint-disable-next-line no-magic-numbers
      if (fieldKeys.length === 0) {
        delete pkg[field];
      }
    }
  }

  return pkg;
};

// oxlint-disable-next-line no-commonjs it only can be commonjs
module.exports = {
  hooks: {
    readPackage,
  },
};
