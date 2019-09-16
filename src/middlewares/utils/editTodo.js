// @flow

import { type Response as koaResponseType } from 'koa';

import db from 'utils/db';

/**
 * @example
 * editTodo('user-id', 'message')
 *
 * @param {string} userID - user id
 * @param {string} messageID - meesage id
 * @param {string} message - new message
 *
 * @return {object} - slack message object
 */
export default async (
  userID: string,
  messageID: string,
  message: string,
): Promise<$PropertyType<koaResponseType, 'body'>> => {
  db.collection('todo')
    .doc(messageID)
    .update({
      message,
    });

  return {
    text: `:cat: Edit *${messageID}*, new message: ${message}`,
  };
};
