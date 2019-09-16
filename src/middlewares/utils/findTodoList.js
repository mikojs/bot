// @flow

import { type Response as koaResponseType } from 'koa';

import db from 'utils/db';

/**
 * @example
 * findTodoList('user-id')
 *
 * @param {string} userID - user id
 *
 * @return {object} - slack message object
 */
export default async (
  userID: string,
): Promise<$PropertyType<koaResponseType, 'body'>> => {
  const todoList = [];

  (await db
    .collection('todo')
    .where('userID', '==', userID)
    .where('complete', '==', false)
    .orderBy('created')
    .get()).forEach(
    (doc: {| id: string, data: () => {| message: string |} |}) => {
      const { message } = doc.data();

      todoList.push(`${todoList.length + 1}) *${doc.id}*: ${message}`);
    },
  );

  if (todoList.length === 0)
    return {
      text:
        ':skull_and_crossbones: You did not add any TODO, try to use `/todo add TODO message`',
    };

  return {
    text: ':smirk_cat: TODO list:',
    attachments: [
      {
        text: todoList.join('\n'),
      },
    ],
  };
};
