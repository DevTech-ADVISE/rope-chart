jest.unmock('../src/util/NumberRank.js')
var NumberRank = require('../src/util/NumberRank.js')

describe('NumberRank', () => {
  
  describe('Default descending rank, higher number is ranked better', () => {
    let sortAscending = false
    let unsortedValues = [1, 20, 7, 2, 2, 18, 15, 1, 15, 20]
    let expectedSortedValues = [20, 20, 18, 15, 15, 7, 2, 2, 1, 1]
    let expectedRankArray = [1, 1, 3, 4, 4, 6, 7, 7, 9, 9]

    let cases = {
      nonTiedMiddle: { value: 18, expectedRank: 3 },
      tiedMiddle: { value: 15, expectedRank: 4 },
      tiedForFirst: { value: 20, expectedRank: 1 },
      tiedForLast: { value: 1, expectedRank: 9 }
    }
    testAllCases(cases, unsortedValues, sortAscending)

  })

  describe('Ascending rank, lower number is ranked better', () => {
    let sortAscending = true
    let unsortedValues = [1, 20, 7, 2, 2, 18, 15, 1, 15, 20]
    let expectedSortedValues = [1, 1, 2, 2, 7, 15, 15, 18, 20, 20]
    let expectedRankArray = [1, 1, 2, 2, 5, 6, 6, 8, 9, 9]

    let cases = {
      nonTiedMiddle: { value: 18, expectedRank: 8 },
      tiedMiddle: { value: 15, expectedRank: 6 },
      tiedForFirst: { value: 20, expectedRank: 9 },
      tiedForLast: { value: 1, expectedRank: 1 }
    }
    testAllCases(cases, unsortedValues, sortAscending)
  })

})

// Shared behavior for testing ascending and descending ranks
function testAllCases(cases, unsortedValues, sortAscending) {
  describe('Testing each case for ranking numbers', () => {
    it('should get the correct rank for a non tied number in the middle', () => {
      let myCase = cases.nonTiedMiddle
      let actualRank = NumberRank(myCase.value, unsortedValues, sortAscending)

      expect(actualRank).toEqual(myCase.expectedRank)
    })

    it('should get the correct rank for a tied number in the middle', () => {
      let myCase = cases.tiedMiddle
      let actualRank = NumberRank(myCase.value, unsortedValues, sortAscending)

      expect(actualRank).toEqual(myCase.expectedRank)
    })

    it('should get the correct rank for a tied number that is tied for first place', () => {
      let myCase = cases.tiedForFirst
      let actualRank = NumberRank(myCase.value, unsortedValues, sortAscending)

      expect(actualRank).toEqual(myCase.expectedRank)
    })

    it('should get the correct rank for tied number that is tied for last place', () => {
      let myCase = cases.tiedForLast
      let actualRank = NumberRank(myCase.value, unsortedValues, sortAscending)

      expect(actualRank).toEqual(myCase.expectedRank)
    })
  })
}
