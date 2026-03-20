const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname, { isCSSEnabled: true });

config.resolver.assetExts.push('wasm');
config.resolver.assetExts.push("riv");

// Add path aliases
config.resolver.extraNodeModules = {
  '@physics': path.resolve(__dirname, 'src/engine'),
  '@game': path.resolve(__dirname, 'src/game'),
  '@components': path.resolve(__dirname, 'src/components'),
  '@hooks': path.resolve(__dirname, 'src/hooks'),
};

// Watch for changes in alias directories
config.watchFolders = [
  path.resolve(__dirname, 'src/engine'),
  path.resolve(__dirname, 'src/game'),
  path.resolve(__dirname, 'src/components'),
  path.resolve(__dirname, 'src/hooks'),
];

config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

module.exports = config;