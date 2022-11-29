export function calculateLoanRepaymentValue(params: LoanParameters): number {
  const { principal, monthlyRate, months } = params;

  if (principal <= 0) return 0;
  if (months <= 0) return 0;
  if (monthlyRate <= 0) return principal;

  const percentageRate = monthlyRate / 100;
  const equatedMonthlyInstallment =
    principal *
    ((percentageRate * Math.pow(1 + percentageRate, months)) /
      (Math.pow(1 + percentageRate, months) - 1));

  let principalAtStart = principal;
  let principalAtEnd = principal;
  let totalInterest = 0;

  while (principalAtStart > 0) {
    let interestOnOutstandingPrincipal = percentageRate * principalAtStart;
    totalInterest += interestOnOutstandingPrincipal;
    let principalRepayment =
      equatedMonthlyInstallment - interestOnOutstandingPrincipal;
    principalAtEnd = principalAtStart - principalRepayment;
    principalAtStart = principalAtEnd;
  }
  const totalRepaymentValue = principal + totalInterest;
  return totalRepaymentValue;
}

export interface LoanParameters {
  principal: number;
  monthlyRate: number;
  months: number;
}
