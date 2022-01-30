import { Logger } from '../../../shared/logger';

export const withEllapsedTime =
  <R, T extends unknown[] = []>(
    callback: (...params: [...T]) => R,
    name = 'Process',
    disable = false
  ) =>
  (...params: [...T]): R => {
    const start = Date.now();

    const result = callback(...params);

    if (!disable) Logger.debug(`${name} took ${Date.now() - start} ms`);
    return result;
  };

export const withAwaitedEllapsedTime =
  <R, T extends unknown[] = []>(
    callback: (...params: [...T]) => Promise<R>,
    name = 'Process',
    disable = false
  ) =>
  async (...params: [...T]): Promise<R> => {
    const start = Date.now();

    const result = await callback(...params);

    if (!disable) Logger.debug(`${name} took ${Date.now() - start} ms`);
    return result;
  };
