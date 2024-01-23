import './types';

/**
 * @template T
 * @param {Result<T>} result
 * @returns {T}
 * @throws {Error} if error is not null
 */
export function unwrapResult(result) {
  if (!result.response || result.error) {
    if (result.error) throw new Error(result.error);
    else throw new Error('Unknown error occurred');
  }
  return result.response;
}

/**
 * @param {any} value
 * @param {string} type
 * @param {string | null} name
 * @returns {boolean}
 */
export function assertType(value, type, name = null) {
  const showName = `${name} to be`;

  if (typeof value !== type) {
      throw new Error(`Expected ${name ? showName : ""} ${type} but got ${typeof value}`);
  }
  return true;
}
