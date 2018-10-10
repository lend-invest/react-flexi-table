import Decimal from 'decimal.js-light'
import _find from 'lodash/find'
import _map from 'lodash/map'
import _max from 'lodash/max'
import _maxBy from 'lodash/maxBy'
import _minBy from 'lodash/minBy'
import _sum from 'lodash/sum'
import _sumBy from 'lodash/sumBy'
import _sortBy from 'lodash/sortBy'
import _keyBy from 'lodash/keyBy'
import _pickBy from 'lodash/pickBy'
import _filter from 'lodash/filter'
import _zipObject from 'lodash/zipObject'
import _mapValues from 'lodash/mapValues'

export function buildWidthData(columns, getColumnCellWidths) {
  // At this stage I'm just keeping the max cell width we find for each
  // column. It's possible that we could use different strategies in the
  // future though. Standard Deviations or similar
  const columnWidthData = _map(columns, c => {
    const cellWidths = getColumnCellWidths(c.name)
    const maximumContentWidth = _max(cellWidths)
    // need to add 2 to the max because of the way clientWidth is rounded + browser bugs
    return { name: c.name, contentWidth: maximumContentWidth && maximumContentWidth + 2 }
  })

  return _keyBy(columnWidthData, 'name')
}

function getFixedWidthColumnWidths(columns) {
  const fixedColumns = columns.filter(c => c.fixedWidth != null)
  const fixedWidths = fixedColumns.map(c => ({ name: c.name, width: c.fixedWidth }))
  return _keyBy(fixedWidths, 'name')
}

function getFitWidthColumnWidths(columns, gatheredWidths) {
  const fitColumns = columns.filter(c => c.fitToContentWidth && c.fixedWidth == null)
  const fitWidths = fitColumns.map(c => {
    const contentWidth = gatheredWidths[c.name].contentWidth
    if (c.minWidth != null && contentWidth < c.minWidth) {
      return { name: c.name, width: c.minWidth }
    } else if (c.maxWidth != null && contentWidth > c.maxWidth) {
      return { name: c.name, width: c.maxWidth }
    } else {
      return { name: c.name, width: contentWidth }
    }
  })
  return _keyBy(fitWidths, 'name')
}

function findFlexiColumnSizeViolations(proportionalColumnsByName) {
  const minViolations = _pickBy(proportionalColumnsByName,
    c => c.minWidth != null && c.width <= c.minWidth)
  const maxViolations = _pickBy(proportionalColumnsByName,
    c => c.maxWidth != null && c.width >= c.maxWidth)

  return (
    _map(minViolations, c => ({ column: c, diff: c.minWidth - c.width })).concat(
    _map(maxViolations, c => ({ column: c, diff: c.width - c.maxWidth }))
  ))
}

function enforceFlexiColumnSizeRestrictions(violations) {
  const fixed = violations.map(x => {
    const c = x.column
    if (c.minWidth != null && c.width <= c.minWidth) {
      return { name: c.name, width: c.minWidth }
    } else if (c.maxWidth != null && c.width >= c.maxWidth) {
      return  { name: c.name, width: c.maxWidth }
    } else {
      throw Error('No column restriction to enforce!?')
    }
  })
  return _keyBy(fixed, x => x.name)
}

