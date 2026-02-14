module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            '@components': './src/components',
            '@lib': './src/lib',
            '@constants': './src/constants',
            '@assets': './assets',
          },
        },
      ],
    ],
  };
};
