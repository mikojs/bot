// @flow

/* eslint-disable flowtype/require-parameter-type */

module.exports = {
  configsEnv: ['server'],
  babel: {
    config: config => ({
      ...config,
      plugins: [
        ...config.plugins,
        [
          'transform-imports',
          {
            fbjs: {
              transform: 'fbjs/lib/${member}',
            },
          },
        ],
      ],
    }),
  },
  server: {
    run: argv => [
      ...argv.filter(arg => !['src', '-d', 'lib'].includes(arg)),
      './src/server.js',
      '-o',
      './lib/server.js',
    ],
  },
};
