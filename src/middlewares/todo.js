// @flow

import { type Context as koaContextType } from 'koa';

import findTodoList from './utils/findTodoList';
import completeTodo from './utils/completeTodo';
import addNewTodo from './utils/addNewTodo';
import editTodo from './utils/editTodo';

/**
 * @example
 * normalizeBody(ctx)
 *
 * @param {koaContextType} ctx - koa context
 *
 * @return {object} - normalize body data
 */
const normalizeBody = (
  ctx: koaContextType,
): {|
  userID: string,
  command: string,
  text: string,
|} =>
  ctx.request.body &&
  typeof ctx.request.body.command === 'string' &&
  typeof ctx.request.body.user_id === 'string' &&
  typeof ctx.request.body.text === 'string'
    ? {
        command: ctx.request.body.command,
        userID: ctx.request.body.user_id,
        text: ctx.request.body.text,
      }
    : {
        command: 'not-found',
        userID: '',
        text: '',
      };

/**
 * @example
 * todoMiddleware(ctx)
 *
 * @param {koaContextType} ctx - koa context
 */
export default async (ctx: koaContextType) => {
  const { command, userID, text } = normalizeBody(ctx);

  if (command !== '/todo') {
    ctx.body = {
      text: "Sorry, that didn't work. Please try again.",
    };
    return;
  }

  const [commandType, ...message] = text.split(/ /);

  // TODO: https://github.com/eslint/eslint/issues/11899
  /* eslint-disable require-atomic-updates */
  switch (commandType) {
    case 'list':
      ctx.body = await findTodoList(userID);
      break;

    case 'complete':
    case 'remove':
      ctx.body = await completeTodo(
        userID,
        text.replace(/(complete|remove) /, ''),
      );
      break;

    case 'edit':
      ctx.body = await editTodo(userID, message[0], message.slice(1).join(' '));
      break;

    case 'help':
      ctx.body = {
        text: `You can do this:

- \`list\`: Show the TODO list.
- \`complete\`: Complete the TODO.
- \`remove\`: Remove the TODO.
- \`edit\`: Edit the TODO.

If you do not use any keywork, this will create a new TODO. For example: \`/todo add new TODO\``,
      };
      break;

    default:
      ctx.body = await addNewTodo(userID, text);
      break;
  }
  /* eslint-enable require-atomic-updates */
};
