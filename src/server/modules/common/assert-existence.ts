export class UndefinedAssertionError extends Error {}

export const assertExistence = <Value>(
  value: Value | undefined | null
): Value => {
  if (value === undefined || value === null) {
    throw new UndefinedAssertionError();
  }

  return value;
};
