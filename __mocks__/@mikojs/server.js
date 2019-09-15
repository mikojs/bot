// @flow

import typeof koaType from 'koa';

const server = jest.requireActual('@mikojs/server');

export default {
  ...server,
  watch: () => (koa: koaType) => koa,
};
