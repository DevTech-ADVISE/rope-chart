var ordinal = require('ordinal').english

var NumberRank = function(value, unsortedValues, ascending) {
  var sortedValues = unsortedValues.sort(function(a, b) { return b - a})
  if(ascending) sortedValues.reverse()

  var indexOfValue = sortedValues.indexOf(value)
  var rankArray = []
  for(var i = 0; i < sortedValues.length; i ++) {
    if(sortedValues[i-1]) {
      // If the previous value equals the current value, the current value is tied/set to the same rank as the previous value
      if(sortedValues[i-1] === sortedValues[i]) {
        rankArray.push(rankArray[i-1])
      }
      else {
        rankArray.push(i+1)
      }
    }
    else { // Start with rank 1 for the first element
      rankArray.push(1)
    }
    // If the rank array has gone far enough to rank the selected value then break out and return the rank
    if(rankArray.length == indexOfValue + 1) {
      console.log(rankArray)
      return ordinal(rankArray[indexOfValue])
    }
  }
}

module.exports = NumberRank
