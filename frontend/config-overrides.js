// {
//     resolve: {
//       modules: [...],
//       fallback: {
//         "fs": false,
//         "tls": false,
//         "net": false,
//         "path": false,
//         "zlib": false,
//         "http": false,
//         "https": false,
//         "stream": false,
//         "crypto": false,
//         "crypto-browserify": require.resolve('crypto-browserify'), //if you want to use this module also don't forget npm i crypto-browserify 
//       } 
//     },
//     entry: [...],
//     output: {...},
//     module: {
//       rules: [...]
//     },
//     plugins: [...],
//     optimization: {
//       minimizer: [...],
//     },
//     // node: {
//     //   fs: 'empty',
//     //   net: 'empty',
//     //   tls: 'empty'
//     // },
// }

// const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

// module.exports = {
//     // Other rules...
//     plugins: [
//         new NodePolyfillPlugin()
//     ]
// }

const webpack = require('webpack');

module.exports = function override(config) {
    const fallback = config.resolve.fallback || {};
    Object.assign(fallback, {
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "assert": require.resolve("assert"),
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "os": require.resolve("os-browserify"),
        "url": require.resolve("url")
    })
    config.resolve.fallback = fallback;
    config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer']
        })
    ])
    return config;
}

