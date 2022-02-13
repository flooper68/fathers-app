export class UndefinedAssertionError extends Error {}

export const assertExistence = <Value>(
  value: Value | undefined | null
): Value => {
  if (value === undefined || value === null) {
    throw new UndefinedAssertionError();
  }

  return value;
};

export const assertType =
  <P, T extends P>(guard: (value: P) => value is T) =>
  (value: P) => {
    if (!guard(value)) {
      throw new Error(`Assertion failed, value is of unknown type`);
    }
    return value;
  };
