export type Event<T extends string, P> = {
  type: T;
  payload: P;
};

export type DomainContext = {
  dispatch: (event: Event<string, unknown>) => void;
};
