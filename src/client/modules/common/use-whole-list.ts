import notification from 'antd/lib/notification';
import { useState, useEffect } from 'react';

import { Logger } from '../../../shared/logger';

export const useWholeList = <Item>(callback: () => Promise<Item[]>) => {
  const [list, setList] = useState<Item[]>([]);

  useEffect(() => {
    try {
      (async () => {
        const result = await callback();
        setList(result);
      })();
    } catch (e) {
      notification.error({
        message: 'Chyba při načítání dat',
      });
      Logger.error(`Error fetching whole list.`, e);
    }
  }, [callback]);

  return list;
};
