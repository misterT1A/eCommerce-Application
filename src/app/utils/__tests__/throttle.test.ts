import throttle from '@utils/throttle';

jest.useFakeTimers();

describe('throttle', () => {
  let callee = jest.fn();

  beforeEach(() => {
    callee = jest.fn();
  });

  it('should call the callee function after the specified timeout', () => {
    const throttledFunction = throttle(callee, 1000);

    throttledFunction();
    expect(callee).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1000);
    expect(callee).toHaveBeenCalled();
  });

  it('should not call the callee function if called again within the timeout period', () => {
    const throttledFunction = throttle(callee, 1000);

    throttledFunction();
    throttledFunction();
    expect(callee).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1000);
    expect(callee).toHaveBeenCalledTimes(1);
  });

  it('should call the callee function again after the timeout period has passed', () => {
    const throttledFunction = throttle(callee, 1000);

    throttledFunction();
    jest.advanceTimersByTime(1000);
    expect(callee).toHaveBeenCalledTimes(1);

    throttledFunction();
    jest.advanceTimersByTime(1000);
    expect(callee).toHaveBeenCalledTimes(2);
  });

  it('should call the callee function with the correct arguments', () => {
    const throttledFunction = throttle(callee, 1000);
    const args = [1, 2, 3];

    throttledFunction(...args);
    jest.advanceTimersByTime(1000);
    expect(callee).toHaveBeenCalledWith(...args);
  });
});
