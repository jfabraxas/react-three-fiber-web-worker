module.exports = {
  webpack: (config, { dev }) => {
    if (dev) {
      config.optimization.splitChunks = false;
    }
    return config;
  }
};
