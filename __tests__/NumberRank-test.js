jest.unmock('../src/util/NumberRank.js')
var NumberRank = require('../src/util/NumberRank.js')

describe('NumberRank', () => {
  
  describe('Default descending rank, higher number is ranked better', () => {
    let sortAscending = false
    let unsortedValuesTiedFirstAndLast = [1, 20, 7, 2, 2, 18, 15, 1, 15, 20]
      // How the sorted values should look [20, 20, 18, 15, 15, 7, 2, 2, 1, 1]
      // How the rank array should look [1, 1, 3, 4, 4, 6, 7, 7, 9, 9]
    let unsortedValuesNONTiedFirstAndLast = [1, 20, 7, 2, 2, 18, 15, 15]
      // How the sorted values should look [20, 18, 15, 15, 7, 2, 2, 1]
      // How the rank array should look [1, 2, 3, 3, 5, 6, 6, 8]

    let nonTiedMiddle = { 
      description: "Test a specific rank case",
      should: "should get the correct rank for a non-tied number in the middle of the sequence",
      value: 18, 
      expectedRank: 3,
      execute: function() { testCase(this, unsortedValuesTiedFirstAndLast, sortAscending) }
    }
    let nonTiedFirst = {
      description: "Test a specific rank case",
      should: "should get the correct rank for a non-tied number in first place",
      value: 20, 
      expectedRank: 1,
      execute: function() { testCase(this, unsortedValuesNONTiedFirstAndLast, sortAscending) }
    }
    let nonTiedLast = {
      description: "Test a specific rank case",
      should: "should get the correct rank for a non-tied number in last place",
      value: 1, 
      expectedRank: 8,
      execute: function() { testCase(this, unsortedValuesNONTiedFirstAndLast, sortAscending) }
    }

    let tiedMiddle = { 
      description: "Test a specific rank case",
      should: "should get the correct rank for a tied number in the middle of the sequence",
      value: 15, 
      expectedRank: 4 ,
      execute: function() { testCase(this, unsortedValuesTiedFirstAndLast, sortAscending) }
    }
    let tiedForFirst = { 
      description: "Test a specific rank case",
      should: "should get the correct rank for a number tied for first place",
      value: 20, 
      expectedRank: 1,
      execute: function() { testCase(this, unsortedValuesTiedFirstAndLast, sortAscending) }
    }
    let tiedForLast = { 
      description: "Test a specific rank case",
      should: "should get the correct rank for a number tied for last place",
      value: 1, 
      expectedRank: 9,
      execute: function() { testCase(this, unsortedValuesTiedFirstAndLast, sortAscending) }
    }

    nonTiedMiddle.execute()
    nonTiedFirst.execute()
    nonTiedLast.execute()

    tiedMiddle.execute()
    tiedForFirst.execute()
    tiedForLast.execute()
  })

  describe('Ascending rank, lower number is ranked better', () => {
    let sortAscending = true
    let unsortedValuesTiedFirstAndLast = [1, 20, 7, 2, 2, 18, 15, 1, 15, 20]
      // How the sorted values should look [1, 1, 2, 2, 7, 15, 15, 18, 20, 20]
      // How the ranking array should look [1, 1, 2, 2, 5, 6, 6, 8, 9, 9]
    let unsortedValuesNONTiedFirstAndLast = [1, 20, 7, 2, 2, 18, 15, 15]
      // How the sorted values should look [1, 2, 2, 7, 15, 15, 18, 20]
      // How the rank array should look [1, 2, 2, 4, 5, 5, 7, 8]

    let nonTiedMiddle = { 
      description: "Test a specific rank case",
      should: "should get the correct rank for a non-tied number in the middle of the sequence",
      value: 18, 
      expectedRank: 8,
      execute: function() { testCase(this, unsortedValuesTiedFirstAndLast, sortAscending) }
    }
    let nonTiedFirst = {
      description: "Test a specific rank case",
      should: "should get the correct rank for a non-tied number in first place",
      value: 1, 
      expectedRank: 1,
      execute: function() { testCase(this, unsortedValuesNONTiedFirstAndLast, sortAscending) }
    }
    let nonTiedLast = {
      description: "Test a specific rank case",
      should: "should get the correct rank for a non-tied number in last place",
      value: 20, 
      expectedRank: 8,
      execute: function() { testCase(this, unsortedValuesNONTiedFirstAndLast, sortAscending) }
    }

    let tiedMiddle = { 
      description: "Test a specific rank case",
      should: "should get the correct rank for a non-tied number in the middle of the sequence",
      value: 15, 
      expectedRank: 6,
      execute: function() { testCase(this, unsortedValuesTiedFirstAndLast, sortAscending) }
    }
    let tiedForFirst = { 
      description: "Test a specific rank case",
      should: "should get the correct rank for a non-tied number in the middle of the sequence",
      value: 20, 
      expectedRank: 9,
      execute: function() { testCase(this, unsortedValuesTiedFirstAndLast, sortAscending) }
    }
    let tiedForLast = { 
      description: "Test a specific rank case",
      should: "should get the correct rank for a non-tied number in the middle of the sequence",
      value: 1, 
      expectedRank: 1,
      execute: function() { testCase(this, unsortedValuesTiedFirstAndLast, sortAscending) }
    }

    nonTiedMiddle.execute()
    nonTiedFirst.execute()
    nonTiedLast.execute()

    tiedMiddle.execute()
    tiedForFirst.execute()
    tiedForLast.execute()
  })
})

// Shared behavior for testing ascending and descending ranks
function testCase(myCase, unsortedValues, sortAscending) {
  describe(myCase.description, () => {
    it(myCase.should, () => {
      let actualRank = NumberRank(myCase.value, unsortedValues, sortAscending)

      expect(actualRank).toEqual(myCase.expectedRank)
    })
  })
}
