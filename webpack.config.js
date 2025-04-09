const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // Configuración de fallbacks para módulos de Node.js
  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    string_decoder: require.resolve('string_decoder'),
    buffer: require.resolve('buffer/'),
    vm: false,
  };

  // 🔥 Añade este alias para resolver react-native-vector-icons
  config.resolve.alias = {
    ...config.resolve.alias,
    'react-native-vector-icons': '@expo/vector-icons',
  };

  return config;
};