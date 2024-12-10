/**
 *
 * @param input
 * @returns
 */
export function removeUndefinedProps<T>(input: T): Partial<T> {
  for (const propName in input) {
    if (input[propName] === undefined) {
      delete input[propName];
    }
  }
  return input;
}
