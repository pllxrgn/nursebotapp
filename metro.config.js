const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname, {
  // Ensure proper module resolution
  resolver: {
    sourceExts: ['js', 'jsx', 'ts', 'tsx', 'json', 'd.ts'],
  },
});

module.exports = withNativeWind(config, { input: './app/globals.css' });