function calculateOriginatingFeePercentage(amount) {
  // depending on the size of collateral.
  // hardcoded for cc/stable pairs
  if (amount <= 200) return 5;
  if (amount >= 6000) return 0.5;
  return 92.57 * Math.pow(amount, -0.6106);
}

function calcBorrowedWithInterest(borrowed, moInterestRate, months) {
    // moInterestRate is the monthly interest rate in percent (e.g., 5 for 5%)
    return borrowed * Math.pow(1 + moInterestRate / 100, months);
}

function borrow(opts) {
    const borrowedFunds = opts.inv * opts.ltv
    if (opts.iterations) {
        return [
            {
                collateral: opts.inv,
                borrowed: borrowedFunds,
                borrowedWithInterest: calcBorrowedWithInterest(borrowedFunds, opts.moInterestRate, opts.months),
                originatingFee: opts.inv / 100 * calculateOriginatingFeePercentage(opts.inv), // doesn't incur interest rate
            },
            ...(borrow({
                ...opts,
                iterations: opts.iterations - 1,
                inv: borrowedFunds,
            }) || [])
        ]
    }
    return []
}

function applyPriceMovement(loans, priceMovement) {
    return loans.map(loan => ({...loan, newVal: loan.borrowed + loan.borrowed * priceMovement, newCollateral: loan.collateral + loan.collateral * priceMovement}))
}

function subtractTxFee(amount) {
  return amount - amount / 100 * 1.5
}
function returnLoans(loans) {
    const reversedLoans = [...loans].reverse()
    return reversedLoans.reduce((res, cur) => {
        console.log(`Returning loan #${loans.indexOf(cur)}. Cash on hands: ${res.cashOnHands}, borrowed: ${cur.borrowed}, collateral: ${cur.newCollateral}`)
        res.cashOnHands = res.cashOnHands - cur.originatingFee - cur.borrowedWithInterest + subtractTxFee(cur.newCollateral)
        return res
    }, { cashOnHands: reversedLoans[0].newVal })
}

var opts = {
    inv: 10000,
    ltv: 0.5,
    iterations: 4,
    // iterations: 1,
    percRet: 0.2, // 0.2 is 20% upside price movement
    moInterestRate: 1.5, // 1.5 is 1.5% monthly interest rate
    months: 3,
}
console.table(opts)
var loans = borrow(opts)
var loansWithPriceMovement = applyPriceMovement(loans, opts.percRet)
console.table(loansWithPriceMovement)
var loansReturned = returnLoans(loansWithPriceMovement)
console.log(loansReturned)

