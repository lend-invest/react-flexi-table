var _this = this;

import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import _map from 'lodash/map';
import _take from 'lodash/take';
import _isNumber from 'lodash/isNumber';
import Measure from 'react-measure';
import FlexiTableRow from './FlexiTableRow';
import FlexiTableHeaderRow from './FlexiTableHeaderRow';
import { buildWidthData, calculateColumnsWidths, calculateRowWidth } from './tableCalculator';
import './FlexiTable.scss';

function generateUuid() {
  // https://gist.github.com/jed/982883
  return function b(a) {
    return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, b);
  }();
}

var FlexiTable = function FlexiTable(props) {
  var uuid = generateUuid();

  var _useState = useState(false),
      hasRenderedTestFlexColumns = _useState[0],
      setHasRenderedTestFlexColumns = _useState[1];

  var _useState2 = useState(false),
      hasMeasuredTestColumns = _useState2[0],
      setHasMeasuredTestColumns = _useState2[1];

  var _useState3 = useState(false),
      hasCalculatedFlexColumns = _useState3[0],
      setHasCalculatedFlexColumns = _useState3[1];

  var _useState4 = useState(null),
      calcColumnWidths = _useState4[0],
      setCalcColumnWidths = _useState4[1];

  var _useState5 = useState(null),
      gatheredWidthData = _useState5[0],
      setGatheredWidthData = _useState5[1];

  var _useState6 = useState(null),
      measuredTableWidth = _useState6[0],
      setMeasuredTableWidth = _useState6[1];

  var tableStyle = void 0;
  var tableRef = void 0;

  var clearSizeStyles = function clearSizeStyles() {
    if (tableStyle) {
      tableStyle.innerText = '';
    }
  };

  var setStartState = function setStartState() {
    clearSizeStyles();
    var dynamicColumns = props.columns.filter(function (x) {
      return x.fixedWidth == null;
    });

    //if all the columns have a fixed width, then don't bother calculating
    if (dynamicColumns.length === 0) {
      setHasRenderedTestFlexColumns(true);
      setHasMeasuredTestColumns(true);
      setHasCalculatedFlexColumns(true);
    } else {
      setHasRenderedTestFlexColumns(true);
      setHasMeasuredTestColumns(false);
      setHasCalculatedFlexColumns(false);
    }
  };

  var updateSizeStyles = function updateSizeStyles(calcColumnWidths) {
    clearSizeStyles();
    var columns = props.columns,
        marginWidth = props.marginWidth,
        halfGutterWidth = props.halfGutterWidth;

    // extend the column data with our calculated widths

    var columnsWithWidths = columns.map(function (c) {
      return {
        name: c.name,
        width: calcColumnWidths && calcColumnWidths[c.name] || c.fixedWidth
      };
    });

    var rowWidth = calculateRowWidth(columnsWithWidths.map(function (x) {
      return x.width;
    }), marginWidth, halfGutterWidth);

    var styles = '.FlexiTable-' + uuid + ' .FlexiTableRow { min-width: ' + rowWidth + 'px; max-width: ' + rowWidth + 'px; width: ' + rowWidth + 'px;}';
    columnsWithWidths.forEach(function (c) {
      styles += ' .FlexiTable-' + uuid + ' .FlexiTable--column-' + c.name + ' .FlexiTableCell { min-width: ' + c.width + 'px; max-width: ' + c.width + 'px; width: ' + c.width + 'px;}';
    });
    tableStyle.innerText = styles;
  };

  var getColumnCellWidths = function getColumnCellWidths(columnName) {
    // Unless the user has set some odd styles the flex styles when
    // isInMeasureMode = true should have caused each cell to grow to the
    // maximum width. Now we just need to go through them all and collect
    // the data.
    var cellSelector = '.FlexiTable-' + _this.uuid + ' .FlexiTable--column-' + columnName + ' .FlexiTableCell';
    var cells = tableRef.querySelectorAll(cellSelector);
    var result = _map(cells, function (x) {
      return x.scrollWidth;
    });
    return result;
  };

  var handleResize = function handleResize(contentRect) {
    if (!hasCalculatedFlexColumns) {
      //ignore the change if we haven't yet calcluated the flex columns, it's to be expected

    } else if (contentRect.bounds.width !== measuredTableWidth) {
      // we need to recalculate columns
      setHasCalculatedFlexColumns(false);
    }
  };

  var renderContents = function renderContents(columns, isInMeasureMode) {
    var data = props.data,
        rowLimit = props.rowLimit,
        halfGutterWidth = props.halfGutterWidth,
        marginWidth = props.marginWidth,
        className = props.className;


    var headerRow = React.createElement(FlexiTableHeaderRow, {
      columns: columns,
      halfGutterWidth: halfGutterWidth,
      marginWidth: marginWidth
    });

    var limitedData = data || [];
    if (_isNumber(rowLimit)) {
      limitedData = _take(data, rowLimit);
    }

    var rows = limitedData.map(function (x, i) {
      return React.createElement(FlexiTableRow, {
        key: i,
        rowData: x,
        columns: columns,
        rowNumber: i,
        isFirstRow: i === 0,
        isLastRow: i === data.length - 1,
        halfGutterWidth: halfGutterWidth,
        marginWidth: marginWidth
      });
    });

    // Manually handle overflow based on our own measurements
    // Note: We switch the outer-box class based on the overflow. It's the
    // only way I could figure to have the border look correct both during
    // overflow due to min-widths and underflow due to max-width restrictions
    var rowWidth = null;
    if (!isInMeasureMode && calcColumnWidths) {
      // extend the column data with our calculated widths
      var columnsWidths = columns.map(function (c) {
        return calcColumnWidths[c.name] || c.fixedWidth;
      });
      rowWidth = calculateRowWidth(columnsWidths, marginWidth, halfGutterWidth);
    }

    var overflowX = rowWidth != null && measuredTableWidth != null && measuredTableWidth < rowWidth;
    var overflowStyle = overflowX ? { overflowX: 'scroll' } : {};

    var measureModeStyle = {};
    if (isInMeasureMode && tableRef) {
      // The height shouldn't shrink when we switch to measure-mode,
      // otherwise it can mess with the scroll position on the page
      // if the table is near the bottom
      measureModeStyle.minHeight = tableRef.clientHeight;
    }

    return React.createElement(
      Measure,
      {
        bounds: true,
        onResize: handleResize
      },
      function (_ref) {
        var measureRef = _ref.measureRef;
        return React.createElement(
          'div',
          { ref: measureRef, className: className },
          React.createElement(
            'div',
            {
              className: classnames('FlexiTable--outer-box', {
                'FlexiTable--border-box': overflowX
              }),
              ref: function ref(el) {
                tableRef = el;
              },
              style: overflowStyle
            },
            React.createElement(
              'div',
              {
                className: classnames('FlexiTable', 'FlexiTable-' + uuid, {
                  'FlexiTable--measure-mode': isInMeasureMode,
                  'FlexiTable--border-box': !overflowX
                }),
                style: measureModeStyle
              },
              React.createElement(
                'div',
                { className: 'FlexiTable--header' },
                headerRow
              ),
              React.createElement(
                'div',
                { className: 'FlexiTable--body' },
                rows
              )
            )
          )
        );
      }
    );
  };

  // componentDidMount
  useEffect(function () {
    tableStyle = document.createElement('style');
    document.head.appendChild(tableStyle);
    if (tableRef) {
      setStartState();
    }

    return function () {
      if (tableStyle) {
        document.head.removeChild(tableStyle);
      }
    };
  }, []);

  // componentWillReceiveProps
  useEffect(function () {
    setStartState();
  }, [props.columns, props.halfGutterWidth, props.marginWidth, props.rowLimit, props.data]);

  // componentWillUpdate
  useEffect(function () {
    updateSizeStyles(calcColumnWidths);
  }, [calcColumnWidths, hasCalculatedFlexColumns]);

  // componentDidUpdate
  useEffect(function () {

    if (tableRef && !hasRenderedTestFlexColumns) {
      setStartState();
    } else if (hasRenderedTestFlexColumns && !hasMeasuredTestColumns) {
      var dynamicColumns = props.columns.filter(function (x) {
        return x.fixedWidth == null;
      });
      var _gatheredWidthData = buildWidthData(dynamicColumns, getColumnCellWidths);
      setHasRenderedTestFlexColumns(true);
      setHasCalculatedFlexColumns(false);
      setGatheredWidthData(_gatheredWidthData);
    } else if (hasMeasuredTestColumns && !hasCalculatedFlexColumns) {
      var tableWidth = tableRef.clientWidth;
      var _calcColumnWidths = calculateColumnsWidths(props.columns, gatheredWidthData, props.marginWidth, props.halfGutterWidth, tableWidth);

      setHasCalculatedFlexColumns(true);
      setCalcColumnWidths(_calcColumnWidths);
      setMeasuredTableWidth(tableWidth);
    }
  }, [columns]);

  if (!hasRenderedTestFlexColumns || !hasMeasuredTestColumns) {
    //render in a measure mode to calculate columns
    var dynamicColumns = columns.filter(function (x) {
      return x.fixedWidth == null;
    });
    //if all columns are a fixed size, we don't need to do a measure render
    if (dynamicColumns.length) {
      return renderContents(dynamicColumns, true);
    }
  }

  return renderContents(columns, false);
};

FlexiTable.defaultProps = {
  halfGutterWidth: 25,
  marginWidth: 20
};

FlexiTable.propTypes = process.env.NODE_ENV !== "production" ? {
  columns: PropTypes.array,
  data: PropTypes.array,
  halfGutterWidth: PropTypes.number,
  marginWidth: PropTypes.number,
  rowLimit: PropTypes.number
} : {};

export default FlexiTable;