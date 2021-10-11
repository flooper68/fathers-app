import React from 'react';
import moment from 'moment';

import { APP_VERSION } from '../../shared/version';

export const VersionTag = () => {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 16,
        left: 16,
        fontSize: 12,
        width: 120,
        color: ' #8080807a',
      }}
    >
      Version {APP_VERSION.version} <br />{' '}
      {APP_VERSION.timestamp && moment(APP_VERSION.timestamp).format('LLL')}
    </div>
  );
};
