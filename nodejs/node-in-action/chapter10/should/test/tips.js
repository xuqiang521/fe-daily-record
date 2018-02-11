var tips = require('..')
var should = require('should')

var tax = 0.12
var tip = 0.15
var prices = [10, 20]
var pricesWithTipAndTax = tips.addPercentageToEach(prices, tip + tax)

pricesWithTipAndTax[0].should.equal(12.7);
pricesWithTipAndTax[1].should.equal(25.4);

var totalAmount = tips.sum(pricesWithTipAndTax).toFixed(2);
totalAmount.should.equal('38.10');

var totalAmountAsCurrency = tips.dollarFormat(totalAmount);
totalAmountAsCurrency.should.equal('$38.10');

var tipAsPercent = tips.percentFormat(tip);
tipAsPercent.should.equal('15%');