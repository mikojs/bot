// @flow

import path from 'path';

import getPort from 'get-port';
import fetch, { type Response as ResponseType } from 'node-fetch';

import server from '../../server';

const userID = 'user-id';
let runningServer: http$Server;
let request: (options?: {}) => Promise<{ text: string }>;

describe('todo', () => {
  beforeAll(async () => {
    const port = await getPort();

    runningServer = await server({
      src: path.resolve(__dirname, '..'),
      dir: path.resolve(__dirname, '..'),
      port,
    });
    request = async (options?: {}) =>
      fetch(`http://localhost:${port}/slack/todo`, {
        ...options,
        method: 'POST',
      }).then((res: ResponseType) => res.json());
  });

  test('command error', async () => {
    expect(await request()).toEqual({
      text: "Sorry, that didn't work. Please try again.",
    });
  });

  test('show help', async () => {
    expect(
      (await request({
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command: '/todo',
          text: 'help',
          user_id: userID,
        }),
      })).text,
    ).toMatch(/You can do this/);
  });

  describe('operate TODO list', () => {
    test('did not add any TODO message', async () => {
      expect(
        await request({
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            command: '/todo',
            text: 'list',
            user_id: userID,
          }),
        }),
      ).toEqual({
        text:
          ':skull_and_crossbones: You did not add any TODO, try to use `/todo add TODO message`',
      });
    });

    test('add a new TODO message', async () => {
      expect(
        await request({
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            command: '/todo',
            text: 'new TODO message',
            user_id: userID,
          }),
        }),
      ).toEqual({
        text: `:heart_eyes_cat: New TODO:
*id1* new TODO message`,
      });
    });

    test('get the new TODO message in the TODO list', async () => {
      expect(
        await request({
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            command: '/todo',
            text: 'list',
            user_id: userID,
          }),
        }),
      ).toEqual({
        text: ':smirk_cat: TODO list:',
        attachments: [
          {
            text: `1) *id1*: new TODO message`,
          },
        ],
      });
    });

    test('add a new TODO message again', async () => {
      expect(
        await request({
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            command: '/todo',
            text: 'new TODO message',
            user_id: userID,
          }),
        }),
      ).toEqual({
        text: `:heart_eyes_cat: New TODO:
*id2* new TODO message`,
      });
    });

    test('get the new TODO message in the TODO list', async () => {
      expect(
        await request({
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            command: '/todo',
            text: 'list',
            user_id: userID,
          }),
        }),
      ).toEqual({
        text: ':smirk_cat: TODO list:',
        attachments: [
          {
            text: `1) *id1*: new TODO message
2) *id2*: new TODO message`,
          },
        ],
      });
    });

    test('complete TODO', async () => {
      expect(
        await request({
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            command: '/todo',
            text: 'complete id1',
            user_id: userID,
          }),
        }),
      ).toEqual({
        text: ':smile_cat: Complete *id1*',
      });
    });

    test('get the new TODO list', async () => {
      expect(
        await request({
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            command: '/todo',
            text: 'list',
            user_id: userID,
          }),
        }),
      ).toEqual({
        text: ':smirk_cat: TODO list:',
        attachments: [
          {
            text: `1) *id2*: new TODO message`,
          },
        ],
      });
    });

    test('edit the TODO', async () => {
      expect(
        await request({
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            command: '/todo',
            text: 'edit id2 edited message',
            user_id: userID,
          }),
        }),
      ).toEqual({
        text: ':cat: Edit *id2*, new message: edited message',
      });
    });

    test('get the new TODO list', async () => {
      expect(
        await request({
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            command: '/todo',
            text: 'list',
            user_id: userID,
          }),
        }),
      ).toEqual({
        text: ':smirk_cat: TODO list:',
        attachments: [
          {
            text: `1) *id2*: edited message`,
          },
        ],
      });
    });
  });

  afterAll(() => {
    runningServer.close();
  });
});
