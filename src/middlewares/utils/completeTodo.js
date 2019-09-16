// @flow

import { type Response as koaResponseType } from 'koa';

import db from 'utils/db';

/**
 * @example
 * completeTodo('user-id', 'message')
 *
 * @param {string} userID - user id
 * @param {string} messageID - meesage id
 *
 * @return {object} - slack message object
 */
export default async (
  userID: string,
  messageID: string,
): Promise<$PropertyType<koaResponseType, 'body'>> => {
  db.collection('todo')
    .doc(messageID)
    .update({
      complete: true,
    });

  return {
    text: `:smile_cat: Complete *${messageID}*`,
  };
};
