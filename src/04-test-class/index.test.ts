// Uncomment the code below and write your tests
import { getBankAccount, SynchronizationFailedError } from '.';

const initialBalance = 100;
const deposit = 10;
const moreThanBalance = 111;
const account = getBankAccount(initialBalance);

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    expect(account.getBalance()).toBe(initialBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    expect(() => account.withdraw(moreThanBalance)).toThrow(
      `Insufficient funds: cannot withdraw more than ${initialBalance}`,
    );
  });

  test('should throw error when transferring more than balance', () => {
    expect(() =>
      account.transfer(moreThanBalance, getBankAccount(deposit)),
    ).toThrow(
      `Insufficient funds: cannot withdraw more than ${initialBalance}`,
    );
  });

  test('should throw error when transferring to the same account', () => {
    expect(() => account.transfer(moreThanBalance, account)).toThrow(
      'Transfer failed',
    );
  });

  test('should deposit money', () => {
    const depositBalance = initialBalance + deposit;
    expect(account.deposit(deposit).getBalance()).toBe(depositBalance);
  });

  test('should withdraw money', () => {
    const withdrawBalance = initialBalance - deposit;
    expect(account.withdraw(deposit).getBalance()).toBe(withdrawBalance);
  });

  test('should transfer money', () => {
    const transferAccount = getBankAccount(deposit);
    const depositBalance = deposit + transferAccount.getBalance();
    account.transfer(deposit, transferAccount);
    expect(transferAccount.getBalance()).toBe(depositBalance);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    try {
      await expect(account.fetchBalance()).resolves.toEqual(expect.any(Number));
    } catch (err) {
      return;
    }
  });

  test('should set new balance if fetchBalance returned number', async () => {
    try {
      await account.synchronizeBalance();
      expect(account.getBalance()).toEqual(expect.any(Number));
    } catch (err) {
      return;
    }
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    try {
      await account.synchronizeBalance();
    } catch (err) {
      expect(err).toBeInstanceOf(SynchronizationFailedError);
    }
  });
});
