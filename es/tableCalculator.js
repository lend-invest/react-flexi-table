var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import Decimal from 'decimal.js-light';
import _find from 'lodash/find';
import _map from 'lodash/map';
import _max from 'lodash/max';
import _maxBy from 'lodash/maxBy';
import _minBy from 'lodash/minBy';
import _sum from 'lodash/sum';
import _sumBy from 'lodash/sumBy';
import _sortBy from 'lodash/sortBy';
import _keyBy from 'lodash/keyBy';
import _pickBy from 'lodash/pickBy';
import _filter from 'lodash/filter';
import _zipObject from 'lodash/zipObject';
import _mapValues from 'lodash/mapValues';

export function buildWidthData(columns, getColumnCellWidths) {
  // At this stage I'm just keeping the max cell width we find for each
  // column. It's possible that we could use different strategies in the
  // future though. Standard Deviations or similar
  var columnWidthData = _map(columns, function (c) {
    var cellWidths = getColumnCellWidths(c.name);
    var maximumContentWidth = _max(cellWidths);
    // need to add 2 to the max because of the way clientWidth is rounded + browser bugs
    return { name: c.name, contentWidth: maximumContentWidth && maximumContentWidth + 2 };
  });

  return _keyBy(columnWidthData, 'name');
}

function getFixedWidthColumnWidths(columns) {
  var fixedColumns = columns.filter(function (c) {
    return c.fixedWidth != null;
  });
  var fixedWidths = fixedColumns.map(function (c) {
    return { name: c.name, width: c.fixedWidth };
  });
  return _keyBy(fixedWidths, 'name');
}

function getFitWidthColumnWidths(columns, gatheredWidths) {
  var fitColumns = columns.filter(function (c) {
    return c.fitToContentWidth && c.fixedWidth == null;
  });
  var fitWidths = fitColumns.map(function (c) {
    var contentWidth = gatheredWidths[c.name].contentWidth;
    if (c.minWidth != null && contentWidth < c.minWidth) {
      return { name: c.name, width: c.minWidth };
    } else if (c.maxWidth != null && contentWidth > c.maxWidth) {
      return { name: c.name, width: c.maxWidth };
    } else {
      return { name: c.name, width: contentWidth };
    }
  });
  return _keyBy(fitWidths, 'name');
}

function findFlexiColumnSizeViolations(proportionalColumnsByName) {
  var minViolations = _pickBy(proportionalColumnsByName, function (c) {
    return c.minWidth != null && c.width <= c.minWidth;
  });
  var maxViolations = _pickBy(proportionalColumnsByName, function (c) {
    return c.maxWidth != null && c.width >= c.maxWidth;
  });

  return _map(minViolations, function (c) {
    return { column: c, diff: c.minWidth - c.width };
  }).concat(_map(maxViolations, function (c) {
    return { column: c, diff: c.width - c.maxWidth };
  }));
}

function enforceFlexiColumnSizeRestrictions(violations) {
  var fixed = violations.map(function (x) {
    var c = x.column;
    if (c.minWidth != null && c.width <= c.minWidth) {
      return { name: c.name, width: c.minWidth };
    } else if (c.maxWidth != null && c.width >= c.maxWidth) {
      return { name: c.name, width: c.maxWidth };
    } else {
      throw Error('No column restriction to enforce!?');
    }
  });
  return _keyBy(fixed, function (x) {
    return x.name;
  });
}

