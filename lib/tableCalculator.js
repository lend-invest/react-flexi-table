'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.buildWidthData = buildWidthData;
exports.calculateRowWidth = calculateRowWidth;
exports.calculateColumnsWidths = calculateColumnsWidths;
exports.distributeDecimals = distributeDecimals;

var _decimal = require('decimal.js-light');

var _decimal2 = _interopRequireDefault(_decimal);

var _find2 = require('lodash/find');

var _find3 = _interopRequireDefault(_find2);

var _map2 = require('lodash/map');

var _map3 = _interopRequireDefault(_map2);

var _max2 = require('lodash/max');

var _max3 = _interopRequireDefault(_max2);

var _maxBy2 = require('lodash/maxBy');

var _maxBy3 = _interopRequireDefault(_maxBy2);

var _minBy2 = require('lodash/minBy');

var _minBy3 = _interopRequireDefault(_minBy2);

var _sum2 = require('lodash/sum');

var _sum3 = _interopRequireDefault(_sum2);

var _sumBy2 = require('lodash/sumBy');

var _sumBy3 = _interopRequireDefault(_sumBy2);

var _sortBy2 = require('lodash/sortBy');

var _sortBy3 = _interopRequireDefault(_sortBy2);

var _keyBy2 = require('lodash/keyBy');

var _keyBy3 = _interopRequireDefault(_keyBy2);

var _pickBy2 = require('lodash/pickBy');

var _pickBy3 = _interopRequireDefault(_pickBy2);

var _filter2 = require('lodash/filter');

var _filter3 = _interopRequireDefault(_filter2);

var _zipObject2 = require('lodash/zipObject');

var _zipObject3 = _interopRequireDefault(_zipObject2);

var _mapValues2 = require('lodash/mapValues');

