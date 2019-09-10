// @flow

import path from 'path';

import fetch, { type Response as ResponseType } from 'node-fetch';
import typeof koaType from 'koa';

import server from '../server';

jest.mock('@cat-org/server', () => ({
  ...jest.requireActual('@cat-org/server'),
  watch: () => (koa: koaType) => koa,
}));

let runningServer: http$Server;

describe('server', () => {
  beforeAll(async () => {
    runningServer = await server({
      src: path.resolve(__dirname, '..'),
      dir: path.resolve(__dirname, '..'),
    });
  });

  test('work', async () => {
    expect(
      await fetch('http://localhost:8000').then((res: ResponseType) =>
        res.text(),
      ),
    ).toBe('todo bot');
  });

  test('test watch mode', async () => {
    (await server({
      src: path.resolve(__dirname, '..'),
      dir: path.resolve(__dirname, '..'),
      dev: true,
      watch: true,
      port: 8001,
    })).close();
  });

  afterAll(() => {
    runningServer.close();
  });
});
