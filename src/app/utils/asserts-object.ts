type ObjectType = Record<string, unknown>;

function isObject(object: unknown): boolean {
  return (
    typeof object === 'object' && object !== null && !Array.isArray(object) && object.constructor.name === 'Object'
  );
}

/**
 * Checks if an object matches a given template type.
 *
 * @template T - The template type
 * @param {unknown} object - The object to check
 * @param {T} template - The template object
 * @returns {boolean} - True if the object matches the template, false otherwise
 */
export function isTypeOf<T extends ObjectType>(object: unknown, template: T): boolean {
  if (!isObject(object)) {
    return false;
  }
  return Object.entries(object as ObjectType).every(([key, value]) => {
    if (!(key in template)) {
      return false;
    }
    if (typeof value !== typeof template[key]) {
      return false;
    }
    return true;
  });
}

/**
 * Asserts that an object matches a given template type.
 *
 * @template T - The template type
 * @param {unknown} object - The object to assert
 * @param {T} template - The template object
 * @throws {Error} - Throws an error if the object does not match the template
 */
export function assertsObjectIsTypeOf<T extends ObjectType>(object: unknown, template: T): asserts object is T {
  if (!isTypeOf(object, template)) {
    throw new Error('Invalid data shape!');
  }
}
