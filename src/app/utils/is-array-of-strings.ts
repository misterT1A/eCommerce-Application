export function isArrayOfStrings(arr: unknown[]) {
  if (arr.length === 0) {
    return true;
  }
  return arr.every((it) => typeof it === 'string');
}

export function assertsArrayOfStrings(value: unknown[]): asserts value is string[] {
  if (!isArrayOfStrings(value)) {
    throw new Error('Waiting for array of strings');
  }
}
