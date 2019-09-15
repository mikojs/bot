// @flow

import path from 'path';

import fetch, { type Response as ResponseType } from 'node-fetch';
import getPort from 'get-port';

import server from '../server';

describe('server', () => {
  test('work', async () => {
    const runningServer = await server({
      src: path.resolve(__dirname, '..'),
      dir: path.resolve(__dirname, '..'),
    });

    expect(
      await fetch('http://localhost:8000').then((res: ResponseType) =>
        res.text(),
      ),
    ).toBe('todo bot');

    runningServer.close();
  });

  test('test watch mode', async () => {
    (await server({
      src: path.resolve(__dirname, '..'),
      dir: path.resolve(__dirname, '..'),
      dev: true,
      watch: true,
      port: await getPort(),
    })).close();
  });
});
