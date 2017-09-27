import _sum from 'lodash/sum'
import _map from 'lodash/map'

import {
  buildWidthData,
  calculateColumnsWidths,
  distributeDecimals,
} from './tableCalculator'

describe('with buildWidthData', () => {
  let columns = []
  let getColumnCellWidthsMock 
  let cellWidthResults1 = []
  let cellWidthResults2 = []
  let cellWidthResults3 = []
  beforeEach(() => {
    columns = [{ name: 'A' }, { name: 'B'}, { name: 'C'}]
    cellWidthResults1 = [87, 102, 54, 90]
    cellWidthResults2 = [38, 20, 19, 32]
    cellWidthResults3 = [154, 119, 73, 256]

    getColumnCellWidthsMock = jest.fn()
    getColumnCellWidthsMock
      .mockReturnValueOnce(cellWidthResults1)
      .mockReturnValueOnce(cellWidthResults2)
      .mockReturnValueOnce(cellWidthResults3)
  })

  it('should call getColumnCellWidths for each column', () => {
    buildWidthData(columns, getColumnCellWidthsMock)
    expect(getColumnCellWidthsMock.mock.calls[0]).toEqual(['A'])
    expect(getColumnCellWidthsMock.mock.calls[1]).toEqual(['B'])
    expect(getColumnCellWidthsMock.mock.calls[2]).toEqual(['C'])
  })

  it('should get the extended width for each columns', () => {
    const gatheredWidths = buildWidthData(columns, getColumnCellWidthsMock)
    expect(Object.keys(gatheredWidths).length).toBe(3)
    expect(gatheredWidths['A']).toEqual({ name: 'A', contentWidth: 102 + 2 })
    expect(gatheredWidths['B']).toEqual({ name: 'B', contentWidth: 38 + 2 })
    expect(gatheredWidths['C']).toEqual({ name: 'C', contentWidth: 256 + 2 })
  })

  it('should have an empty result object if no columns', () => {
    const gatheredWidths = buildWidthData([], getColumnCellWidthsMock)
    expect(Object.keys(gatheredWidths).length).toBe(0)
  })

  it('should have a undefined extended width if no cell widths', () => {
    const cellWidthsMock = jest.fn()
    cellWidthsMock.mockReturnValue([])
    const gatheredWidths = buildWidthData(columns, cellWidthsMock)
    expect(gatheredWidths['A']).toEqual({ name: 'A', contentWidth: undefined })
    expect(gatheredWidths['B']).toEqual({ name: 'B', contentWidth: undefined })
    expect(gatheredWidths['C']).toEqual({ name: 'C', contentWidth: undefined })
    expect(Object.keys(gatheredWidths).length).toBe(3)
  })
})

