// craco.config.js
module.exports = {
    webpack: {
      configure: (webpackConfig) => {
        webpackConfig.resolve = {
          ...webpackConfig.resolve,
          fallback: {
            "os": require.resolve("os-browserify/browser"),
            "fs": false,
            "path": require.resolve("path-browserify"),
            "querystring": require.resolve("querystring-es3"),
            "http": require.resolve("stream-http"),
            "net": require.resolve("net-browserify"),
            "zlib": require.resolve("browserify-zlib"),
            "url": require.resolve("url/"),
            "buffer": require.resolve("buffer/"),
            "crypto": require.resolve("crypto-browserify"),
            "stream": require.resolve("stream-browserify"),
            "util": require.resolve("util/"),
            "assert": require.resolve("assert/"),
            "vm": require.resolve("vm-browserify"),
            "async_hooks": false // or remove if not needed
          }
        };
        return webpackConfig;
      }
    }
  };
  