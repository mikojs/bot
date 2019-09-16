// @flow

import { type Response as koaResponseType } from 'koa';
import admin from 'firebase-admin';

import db from 'utils/db';

/**
 * @example
 * addNewTodo('user-id', 'message')
 *
 * @param {string} userID - user id
 * @param {string} message - new todo message
 *
 * @return {object} - slack message object
 */
export default async (
  userID: string,
  message: string,
): Promise<$PropertyType<koaResponseType, 'body'>> => {
  const ref = await db.collection('todo').add({
    message,
    userID,
    complete: false,
    created: admin.firestore.FieldValue.serverTimestamp(),
  });

  return {
    text: `:heart_eyes_cat: New TODO:\n*${ref.id}* ${message}`,
  };
};
