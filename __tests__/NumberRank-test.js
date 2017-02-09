var NumberRank = require('../src/util/NumberRank.js')

describe('NumberRank', () => {
  
  describe('Default descending rank, higher number is ranked better', () => {
    let sortAscending = false
    let unsortedValues = [1, 20, 7, 2, 2, 18, 15, 1, 15, 20]
    let expectedSortedValues = [20, 20, 18, 15, 15, 7, 2, 2, 1, 1]
    let expectedRankArray = [1, 1, 3, 4, 4, 6, 7, 7, 9, 9]

    it('should get the correct rank for a non tied number in the middle', () => {
      let actual = NumberRank(18, unsortedValues, sortAscending)
      let expected = 3

      expect(actual).toEqual(expected)
    })

    it('should get the correct rank for a tied number in the middle', () => {
      expect(true).toEqual(false)
    })

    it('should get the correct rank for a tied number that is tied for first place', () => {
      expect(true).toEqual(false)
    })

    it('should get the correct rank for tied number that is tied for last place', () => {
      expect(true).toEqual(false)
    })
  })

  describe('Ascending rank, lower number is ranked better', () => {
    let sortAscending = true
    let unsortedValues = [1, 20, 7, 2, 2, 18, 15, 1, 15, 20]
    let expectedSortedValues = [1, 1, 2, 2, 7, 15, 15, 18, 20, 20]
    let expectedRankArray = [1, 1, 2, 2, 5, 6, 6, 8, 9, 9]

    it('should get the correct rank for a non tied number in the middle', () => {
      expect(true).toEqual(false)
    })

    it('should get the correct rank for a tied number in the middle', () => {
      expect(true).toEqual(false)
    })

    it('should get the correct rank for a tied number that is tied for first place', () => {
      expect(true).toEqual(false)
    })

    it('should get the correct rank for tied number that is tied for last place', () => {
      expect(true).toEqual(false)
    })
  })

})
