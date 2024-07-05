/**
 * Creates a debounced version of the provided function that delays the invocation until after the specified delay has passed.
 *
 * @example
 * const debouncedFunction = debounce(() => {
 *   console.log('Debounced!');
 * }, 300);
 *
 * window.addEventListener('resize', debouncedFunction);
 */
const debounce = <F extends (...args: Parameters<F>) => ReturnType<F>>(f: F, delay: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<F>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => f(...args), delay);
  };
};

export default debounce;
