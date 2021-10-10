import { useState, useEffect } from 'react';

export const useWholeList = <Item>(callback: () => Promise<Item[]>) => {
  const [list, setList] = useState<Item[]>([]);

  useEffect(() => {
    (async () => {
      const result = await callback();
      setList(result);
    })();
  }, [callback]);

  return list;
};
