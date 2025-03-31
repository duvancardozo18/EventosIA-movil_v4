const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // Add fallbacks for Node.js core modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    string_decoder: require.resolve('string_decoder'),
    buffer: require.resolve('buffer/'),
    vm: false, // Agrega esta línea para el módulo vm
  };

  return config;
};