describe('with calculateColumnsWidths', () => {

  describe('when there are only fixed columns', () => {
    it('1 fixed column should have its fixed widths', () => {
      const columns = [
        { name: 'A', fixedWidth: 12, },
      ]

      const widths = calculateColumnsWidths(columns, {}, 15, 25, 1000)

      expect(widths['A']).toEqual(12)
      expect(Object.keys(widths).length).toEqual(1)
    })

    it('5 fixed columns should all have matching fixed widths', () => {
      const columns = [
        { name: 'A', fixedWidth: 12, },
        { name: 'B', fixedWidth: 23, },
        { name: 'C', fixedWidth: 34, },
        { name: 'D', fixedWidth: 45, },
        { name: 'E', fixedWidth: 56, },
      ]

      const widths = calculateColumnsWidths(columns, {}, 15, 25, 1000)

      expect(widths['A']).toEqual(12)
      expect(widths['B']).toEqual(23)
      expect(widths['C']).toEqual(34)
      expect(widths['D']).toEqual(45)
      expect(widths['E']).toEqual(56)
    })
  })

  describe('when there are only fit columns', () => {
    it('a fit column should match the gathered width', () => {
      const columns = [
        { name: 'A', fitToContentWidth: true, },
      ]
      const gatheredWidths = {
        'A': { name: 'A', contentWidth: 83 },
      }

      const widths = calculateColumnsWidths(columns, gatheredWidths, 15, 25, 1000)

      expect(widths['A']).toEqual(83)
    })

    it('a fit column should be restriced to the min width', () => {
      const columns = [ { name: 'A', fitToContentWidth: true, minWidth: 95 },
      ]
      const gatheredWidths = {
        'A': { name: 'A', contentWidth: 83 },
      }

      const widths = calculateColumnsWidths(columns, gatheredWidths, 15, 25, 1000)

      expect(widths['A']).toEqual(95)
    })

    it('a fit column should be restriced to the max width', () => {
      const columns = [
        { name: 'A', fitToContentWidth: true, maxWidth: 58 },
      ]
      const gatheredWidths = {
        'A': { name: 'A', contentWidth: 83 },
      }

      const widths = calculateColumnsWidths(columns, gatheredWidths, 15, 25, 1000)

      expect(widths['A']).toEqual(58)
    })

    it('multiple fit columns should all be restricted correctly', () => {
      const columns = [
        { name: 'A', fitToContentWidth: true, minWidth: 99},
        { name: 'B', fitToContentWidth: true, },
        { name: 'C', fitToContentWidth: true, minWidth: 50, maxWidth: 100},
        { name: 'D', fitToContentWidth: true, },
        { name: 'E', fitToContentWidth: true, maxWidth: 70},
      ]
      const gatheredWidths = {
        'A': { name: 'A', contentWidth: 22 },
        'B': { name: 'B', contentWidth: 86 },
        'C': { name: 'C', contentWidth: 92 },
        'D': { name: 'D', contentWidth: 44 },
        'E': { name: 'E', contentWidth: 91 },
      }

      const widths = calculateColumnsWidths(columns, gatheredWidths, 15, 25, 1000)

      expect(widths['A']).toEqual(99)
      expect(widths['B']).toEqual(86)
      expect(widths['C']).toEqual(92)
      expect(widths['D']).toEqual(44)
      expect(widths['E']).toEqual(70)
    })
  })

  describe('when there are only flexi columns', () => {

    const defualtMarginWidth = 15
    const defaultHalfGutterWidth = 25
    let exampleColumns, exampleGatheredWidths

    beforeEach(() => {
      exampleColumns = [
        { name: 'A', minWidth: 160 },
        { name: 'B', minWidth: 60, maxWidth: 70 },
        { name: 'C', maxWidth: 100 },
        { name: 'D', maxWidth: 200 },
        { name: 'E', minWidth: 48, maxWidth: 70 },
      ]

      exampleGatheredWidths =  {
        'A': { name: 'A', contentWidth: 200 },
        'B': { name: 'B', contentWidth: 40 },
        'C': { name: 'C', contentWidth: 70 },
        'D': { name: 'D', contentWidth: 150 },
        'E': { name: 'E', contentWidth: 50 },
      }
    })

    // example spreedsheet: https://docs.google.com/a/lendinvest.com/spreadsheets/d/15fvReGjYxmRRXd2nwYMUKNtSTAg0O6ZOszHXxO5dQHc/edit?usp=sharing

    it('should work with example 1 from spreadsheet', () => {
      const totalSpaceForColumns = 400

      const totalWidth =
        totalSpaceForColumns +
        (defualtMarginWidth * 2) +
        (defaultHalfGutterWidth * 2 * (exampleColumns.length - 1))

      const widths = calculateColumnsWidths(
        exampleColumns,
        exampleGatheredWidths,
        defualtMarginWidth,
        defaultHalfGutterWidth,
        totalWidth)

      expect(widths['A']).toEqual(160)
      expect(widths['B']).toEqual(60)
      expect(widths['C']).toEqual(42)
      expect(widths['D']).toEqual(90)
      expect(widths['E']).toEqual(48)

      expect(_sum(_map(widths))).toEqual(totalSpaceForColumns)
    })

    it('should work with example 2 from spreadsheet', () => {
      const totalSpaceForColumns = 440

      const totalWidth =
        totalSpaceForColumns +
        (defualtMarginWidth * 2) +
        (defaultHalfGutterWidth * 2 * (exampleColumns.length - 1))

      const widths = calculateColumnsWidths(
        exampleColumns,
        exampleGatheredWidths,
        defualtMarginWidth,
        defaultHalfGutterWidth,
        totalWidth)

      expect(widths['A']).toEqual(160)
      expect(widths['B']).toEqual(60)
      expect(widths['C']).toEqual(55)
      expect(widths['D']).toEqual(117)
      expect(widths['E']).toEqual(48)

      expect(_sum(_map(widths))).toEqual(totalSpaceForColumns)
    })

    it('should work with example 3 from spreadsheet', () => {
      const totalSpaceForColumns = 490

      const totalWidth =
        totalSpaceForColumns +
        (defualtMarginWidth * 2) +
        (defaultHalfGutterWidth * 2 * (exampleColumns.length - 1))

      const widths = calculateColumnsWidths(
        exampleColumns,
        exampleGatheredWidths,
        defualtMarginWidth,
        defaultHalfGutterWidth,
        totalWidth)

      expect(widths['A']).toEqual(182)
      expect(widths['B']).toEqual(60)
      expect(widths['C']).toEqual(64)
      expect(widths['D']).toEqual(136)
      expect(widths['E']).toEqual(48)

      expect(_sum(_map(widths))).toEqual(totalSpaceForColumns)
    })

    it('should work with example 4 from spreadsheet', () => {
      const totalSpaceForColumns = 550 

      const totalWidth =
        totalSpaceForColumns +
        (defualtMarginWidth * 2) +
        (defaultHalfGutterWidth * 2 * (exampleColumns.length - 1))

      const widths = calculateColumnsWidths(
        exampleColumns,
        exampleGatheredWidths,
        defualtMarginWidth,
        defaultHalfGutterWidth,
        totalWidth)

      expect(widths['A']).toEqual(209)
      expect(widths['B']).toEqual(60)
      expect(widths['C']).toEqual(73)
      expect(widths['D']).toEqual(156)
      expect(widths['E']).toEqual(52)

      expect(_sum(_map(widths))).toEqual(totalSpaceForColumns)
    })

    it('should work with example 5 from spreadsheet', () => {
      const totalSpaceForColumns = 713 

      const totalWidth =
        totalSpaceForColumns +
        (defualtMarginWidth * 2) +
        (defaultHalfGutterWidth * 2 * (exampleColumns.length - 1))

      const widths = calculateColumnsWidths(
        exampleColumns,
        exampleGatheredWidths,
        defualtMarginWidth,
        defaultHalfGutterWidth,
        totalWidth)

      expect(widths['A']).toEqual(284)
      expect(widths['B']).toEqual(60)
      expect(widths['C']).toEqual(99)
      expect(widths['D']).toEqual(200)
      expect(widths['E']).toEqual(70)

      expect(_sum(_map(widths))).toEqual(totalSpaceForColumns)
    })

    it('should work with example 6 from spreadsheet', () => {
      const totalSpaceForColumns = 1000

      const totalWidth =
        totalSpaceForColumns +
        (defualtMarginWidth * 2) +
        (defaultHalfGutterWidth * 2 * (exampleColumns.length - 1))

      const widths = calculateColumnsWidths(
        exampleColumns,
        exampleGatheredWidths,
        defualtMarginWidth,
        defaultHalfGutterWidth,
        totalWidth)

      expect(widths['A']).toEqual(560)
      expect(widths['B']).toEqual(70)
      expect(widths['C']).toEqual(100)
      expect(widths['D']).toEqual(200)
      expect(widths['E']).toEqual(70)

      expect(_sum(_map(widths))).toEqual(totalSpaceForColumns)
    })

    it('should work with example 7 from spreadsheet', () => {
      const totalSpaceForColumns = 800

      exampleColumns[3].minWidth = 200
      exampleGatheredWidths['D'].contentWidth = 80

      const totalWidth =
        totalSpaceForColumns +
        (defualtMarginWidth * 2) +
        (defaultHalfGutterWidth * 2 * (exampleColumns.length - 1))

      const widths = calculateColumnsWidths(
        exampleColumns,
        exampleGatheredWidths,
        defualtMarginWidth,
        defaultHalfGutterWidth,
        totalWidth)

      expect(widths['A']).toEqual(360)
      expect(widths['B']).toEqual(70)
      expect(widths['C']).toEqual(100)
      expect(widths['D']).toEqual(200)
      expect(widths['E']).toEqual(70)

      expect(_sum(_map(widths))).toEqual(totalSpaceForColumns)
    })

    it('should work with example 8 from spreadsheet', () => {
      const totalSpaceForColumns = 800

      exampleColumns = [
        { name: 'A', minWidth: 50 },
        { name: 'B', minWidth: 50 },
        { name: 'C', maxWidth: 150 },
        { name: 'D', maxWidth: 150 },
        { name: 'E', maxWidth: 150 },
      ]

      exampleGatheredWidths =  {
        'A': { name: 'A', contentWidth: 10 },
        'B': { name: 'B', contentWidth: 10 },
        'C': { name: 'C', contentWidth: 200 },
        'D': { name: 'D', contentWidth: 200 },
        'E': { name: 'E', contentWidth: 200 },
      }

      const totalWidth =
        totalSpaceForColumns +
        (defualtMarginWidth * 2) +
        (defaultHalfGutterWidth * 2 * (exampleColumns.length - 1))

      const widths = calculateColumnsWidths(
        exampleColumns,
        exampleGatheredWidths,
        defualtMarginWidth,
        defaultHalfGutterWidth,
        totalWidth)

      expect(widths['A']).toEqual(175)
      expect(widths['B']).toEqual(175)
      expect(widths['C']).toEqual(150)
      expect(widths['D']).toEqual(150)
      expect(widths['E']).toEqual(150)

      expect(_sum(_map(widths))).toEqual(totalSpaceForColumns)
    })

    it('should work with example 9 from spreadsheet', () => {
      const totalSpaceForColumns = 220

      exampleColumns = [
        { name: 'A', minWidth: 20 },
        { name: 'B', minWidth: 20 },
        { name: 'C', minWidth: 20 },
        { name: 'D', maxWidth: 100 },
        { name: 'E', maxWidth: 100 },
      ]

      exampleGatheredWidths =  {
        'A': { name: 'A', contentWidth: 10 },
        'B': { name: 'B', contentWidth: 10 },
        'C': { name: 'C', contentWidth: 10 },
        'D': { name: 'D', contentWidth: 200 },
        'E': { name: 'E', contentWidth: 200 },
      }

      const totalWidth =
        totalSpaceForColumns +
        (defualtMarginWidth * 2) +
        (defaultHalfGutterWidth * 2 * (exampleColumns.length - 1))

      const widths = calculateColumnsWidths(
        exampleColumns,
        exampleGatheredWidths,
        defualtMarginWidth,
        defaultHalfGutterWidth,
        totalWidth)

      expect(widths['A']).toEqual(20)
      expect(widths['B']).toEqual(20)
      expect(widths['C']).toEqual(20)
      expect(widths['D']).toEqual(80)
      expect(widths['E']).toEqual(80)

      expect(_sum(_map(widths))).toEqual(totalSpaceForColumns)
    })
  })

  describe('when there are mixed columns', () => {
    it('should work correctly with 2 columns of each type', () => {

      const totalSpaceForColumns = 950
      const marginWidth = 5
      const halfGutterWidth = 25

      const exampleColumns = [
        { name: 'A-fixed', fixedWidth: 143 },
        { name: 'B-fill', fitToContentWidth: true, minWidth: 20, maxWidth: 200 },
        { name: 'C-flex', minWidth: 80 },
        { name: 'D-fill', fitToContentWidth: true, mixWidth: 100 },
        { name: 'E-flex', maxWidth: 200 },
        { name: 'F-fixed', fixedWidth: 128 },
      ]

      const exampleGatheredWidths =  {
        'A-fixed': { name: 'A-fixed', contentWidth: 10 },
        'B-fill': { name: 'B-fill', contentWidth: 220 },
        'C-flex': { name: 'C-flex', contentWidth: 70 },
        'D-fill': { name: 'D-fill', contentWidth: 150 },
        'E-flex': { name: 'E-flex', contentWidth: 160 },
        'F-fixed': { name: 'F-fixed', contentWidth: 10 },
      }

      const totalWidth =
        totalSpaceForColumns +
        (marginWidth * 2) +
        (halfGutterWidth * 2 * (exampleColumns.length - 1))

      const widths = calculateColumnsWidths(
        exampleColumns,
        exampleGatheredWidths,
        marginWidth,
        halfGutterWidth,
        totalWidth)

      expect(widths['A-fixed']).toEqual(143)
      expect(widths['B-fill']).toEqual(200)
      expect(widths['C-flex']).toEqual(129)
      expect(widths['D-fill']).toEqual(150)
      expect(widths['E-flex']).toEqual(200)
      expect(widths['F-fixed']).toEqual(128)

      expect(_sum(_map(widths))).toEqual(totalSpaceForColumns)
    })
  })

})