function getFlexiColumnWidths(remainingColumns, gatheredWidths, remainingWidth) {
  var completedByName = {};

  // we want to distribute the remaining width *proportionally* amongst all remaining
  // flexi columns. Max width and min widths are a special case becuase they
  // may add to or reduce the average we have per column.

  //initialize proportional widths at their gatheredWidths
  var proportionalColumns = remainingColumns.map(function (c) {
    return _extends({}, c, { width: gatheredWidths[c.name].contentWidth });
  });

  // Note: ensure each column has some width (0's could cause us errors) (we could handle this better)
  proportionalColumns = proportionalColumns.map(function (c) {
    return _extends({}, c, { width: c.width || 1 });
  });

  var remainingProportionalWidth = _sumBy(proportionalColumns, function (x) {
    return x.width;
  });
  var proportionalByName = _keyBy(proportionalColumns, function (x) {
    return x.name;
  });
  var removedByName = {};

  // We have to loop while we have a min or max we enforced.
  // Enforcing a min or max will change all the other column widths, which can
  // cause other columns to now be under min or over max.

  var _loop = function _loop() {
    var removedWidth = _sum(_map(removedByName, function (x) {
      return x.width;
    })) || 0;
    remainingWidth -= removedWidth;
    proportionalByName = _pickBy(proportionalByName, function (c) {
      return !removedByName[c.name];
    });
    remainingProportionalWidth = _sum(_map(proportionalByName, function (x) {
      return x.width;
    }));
    proportionalByName = _mapValues(proportionalByName, function (c) {
      // if we have run out of width just use the existing proportional width
      // the table will have to handle this with scrollbars.
      if (remainingWidth < 0) {
        return c;
      }
      var updatedProportionalWidth = proportionalByName[c.name].width / remainingProportionalWidth * remainingWidth;
      return _extends({}, c, { width: updatedProportionalWidth });
    });

    // find restriction violations if any
    var restrictionViolations = findFlexiColumnSizeViolations(proportionalByName);
    if (!restrictionViolations.length) {
      //no violiations mean everything is good, proportionalByName can be used as final results
      return 'break';
    }

    // find largest violation (may be multiple equal)
    var largestDiff = _maxBy(restrictionViolations, function (x) {
      return x.diff;
    }).diff;
    var allLargest = _filter(restrictionViolations, function (x) {
      return x.diff === largestDiff;
    });
    // fix the violation
    var fixedByName = enforceFlexiColumnSizeRestrictions(allLargest);
    completedByName = _extends({}, completedByName, fixedByName);
    removedByName = fixedByName;
  };

  do {
    var _ret = _loop();

    if (_ret === 'break') break;
  } while (true);

  //fix up the decimal places. Column widths have to match the pixel grid
  var calculatedWidths = _map(proportionalByName, function (v, k) {
    return { name: k, width: v.width };
  });
  var distributedWidths = distributeDecimals(calculatedWidths.map(function (x) {
    return x.width;
  }));
  var zippedWidths = _zipObject(calculatedWidths.map(function (x) {
    return x.name;
  }), distributedWidths);
  var finalFlexiColumns = _mapValues(zippedWidths, function (v, k) {
    return { name: k, width: v };
  });

  return _extends({}, completedByName, finalFlexiColumns);
}

export function calculateRowWidth(columnsWidths, marginWidth, halfGutterWidth) {
  var columnsAndGutterWidths = marginWidth * 2 + (columnsWidths.length - 1) * halfGutterWidth * 2;

  var totalColumnWidth = _sum(columnsWidths);
  return columnsAndGutterWidths + totalColumnWidth;
}

// This should be called during init after we have called gatherWidthData,
// or anytime the table has been resized
export function calculateColumnsWidths(columns, gatheredWidths, marginWidth, halfGutterWidth, tableElementWidth) {

  var completedWidths = {};

  var columnsAndGutterWidths = marginWidth * 2 + (columns.length - 1) * halfGutterWidth * 2;

  // Three column types:
  // Fixed: User has defined a fixed width. We don't need to do anything
  // Fit:   Columns widths fit their largest element.
  //        Will obey min & max widths
  // Flexi: Default. Columns will flex to fit the space of the table.
  //        Will obey min & max widths


  var fixedWidths = getFixedWidthColumnWidths(columns);
  completedWidths = _extends({}, completedWidths, fixedWidths);

  var fitWidths = getFitWidthColumnWidths(columns, gatheredWidths);
  completedWidths = _extends({}, completedWidths, fitWidths);

  // Now how much room do we have for the flexi columns
  var remainingWidth = tableElementWidth - (columnsAndGutterWidths + _sum(_map(completedWidths, function (x) {
    return x.width;
  })));

  var remainingColumns = columns.filter(function (c) {
    return !completedWidths[c.name];
  });

  // Note: We might not have any remaining width. getFlexiColumnWidths will
  // use the gathered widths instead (still taking into account mins and
  // maxes) and the table will handle it with a scroll bar
  var flexiWidths = getFlexiColumnWidths(remainingColumns, gatheredWidths, remainingWidth);
  completedWidths = _extends({}, completedWidths, flexiWidths);

  return _mapValues(completedWidths, function (c) {
    return c.width;
  });
}

var EPSILON = new Decimal('0.001');

