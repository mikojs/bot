/**
 * fixme-flow-file-annotation
 *
 * TODO: Flow not support @babel/plugin-proposal-pipeline-operator
 * https://github.com/facebook/flow/issues/5443
 */
/* eslint-disable flowtype/no-types-missing-file-annotation, flowtype/require-valid-file-annotation */

import { emptyFunction } from 'fbjs';
import { type Context as koaContextType } from 'koa';

import server, {
  // $FlowFixMe TODO: remove after upgrading to new version of @cat-org/server
  type contextType,
} from '@cat-org/server';

/**
 * @example
 * server(context)
 *
 * @param {contextType} context - context from @cat-org/server
 *
 * @return {object} - http server
 */
export default ({ dir, dev, watch, port }: contextType) =>
  server.init()
  |> (undefined
    |> server.start
    |> ('*'
      |> server.get
      |> server.use(async (ctx: koaContextType, next: () => Promise<void>) => {
        ctx.body = 'todo bot';
        await next();
      })
      |> server.end)
    |> server.end)
  |> server.run(port)
  |> (dev && watch ? server.watch(dir, []) : emptyFunction.thatReturnsArgument);