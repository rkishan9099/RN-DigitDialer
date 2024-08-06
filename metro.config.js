const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
const resolveFrom = require('resolve-from');

const config = getDefaultConfig(__dirname);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    moduleName.startsWith('event-target-shim') &&
    context.originModulePath.includes('react-native-webrtc')
) {
    const updatedModuleName = moduleName.endsWith('/index')
        ? moduleName.replace('/index', '')
        : moduleName;

    const eventTargetShimPath = resolveFrom(context.originModulePath, updatedModuleName);

    return {
        filePath: eventTargetShimPath,
        type: 'sourceFile',
    };
}

  // Use default resolver for other modules
  return require('metro-resolver').resolve(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: './global.css' });