function getFlexiColumnWidths(remainingColumns, gatheredWidths, remainingWidth) {
  let completedByName = {}

  // we want to distribute the remaining width *proportionally* amongst all remaining
  // flexi columns. Max width and min widths are a special case becuase they
  // may add to or reduce the average we have per column.
  
  //initialize proportional widths at their gatheredWidths
  let proportionalColumns = remainingColumns.map(c => {
    return { ...c, width: gatheredWidths[c.name].contentWidth }
  })

  // Note: ensure each column has some width (0's could cause us errors) (we could handle this better)
  proportionalColumns = proportionalColumns.map(c => ({ ...c, width: c.width || 1 }))

  let remainingProportionalWidth = _sumBy(proportionalColumns, x => x.width)
  let proportionalByName = _keyBy(proportionalColumns, x => x.name)
  let removedByName = {}

  // We have to loop while we have a min or max we enforced.
  // Enforcing a min or max will change all the other column widths, which can
  // cause other columns to now be under min or over max.
  do {
    const removedWidth =_sum(_map(removedByName, x => x.width)) || 0
    remainingWidth -= removedWidth
    proportionalByName = _pickBy(proportionalByName, c => !removedByName[c.name])
    remainingProportionalWidth = _sum(_map(proportionalByName, x => x.width))
    proportionalByName = _mapValues(proportionalByName, c => {
      // if we have run out of width just use the existing proportional width
      // the table will have to handle this with scrollbars.
      if (remainingWidth < 0) { return c }
      const updatedProportionalWidth = (proportionalByName[c.name].width / remainingProportionalWidth) * remainingWidth
      return { ...c, width: updatedProportionalWidth }
    })

    // find restriction violations if any
    const restrictionViolations = findFlexiColumnSizeViolations(proportionalByName)
    if (!restrictionViolations.length) {
      //no violiations mean everything is good, proportionalByName can be used as final results
      break
    }

    // find largest violation (may be multiple equal)
    const largestDiff = _maxBy(restrictionViolations, x => x.diff).diff
    const allLargest = _filter(restrictionViolations, x => x.diff === largestDiff)
    // fix the violation
    const fixedByName = enforceFlexiColumnSizeRestrictions(allLargest)
    completedByName = { ...completedByName, ...fixedByName }
    removedByName = fixedByName

  } while (true)

  //fix up the decimal places. Column widths have to match the pixel grid
  const calculatedWidths = _map(proportionalByName, (v, k) => ({ name: k, width: v.width }))
  const distributedWidths = distributeDecimals(calculatedWidths.map(x => x.width))
  const zippedWidths = _zipObject(calculatedWidths.map(x => x.name), distributedWidths)
  const finalFlexiColumns = _mapValues(zippedWidths, (v, k) => ({ name: k, width: v }))

  return { ...completedByName, ...finalFlexiColumns }
}

export function calculateRowWidth(columnsWidths, marginWidth, halfGutterWidth) {
  const columnsAndGutterWidths =
    (marginWidth * 2) +
    ((columnsWidths.length - 1) * halfGutterWidth * 2)

  const totalColumnWidth = _sum(columnsWidths)
  return columnsAndGutterWidths + totalColumnWidth
}

// This should be called during init after we have called gatherWidthData,
// or anytime the table has been resized
export function calculateColumnsWidths(
  columns,
  gatheredWidths,
  marginWidth,
  halfGutterWidth,
  tableElementWidth
) {

  let completedWidths = {}

  const columnsAndGutterWidths =
    (marginWidth * 2) +
    ((columns.length - 1) * halfGutterWidth * 2)

  // Three column types:
  // Fixed: User has defined a fixed width. We don't need to do anything
  // Fit:   Columns widths fit their largest element.
  //        Will obey min & max widths
  // Flexi: Default. Columns will flex to fit the space of the table.
  //        Will obey min & max widths


  const fixedWidths = getFixedWidthColumnWidths(columns)
  completedWidths = { ...completedWidths, ...fixedWidths }

  const fitWidths = getFitWidthColumnWidths(columns, gatheredWidths)
  completedWidths = { ...completedWidths, ...fitWidths }

  // Now how much room do we have for the flexi columns
  let remainingWidth = tableElementWidth -
    (columnsAndGutterWidths + _sum(_map(completedWidths, x => x.width)))

  const remainingColumns = columns.filter(c => !completedWidths[c.name])

  // Note: We might not have any remaining width. getFlexiColumnWidths will
  // use the gathered widths instead (still taking into account mins and
  // maxes) and the table will handle it with a scroll bar
  const flexiWidths = getFlexiColumnWidths(remainingColumns, gatheredWidths, remainingWidth)
  completedWidths = { ...completedWidths, ...flexiWidths }

  return _mapValues(completedWidths, c => c.width)
}


const EPSILON = new Decimal('0.001')

