/**
 * fixme-flow-file-annotation
 *
 * TODO: Flow not support @babel/plugin-proposal-pipeline-operator
 * https://github.com/facebook/flow/issues/5443
 */
/* eslint-disable flowtype/no-types-missing-file-annotation, flowtype/require-valid-file-annotation */

import { emptyFunction } from 'fbjs';

import server, { type contextType } from '@mikojs/server';
import base from '@mikojs/koa-base';

import todo from './middlewares/todo';

/**
 * @example
 * server(context)
 *
 * @param {contextType} context - context from @mikojs/server
 *
 * @return {object} - http server
 */
export default ({ dir, dev, watch, port }: contextType) =>
  server.init()
  |> server.use(base)
  |> ('/slack'
    |> server.start
    |> ('/todo' |> server.post |> server.use(todo) |> server.end)
    |> server.end)
  |> server.run(port)
  |> (dev && watch ? server.watch(dir, []) : emptyFunction.thatReturnsArgument);
