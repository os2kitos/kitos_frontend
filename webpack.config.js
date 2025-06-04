module.exports = {
  cache: {
    type: "filesystem", // Enables persistent caching
    buildDependencies: {
      config: [__filename], // Auto invalidation when config changes
    },
  },
};
