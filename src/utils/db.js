// @flow

import admin from 'firebase-admin';

import serviceAccount from '../../key.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin.firestore();
