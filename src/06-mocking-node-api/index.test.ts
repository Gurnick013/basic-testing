// Uncomment the code below and write your tests
import fs from 'fs';
import path from 'path';
import { doStuffByInterval, doStuffByTimeout, readFileAsynchronously } from '.';

const callback = jest.fn();

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const timeOut = jest.spyOn(global, 'setTimeout');
    doStuffByTimeout(callback, 1000);
    jest.runOnlyPendingTimers();
    expect(timeOut).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('should call callback only after timeout', () => {
    doStuffByTimeout(callback, 1000);
    jest.advanceTimersByTime(500);
    expect(callback).not.toBeCalled();
    jest.advanceTimersByTime(501);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const interval = jest.spyOn(global, 'setInterval');
    doStuffByTimeout(callback, 1000);
    jest.runOnlyPendingTimers();
    expect(interval).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const interval = jest.spyOn(global, 'setInterval');
    doStuffByInterval(callback, 1000);
    jest.runOnlyPendingTimers();
    jest.runOnlyPendingTimers();
    jest.runOnlyPendingTimers();
    jest.runOnlyPendingTimers();
    jest.runOnlyPendingTimers();
    expect(interval).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledTimes(5);
  });
});

describe('readFileAsynchronously', () => {
  const fileName = 'random.txt';
  test('should call join with pathToFile', async () => {
    const join = jest.spyOn(path, 'join');
    await readFileAsynchronously(fileName);
    expect(join).toBeCalled();
  });

  test('should return null if file does not exist', async () => {
    jest.spyOn(fs, 'existsSync').mockImplementationOnce(() => false);
    const result = await readFileAsynchronously(fileName);
    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    jest.spyOn(fs, 'existsSync').mockImplementationOnce(() => true);
    jest
      .spyOn(fs.promises, 'readFile')
      .mockImplementationOnce(() => Promise.resolve(Buffer.from('content')));
    const result = await readFileAsynchronously(fileName);
    expect(result).toBe('content');
  });
});
