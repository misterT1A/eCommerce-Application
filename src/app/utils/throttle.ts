function throttle<T extends (...args: Parameters<T>) => void>(
  callee: T,
  timeout: number
): (...args: Parameters<T>) => void {
  let timer: NodeJS.Timeout | null = null;

  return function perform(...args: Parameters<T>) {
    if (timer) {
      return;
    }

    timer = setTimeout(() => {
      callee(...args);

      clearTimeout(timer as NodeJS.Timeout);
      timer = null;
    }, timeout);
  };
}

export default throttle;
