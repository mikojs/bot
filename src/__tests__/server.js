// @flow

import path from 'path';

import getPort from 'get-port';

import server from '../server';

test('test watch mode', async () => {
  (await server({
    src: path.resolve(__dirname, '..'),
    dir: path.resolve(__dirname, '..'),
    dev: true,
    watch: true,
    port: await getPort(),
  })).close();
});
