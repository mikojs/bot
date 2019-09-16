#! /usr/bin/env node
// @flow

import fs from 'fs';
import path from 'path';

fs.writeFileSync(
  path.resolve('key.json'),
  JSON.stringify(
    [
      'type',
      'project_id',
      'private_key_id',
      'private_key',
      'client_email',
      'client_id',
      'auth_uri',
      'token_uri',
      'auth_provider_x509_cert_url',
      'client_x509_cert_url',
    ].reduce(
      (result: {}, key: string) => ({
        ...result,
        // $FlowFixMe TODO: Flow does not yet support method or property calls in optional chains.
        [key]: process.env[key]?.replace(/\\n/g, '\n'),
      }),
      {},
    ),
    null,
    2,
  ),
  'utf8',
);
