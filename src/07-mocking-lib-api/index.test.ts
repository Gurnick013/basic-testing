// Uncomment the code below and write your tests
import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');
const axiosMock = jest.mocked(axios);
const path = '/users';

describe('throttledGetDataFromApi', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should create instance with provided base url', async () => {
    const getMockData = jest.fn(() => ({ data: 'test' }));
    axiosMock.create.mockReturnValue({ get: getMockData } as never);
    await throttledGetDataFromApi(path);
    jest.runOnlyPendingTimers();
    expect(axiosMock.create).toBeCalledWith(
      expect.objectContaining({
        baseURL: 'https://jsonplaceholder.typicode.com',
      }),
    );
  });

  test('should perform request to correct provided url', async () => {
    const getMockData = jest.fn(async () => ({ data: 'any' }));
    axiosMock.create.mockReturnValue({ get: getMockData } as never);
    jest.runOnlyPendingTimers();
    await throttledGetDataFromApi(path);
    expect(getMockData).toBeCalledWith(path);
  });

  test('should return response data', async () => {
    const getMock = jest.fn(async () => ({ data: 'test' }));
    axiosMock.create.mockReturnValue({ get: getMock } as never);
    jest.runOnlyPendingTimers();
    await expect(throttledGetDataFromApi(path)).resolves.toBe('test');
  });
});
