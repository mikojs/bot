// @flow

const firebase = jest.requireActual('@firebase/testing');
let idIndex: number = 1;

/**
 * @example
 * fireStore()
 *
 * @return {object} - mock firestore
 */
const firestore = (): {} => {
  const db = firebase
    .initializeTestApp({
      projectId: 'bot',
    })
    .firestore();

  return {
    ...db,
    collection: (collectionName: string): {} => {
      const ref = db.collection(collectionName);

      ref.add = (data: {}): {} => {
        const id = `id${idIndex}`;

        ref.doc(id).set(data);
        idIndex += 1;

        return {
          ...data,
          id,
        };
      };

      return ref;
    },
  };
};

firestore.FieldValue = {
  serverTimestamp: () => new Date().getTime(),
};

export default {
  initializeApp: () => {},
  credential: {
    cert: () => {},
  },
  firestore,
};
