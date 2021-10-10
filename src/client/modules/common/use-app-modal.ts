import { useCallback, useState } from 'react';

export function useAppModal<Context>(): [
  (context?: Context) => void,
  () => void,
  boolean,
  Context | undefined,
  number
] {
  const [loadingKey, setLoadingKey] = useState(0);
  const [modalOpened, setModalOpened] = useState(false);
  const [modalContext, setModalContext] = useState<Context | undefined>(
    undefined
  );

  const open = useCallback((context?: Context) => {
    setModalOpened(true);
    setModalContext(context);
  }, []);

  const close = useCallback(() => {
    setModalOpened(false);
    setModalContext(undefined);
    setLoadingKey((state) => ++state);
  }, []);

  return [open, close, modalOpened, modalContext, loadingKey];
}