// This function takes an array of floats and turns them all into ints,
// distributing the decimal fractions as best as possible.
export function distributeDecimals(floats) {
  // NOTE: I've written this in a very functional way. If we need to make it
  // faster, just rewrite it mutating everything. Not using Decimal would make
  // it quite a bit faster as well

  //turn them all into decimals. Lets try to be accurate
  const values = floats.map((x,i) => ({ index: i, value: new Decimal(x) }))
  // NOTE: I need to turn the indexes into strings or it will skip the 0 index!
  const valuesByIndex = _mapValues(_pickBy(values, x => '' + x.index), x => x.value)

  let results = values.filter(x => x.value.dp() === 0)

  let withFraction = values.filter(x => x.value.dp() > 0)
  let fractionalParts = _map(withFraction, x =>
    ({ index: x.index, value: x.value.minus( x.value.todp(0, Decimal.ROUND_FLOOR))}))

  let remainder = new Decimal(0)
  while (fractionalParts.length > 1) {
    //just get the fractional parts 
    let max = _maxBy(fractionalParts, x => x.value.toNumber())

    const fractionalPartsMinusMax = fractionalParts.filter(x => x.index !== max.index);

    //only deal with min if we don't already have a remainder
    let minValue = new Decimal(0)
    if (remainder.minus(EPSILON).lte(0)) {
      var min = fractionalPartsMinusMax.length > 1 ?
        _minBy(fractionalPartsMinusMax, x => x.value.toNumber())
        : fractionalPartsMinusMax[0];
      minValue = min.value
      // remove the fractional part from the min value, add it to the results
      const newMinValue = valuesByIndex[min.index].todp(0, Decimal.ROUND_FLOOR)
      results = results.concat({ index: min.index, value: newMinValue })
      fractionalParts = _filter(fractionalParts, x => x.index !== min.index)
    }

    // we only want to use up to (1) of the remainder. If the remainder
    // is any larger we want to carry that through.
    const remainderToUse = remainder.minus(1).gt(0) ? new Decimal(1) : remainder
    remainder = remainder.minus(remainderToUse)

    // now use the fractional part from the min value, and add it to the max value
    let newFractionalMaxValue = _find(fractionalParts, x => x.index === max.index).value
      .plus(minValue) // add the fraction part from the min value if we have it
      .plus(remainderToUse) // add any remainder from our last iteration

    if (newFractionalMaxValue.gte(1)) {
      // if that caused the max value to rollover, then keep the remainder,
      // update the results, and remove the max item fron the fractions we are working with
      remainder = remainder.plus(newFractionalMaxValue.minus(1))
      const newMaxValue = valuesByIndex[max.index].todp(0, Decimal.ROUND_CEIL)
      results = results.concat({ index: max.index, value: newMaxValue })
      fractionalParts = _filter(fractionalParts, x => x.index !== max.index)

    } else {
      // otherwise update the max fraction and continue
      fractionalParts = fractionalParts.map(x => x.index === max.index
        ? { index: max.index, value: newFractionalMaxValue }
        : x)
    }
  }

  if (fractionalParts.length === 1) {
    // We are left with a fractional part (and potentially a remaider) that we couldn't distribute.
    const lastPart = fractionalParts[0]

    const remainderToUse = remainder.minus(1).gt(0) ? new Decimal(1) : remainder
    remainder = remainder.minus(remainderToUse)

    let checkValue = lastPart.value.plus(remainderToUse)
    if ((new Decimal(1)).minus(checkValue).lte(EPSILON)) {
      // If it's very close to one, we'll round up the result
      const lastValue = valuesByIndex[lastPart.index].todp(0, Decimal.ROUND_CEIL)
      results = results.concat({ index: lastPart.index, value: lastValue })

    } else {
      // otherwise we'll floor
      const lastValue = valuesByIndex[lastPart.index].todp(0, Decimal.ROUND_FLOOR)
      results = results.concat({ index: lastPart.index, value: lastValue })
    }
  }

  return _sortBy(results, x => x.index).map(x => x.value.toNumber())
}
