import { calculateLoanRepaymentValue, LoanParameters } from './helper';

test('should return zero if months is less than or equal zero', () => {
  const loanParameters: LoanParameters = {
    principal: 1000,
    monthlyRate: 2,
    months: 0,
  };
  const response = calculateLoanRepaymentValue(loanParameters);
  expect(response).toEqual(0);
});

test('should return zero if principal is less than or equal zero', () => {
  const loanParameters: LoanParameters = {
    principal: 0,
    monthlyRate: 2,
    months: 10,
  };
  const response = calculateLoanRepaymentValue(loanParameters);
  expect(response).toEqual(0);
});

test('should return principal if monthly rate is less than or equal zero', () => {
  const loanParameters: LoanParameters = {
    principal: 10000,
    monthlyRate: 0,
    months: 10,
  };
  const response = calculateLoanRepaymentValue(loanParameters);
  expect(response).toEqual(10000);
});

test('should calculate loan value', () => {
  const loanParameters: LoanParameters = {
    principal: 44370.37,
    monthlyRate: 2,
    months: 10,
  };
  const response = calculateLoanRepaymentValue(loanParameters);
  expect(response).toEqual(49395.99232199402);
});
