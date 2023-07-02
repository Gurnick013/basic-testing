// Uncomment the code below and write your tests
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import path from 'path';
import { doStuffByInterval, doStuffByTimeout, readFileAsynchronously } from '.';

jest.mock('fs/promises');
jest.mock('fs');

const existsSyncMock = jest.mocked(existsSync);
const readFileMock = jest.mocked(readFile);

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const callbackFunc = jest.fn();
    jest.spyOn(global, 'setTimeout');
    doStuffByTimeout(callbackFunc, 1000);
    jest.runOnlyPendingTimers();
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(callbackFunc).toHaveBeenCalledTimes(1);
  });

  test('should call callback only after timeout', () => {
    const callbackFunc = jest.fn();
    doStuffByTimeout(callbackFunc, 1000);
    jest.advanceTimersByTime(500);
    expect(callbackFunc).not.toBeCalled();
    jest.advanceTimersByTime(501);
    expect(callbackFunc).toHaveBeenCalledTimes(1);
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
    const callbackFunc = jest.fn();
    jest.spyOn(global, 'setInterval');
    doStuffByInterval(callbackFunc, 100);
    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(setInterval).toHaveBeenLastCalledWith(callbackFunc, 100);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callbackFunc = jest.fn();
    jest.spyOn(global, 'setInterval');
    doStuffByInterval(callbackFunc, 1000);
    jest.runOnlyPendingTimers();
    jest.runOnlyPendingTimers();
    jest.runOnlyPendingTimers();
    jest.runOnlyPendingTimers();
    jest.runOnlyPendingTimers();
    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(callbackFunc).toHaveBeenCalledTimes(5);
  });
});

describe('readFileAsynchronously', () => {
  const fileName = 'random.txt';
  test('should call join with pathToFile', async () => {
    const join = jest.spyOn(path, 'join');
    await readFileAsynchronously(fileName);
    expect(join).toHaveBeenCalledWith(__dirname, fileName);
  });

  test('should return null if file does not exist', async () => {
    existsSyncMock.mockImplementationOnce(() => false);
    const result = await readFileAsynchronously(fileName);
    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    existsSyncMock.mockImplementationOnce(() => true);
    readFileMock.mockImplementationOnce(() => Promise.resolve(Buffer.from('content')));
    const result = await readFileAsynchronously(fileName);
    expect(result).toBe('content');
  });
});