var _mapValues3 = _interopRequireDefault(_mapValues2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function buildWidthData(columns, getColumnCellWidths) {
  // At this stage I'm just keeping the max cell width we find for each
  // column. It's possible that we could use different strategies in the
  // future though. Standard Deviations or similar
  var columnWidthData = (0, _map3.default)(columns, function (c) {
    var cellWidths = getColumnCellWidths(c.name);
    var maximumContentWidth = (0, _max3.default)(cellWidths);
    // need to add 2 to the max because of the way clientWidth is rounded + browser bugs
    return { name: c.name, contentWidth: maximumContentWidth && maximumContentWidth + 2 };
  });

  return (0, _keyBy3.default)(columnWidthData, 'name');
}

function getFixedWidthColumnWidths(columns) {
  var fixedColumns = columns.filter(function (c) {
    return c.fixedWidth != null;
  });
  var fixedWidths = fixedColumns.map(function (c) {
    return { name: c.name, width: c.fixedWidth };
  });
  return (0, _keyBy3.default)(fixedWidths, 'name');
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
  return (0, _keyBy3.default)(fitWidths, 'name');
}

function findFlexiColumnSizeViolations(proportionalColumnsByName) {
  var minViolations = (0, _pickBy3.default)(proportionalColumnsByName, function (c) {
    return c.minWidth != null && c.width <= c.minWidth;
  });
  var maxViolations = (0, _pickBy3.default)(proportionalColumnsByName, function (c) {
    return c.maxWidth != null && c.width >= c.maxWidth;
  });

  return (0, _map3.default)(minViolations, function (c) {
    return { column: c, diff: c.minWidth - c.width };
  }).concat((0, _map3.default)(maxViolations, function (c) {
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
  return (0, _keyBy3.default)(fixed, function (x) {
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

  var remainingProportionalWidth = (0, _sumBy3.default)(proportionalColumns, function (x) {
    return x.width;
  });
  var proportionalByName = (0, _keyBy3.default)(proportionalColumns, function (x) {
    return x.name;
  });
  var removedByName = {};

  // We have to loop while we have a min or max we enforced.
  // Enforcing a min or max will change all the other column widths, which can
  // cause other columns to now be under min or over max.

  var _loop = function _loop() {
    var removedWidth = (0, _sum3.default)((0, _map3.default)(removedByName, function (x) {
      return x.width;
    })) || 0;
    remainingWidth -= removedWidth;
    proportionalByName = (0, _pickBy3.default)(proportionalByName, function (c) {
      return !removedByName[c.name];
    });
    remainingProportionalWidth = (0, _sum3.default)((0, _map3.default)(proportionalByName, function (x) {
      return x.width;
    }));
    proportionalByName = (0, _mapValues3.default)(proportionalByName, function (c) {
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
    var largestDiff = (0, _maxBy3.default)(restrictionViolations, function (x) {
      return x.diff;
    }).diff;
    var allLargest = (0, _filter3.default)(restrictionViolations, function (x) {
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
  var calculatedWidths = (0, _map3.default)(proportionalByName, function (v, k) {
    return { name: k, width: v.width };
  });
  var distributedWidths = distributeDecimals(calculatedWidths.map(function (x) {
    return x.width;
  }));
  var zippedWidths = (0, _zipObject3.default)(calculatedWidths.map(function (x) {
    return x.name;
  }), distributedWidths);
  var finalFlexiColumns = (0, _mapValues3.default)(zippedWidths, function (v, k) {
    return { name: k, width: v };
  });

  return _extends({}, completedByName, finalFlexiColumns);
}

function calculateRowWidth(columnsWidths, marginWidth, halfGutterWidth) {
  var columnsAndGutterWidths = marginWidth * 2 + (columnsWidths.length - 1) * halfGutterWidth * 2;

  var totalColumnWidth = (0, _sum3.default)(columnsWidths);
  return columnsAndGutterWidths + totalColumnWidth;
}

// This should be called during init after we have called gatherWidthData,
// or anytime the table has been resized
function calculateColumnsWidths(columns, gatheredWidths, marginWidth, halfGutterWidth, tableElementWidth) {

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
  var remainingWidth = tableElementWidth - (columnsAndGutterWidths + (0, _sum3.default)((0, _map3.default)(completedWidths, function (x) {
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

  return (0, _mapValues3.default)(completedWidths, function (c) {
    return c.width;
  });
}

var EPSILON = new _decimal2.default('0.001');

// This function takes an array of floats and turns them all into ints,
// distributing the decimal fractions as best as possible.
function distributeDecimals(floats) {
  // NOTE: I've written this in a very functional way. If we need to make it
  // faster, just rewrite it mutating everything. Not using Decimal would make
  // it quite a bit faster as well

  //turn them all into decimals. Lets try to be accurate
  var values = floats.map(function (x, i) {
    return { index: i, value: new _decimal2.default(x) };
  });
  // NOTE: I need to turn the indexes into strings or it will skip the 0 index!
  var valuesByIndex = (0, _mapValues3.default)((0, _pickBy3.default)(values, function (x) {
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
  var fractionalParts = (0, _map3.default)(withFraction, function (x) {
    return { index: x.index, value: x.value.minus(x.value.todp(0, _decimal2.default.ROUND_FLOOR)) };
  });

  var remainder = new _decimal2.default(0);

  var _loop2 = function _loop2() {
    //just get the fractional parts 
    var max = (0, _maxBy3.default)(fractionalParts, function (x) {
      return x.value.toNumber();
    });

    var fractionalPartsMinusMax = fractionalParts.filter(function (x) {
      return x.index !== max.index;
    });

    //only deal with min if we don't already have a remainder
    var minValue = new _decimal2.default(0);
    if (remainder.minus(EPSILON).lte(0)) {
      min = fractionalPartsMinusMax.length > 1 ? (0, _minBy3.default)(fractionalPartsMinusMax, function (x) {
        return x.value.toNumber();
      }) : fractionalPartsMinusMax[0];

      minValue = min.value;
      // remove the fractional part from the min value, add it to the results
      var newMinValue = valuesByIndex[min.index].todp(0, _decimal2.default.ROUND_FLOOR);
      results = results.concat({ index: min.index, value: newMinValue });
      fractionalParts = (0, _filter3.default)(fractionalParts, function (x) {
        return x.index !== min.index;
      });
    }

    // we only want to use up to (1) of the remainder. If the remainder
    // is any larger we want to carry that through.
    var remainderToUse = remainder.minus(1).gt(0) ? new _decimal2.default(1) : remainder;
    remainder = remainder.minus(remainderToUse);

    // now use the fractional part from the min value, and add it to the max value
    var newFractionalMaxValue = (0, _find3.default)(fractionalParts, function (x) {
      return x.index === max.index;
    }).value.plus(minValue) // add the fraction part from the min value if we have it
    .plus(remainderToUse); // add any remainder from our last iteration

    if (newFractionalMaxValue.gte(1)) {
      // if that caused the max value to rollover, then keep the remainder,
      // update the results, and remove the max item fron the fractions we are working with
      remainder = remainder.plus(newFractionalMaxValue.minus(1));
      var newMaxValue = valuesByIndex[max.index].todp(0, _decimal2.default.ROUND_CEIL);
      results = results.concat({ index: max.index, value: newMaxValue });
      fractionalParts = (0, _filter3.default)(fractionalParts, function (x) {
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

    var remainderToUse = remainder.minus(1).gt(0) ? new _decimal2.default(1) : remainder;
    remainder = remainder.minus(remainderToUse);

    var checkValue = lastPart.value.plus(remainderToUse);
    if (new _decimal2.default(1).minus(checkValue).lte(EPSILON)) {
      // If it's very close to one, we'll round up the result
      var lastValue = valuesByIndex[lastPart.index].todp(0, _decimal2.default.ROUND_CEIL);
      results = results.concat({ index: lastPart.index, value: lastValue });
    } else {
      // otherwise we'll floor
      var _lastValue = valuesByIndex[lastPart.index].todp(0, _decimal2.default.ROUND_FLOOR);
      results = results.concat({ index: lastPart.index, value: _lastValue });
    }
  }

  return (0, _sortBy3.default)(results, function (x) {
    return x.index;
  }).map(function (x) {
    return x.value.toNumber();
  });
}