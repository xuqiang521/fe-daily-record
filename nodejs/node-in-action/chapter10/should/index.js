exports.addPercentageToEach = function (prices, percentage) {
  return prices.map(total => {
    total = parseFloat(total);
    return total + (total * percentage)
  })
}

exports.sum = function (prices) {
  return prices.reduce((currentSum, currentValue) => {
    return parseFloat(currentSum) + parseFloat(currentValue)
  })
}

exports.percentFormat = function (percentage) {
  return parseFloat(percentage) * 100 + '%'
}

exports.dollarFormat = function (number) {
  return '$' + parseFloat(number).toFixed(2);
}