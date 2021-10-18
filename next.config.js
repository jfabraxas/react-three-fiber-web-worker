const { DefinePlugin } = require('webpack')

module.exports = {
  webpack: (config, { dev }) => {
    if (dev) {
      config.optimization.splitChunks = false
    }
    config.module.rules.push({
      test: new RegExp('@ampproject/worker-dom'),
      use: [
        {
          loader: 'ts-loader',
          options: { transpileOnly: true },
        },
      ],
    })
    config.plugins.push(
      new DefinePlugin({
        WORKER_DOM_DEBUG: false,
      })
    )

    return config
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
}
