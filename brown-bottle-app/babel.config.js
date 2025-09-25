module.exports = function (api) {
  api.cache(true); // Caches the result of the configuration function

  return {
    presets: ["babel-preset-expo"], // The default preset for Expo projects
    plugins: ["react-native-worklets/plugin"],
  };
};
