/**
* Metro configuration for React Native
* https://github.com/facebook/react-native
*
* @format
*/

module.exports = {
    resolver: {
        assetExts: ['obj', 'mtl', 'ttf', 'jpeg', 'png', 'jpg', 'stl'],
    },
    transformer: {
        getTransformOptions: async () => ({
            transform: {
                experimentalImportSupport: false,
                inlineRequires: false,
            },
        }),
    },
};