// Uncomment the code below and write your tests
import { simpleCalculator, Action } from './index';

describe('simpleCalculator tests', () => {
  test('should add two numbers', () => {
    const input = {
      a: 1,
      b: 2,
      action: Action.Add,
    };
    expect(simpleCalculator({ ...input })).toBe(3);
  });

  test('should subtract two numbers', () => {
    const input = {
      a: 3,
      b: 2,
      action: Action.Subtract,
    };
    expect(simpleCalculator({ ...input })).toBe(1);
  });

  test('should multiply two numbers', () => {
    const input = {
      a: 1,
      b: 5,
      action: Action.Multiply,
    };
    expect(simpleCalculator({ ...input })).toBe(5);
  });

  test('should divide two numbers', () => {
    const input = {
      a: 2,
      b: 2,
      action: Action.Divide,
    };
    expect(simpleCalculator({ ...input })).toBe(1);
  });

  test('should exponentiate two numbers', () => {
    const input = {
      a: 2,
      b: 2,
      action: Action.Exponentiate,
    };
    expect(simpleCalculator({ ...input })).toBe(4);
  });

  test('should return null for invalid action', () => {
    const input = {
      a: 2,
      b: 2,
      action: '--',
    };
    expect(simpleCalculator({ ...input })).toBeNull();
  });

  test('should return null for invalid arguments', () => {
    const input = {
      a: '1',
      b: '2',
      action: Action.Add,
    };
    expect(simpleCalculator({ ...input })).toBeNull();
  });
});