// This function takes an array of floats and turns them all into ints,
// distributing the decimal fractions as best as possible.
export function distributeDecimals(floats) {
  // NOTE: I've written this in a very functional way. If we need to make it
  // faster, just rewrite it mutating everything. Not using Decimal would make
  // it quite a bit faster as well

  //turn them all into decimals. Lets try to be accurate
  var values = floats.map(function (x, i) {
    return { index: i, value: new Decimal(x) };
  });
  // NOTE: I need to turn the indexes into strings or it will skip the 0 index!
  var valuesByIndex = _mapValues(_pickBy(values, function (x) {
    return '' + x.index;
  }), function (x) {
    return x.value;
  });

  var results = values.filter(function (x) {
    return x.value.dp() === 0;
  });

  var withFraction = values.filter(function (x) {
    return x.value.dp() > 0;
  });
  var fractionalParts = _map(withFraction, function (x) {
    return { index: x.index, value: x.value.minus(x.value.todp(0, Decimal.ROUND_FLOOR)) };
  });

  var remainder = new Decimal(0);

  var _loop2 = function _loop2() {
    //just get the fractional parts 
    var max = _maxBy(fractionalParts, function (x) {
      return x.value.toNumber();
    });

    var fractionalPartsMinusMax = fractionalParts.filter(function (x) {
      return x.index !== max.index;
    });

    //only deal with min if we don't already have a remainder
    var minValue = new Decimal(0);
    if (remainder.minus(EPSILON).lte(0)) {
      min = fractionalPartsMinusMax.length > 1 ? _minBy(fractionalPartsMinusMax, function (x) {
        return x.value.toNumber();
      }) : fractionalPartsMinusMax[0];

      minValue = min.value;
      // remove the fractional part from the min value, add it to the results
      var newMinValue = valuesByIndex[min.index].todp(0, Decimal.ROUND_FLOOR);
      results = results.concat({ index: min.index, value: newMinValue });
      fractionalParts = _filter(fractionalParts, function (x) {
        return x.index !== min.index;
      });
    }

    // we only want to use up to (1) of the remainder. If the remainder
    // is any larger we want to carry that through.
    var remainderToUse = remainder.minus(1).gt(0) ? new Decimal(1) : remainder;
    remainder = remainder.minus(remainderToUse);

    // now use the fractional part from the min value, and add it to the max value
    var newFractionalMaxValue = _find(fractionalParts, function (x) {
      return x.index === max.index;
    }).value.plus(minValue) // add the fraction part from the min value if we have it
    .plus(remainderToUse); // add any remainder from our last iteration

    if (newFractionalMaxValue.gte(1)) {
      // if that caused the max value to rollover, then keep the remainder,
      // update the results, and remove the max item fron the fractions we are working with
      remainder = remainder.plus(newFractionalMaxValue.minus(1));
      var newMaxValue = valuesByIndex[max.index].todp(0, Decimal.ROUND_CEIL);
      results = results.concat({ index: max.index, value: newMaxValue });
      fractionalParts = _filter(fractionalParts, function (x) {
        return x.index !== max.index;
      });
    } else {
      // otherwise update the max fraction and continue
      fractionalParts = fractionalParts.map(function (x) {
        return x.index === max.index ? { index: max.index, value: newFractionalMaxValue } : x;
      });
    }
  };

  while (fractionalParts.length > 1) {
    var min;

    _loop2();
  }

  if (fractionalParts.length === 1) {
    // We are left with a fractional part (and potentially a remaider) that we couldn't distribute.
    var lastPart = fractionalParts[0];

    var remainderToUse = remainder.minus(1).gt(0) ? new Decimal(1) : remainder;
    remainder = remainder.minus(remainderToUse);

    var checkValue = lastPart.value.plus(remainderToUse);
    if (new Decimal(1).minus(checkValue).lte(EPSILON)) {
      // If it's very close to one, we'll round up the result
      var lastValue = valuesByIndex[lastPart.index].todp(0, Decimal.ROUND_CEIL);
      results = results.concat({ index: lastPart.index, value: lastValue });
    } else {
      // otherwise we'll floor
      var _lastValue = valuesByIndex[lastPart.index].todp(0, Decimal.ROUND_FLOOR);
      results = results.concat({ index: lastPart.index, value: _lastValue });
    }
  }

  return _sortBy(results, function (x) {
    return x.index;
  }).map(function (x) {
    return x.value.toNumber();
  });
}