function fixEpsilonErrorOrFloor(val) {
  if (val + 0.001 > Math.ceil(val)) {
    return Math.ceil(val)
  } else {
    return Math.floor(val)
  }
}


describe('with distributeDecimals', () => {
  it('should do nothing with an empty list', () => {
    const result = distributeDecimals([])
    expect(result).toEqual([])
  })

  it('should floor a single value', () => {
    const result = distributeDecimals([19.95])
    expect(result).toEqual([19])
  })

  it('should distrubte two values, flooring if needed', () => {
    const result = distributeDecimals([19.95, 23.5])
    expect(result).toEqual([20, 23])
  })

  it('should change nothing when everything is a round value', () => {
    const input = [1, 197, 54, 33, 1438, 2342, 83, 2, -123, -84, -72, -34, 96, 234, 7, 842, 771, 3536]
    const result = distributeDecimals(input)
    expect(result).toEqual([1, 197, 54, 33, 1438, 2342, 83, 2, -123, -84, -72, -34, 96, 234, 7, 842, 771, 3536])
    expect(_sum(result)).toEqual(fixEpsilonErrorOrFloor(_sum(input)))
  })

  it('should distribute [208.5106383, 60, 72.9787234, 156.3829787, 52.12765957] correctly', () => {
    const input = [208.5106383, 60, 72.9787234, 156.3829787, 52.12765957]
    const result = distributeDecimals(input)
    expect(result).toEqual([209, 60, 73, 156, 52])
    expect(_sum(result)).toEqual(fixEpsilonErrorOrFloor(_sum(input)))
  })

  it('should distribute negatives correctly', () => {
    const input = [-208.5106383, -60, -72.9787234, -156.3829787, -52.12765957]
    const result = distributeDecimals(input)
    expect(result).toEqual([-209, -60, -73, -156, -52])
    expect(_sum(result)).toEqual(fixEpsilonErrorOrFloor(_sum(input)))
  })

  it('should distribute [156.8627451, 31.37254902, 54.90196078, 117.6470588, 39.21568627] correctly', () => {
    const input = [156.8627451, 31.37254902, 54.90196078, 117.6470588, 39.21568627]
    const result = distributeDecimals(input)
    expect(result).toEqual([157, 31, 55, 118, 39])
    expect(_sum(result)).toEqual(fixEpsilonErrorOrFloor(_sum(input)))
  })

  it('should distribute [172.5490196, 34.50980392, 60.39215686, 129.4117647, 43.1372549] correctly', () => {
    const input = [172.5490196, 34.50980392, 60.39215686, 129.4117647, 43.1372549]
    const result = distributeDecimals(input)
    expect(result).toEqual([173, 35, 60, 129, 43])
    expect(_sum(result)).toEqual(fixEpsilonErrorOrFloor(_sum(input)))
  })

  // interesting case because all fraction parts are < 0.5
  // Only one number should go up
  it('should distribute correctly when all fraction parts are < 0.5', () => {
    const input = [192.1568627, 38.43137255, 67.25490196, 144.1176471, 48.03921569]
    const result = distributeDecimals(input)
    expect(result).toEqual([192, 39, 67, 144, 48])
    expect(_sum(result)).toEqual(fixEpsilonErrorOrFloor(_sum(input)))
  })

  // same as above but list is duplicated
  it('should distribute correctly when all fraction parts are < 0.5, 20 numbers', () => {
    const input = [192.1568627, 38.43137255, 67.25490196, 144.1176471, 48.03921569, 192.1568627, 38.43137255, 67.25490196, 144.1176471, 48.03921569, 192.1568627, 38.43137255, 67.25490196, 144.1176471, 48.03921569, 192.1568627, 38.43137255, 67.25490196, 144.1176471, 48.03921569]
    const result = distributeDecimals(input)
    expect(result).toEqual([192, 39, 67, 144, 48, 192, 39, 67, 144, 48, 192, 39, 67, 144, 48, 192, 39, 67, 144, 48])
    expect(_sum(result)).toEqual(fixEpsilonErrorOrFloor(_sum(input)))
  })

  // interesting case because all fraction parts are > 0.5
  // All but one of the numbers goes up
  it('should distribute correctly when all fraction parts are > 0.5', () => {
    const input = [279.6078431, 55.92156863, 97.8627451, 209.7058824, 69.90196078]
    const result = distributeDecimals(input)
    expect(result).toEqual([279, 56, 98, 210, 70])
    expect(_sum(result)).toEqual(fixEpsilonErrorOrFloor(_sum(input)))
  })

  // same as above but list is duplicated
  it('should distribute correctly when all fraction parts are > 0.5, 20 numbers', () => {
    const input = [279.6078431, 55.92156863, 97.8627451, 209.7058824, 69.90196078, 279.6078431, 55.92156863, 97.8627451, 209.7058824, 69.90196078, 279.6078431, 55.92156863, 97.8627451, 209.7058824, 69.90196078, 279.6078431, 55.92156863, 97.8627451, 209.7058824, 69.90196078]
    const result = distributeDecimals(input)
    expect(result).toEqual([279, 56, 98, 210, 70, 279, 56, 98, 210, 70, 279, 56, 98, 210, 70, 279, 56, 98, 210, 70])
    expect(_sum(result)).toEqual(fixEpsilonErrorOrFloor(_sum(input)))
  })

  it('should distribute large unique list correctly', () => {
    const input = [363.6363636, 72.72727273, 127.2727273, 145.4545455, 90.90909091, 333.3333333, 66.66666667, 116.6666667, 290, 83.33333333, 285.8064516, 57.16129032, 100.0322581, 200, 70, 208.5106383, 60, 72.9787234, 156.3829787, 52.12765957, 182.9787234, 248.8532, 64.04255319, 37.2340426, 345.74468085]
    const result = distributeDecimals(input)
    expect(result).toEqual([364, 73, 127, 145, 91, 333, 67, 117, 290, 83, 286, 57, 100, 200, 70, 208, 60, 73, 156, 52, 183, 249, 64, 37, 346])
    expect(_sum(result)).toEqual(fixEpsilonErrorOrFloor(_sum(input)))
  })

})
