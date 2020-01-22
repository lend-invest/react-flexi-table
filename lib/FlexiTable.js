'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _map2 = require('lodash/map');

var _map3 = _interopRequireDefault(_map2);

var _take2 = require('lodash/take');

var _take3 = _interopRequireDefault(_take2);

var _isNumber2 = require('lodash/isNumber');

var _isNumber3 = _interopRequireDefault(_isNumber2);

var _reactMeasure = require('react-measure');

var _reactMeasure2 = _interopRequireDefault(_reactMeasure);

var _FlexiTableRow = require('./FlexiTableRow');

var _FlexiTableRow2 = _interopRequireDefault(_FlexiTableRow);

var _FlexiTableHeaderRow = require('./FlexiTableHeaderRow');

var _FlexiTableHeaderRow2 = _interopRequireDefault(_FlexiTableHeaderRow);

var _tableCalculator = require('./tableCalculator');

require('./FlexiTable.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function generateUuid() {
  // https://gist.github.com/jed/982883
  return function b(a) {
    return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, b);
  }();
}

var FlexiTable = function FlexiTable(props) {
  var uuid = generateUuid();
  var columns = props.columns;

  var _useState = (0, _react.useState)(false),
      hasRenderedTestFlexColumns = _useState[0],
      setHasRenderedTestFlexColumns = _useState[1];

  var _useState2 = (0, _react.useState)(false),
      hasMeasuredTestColumns = _useState2[0],
      setHasMeasuredTestColumns = _useState2[1];

  var _useState3 = (0, _react.useState)(false),
      hasCalculatedFlexColumns = _useState3[0],
      setHasCalculatedFlexColumns = _useState3[1];

  var _useState4 = (0, _react.useState)(null),
      calcColumnWidths = _useState4[0],
      setCalcColumnWidths = _useState4[1];

  var _useState5 = (0, _react.useState)(null),
      gatheredWidthData = _useState5[0],
      setGatheredWidthData = _useState5[1];

  var _useState6 = (0, _react.useState)(null),
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

    var rowWidth = (0, _tableCalculator.calculateRowWidth)(columnsWithWidths.map(function (x) {
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
    var cellSelector = '.FlexiTable-' + undefined.uuid + ' .FlexiTable--column-' + columnName + ' .FlexiTableCell';
    var cells = tableRef.querySelectorAll(cellSelector);
    var result = (0, _map3.default)(cells, function (x) {
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


    var headerRow = _react2.default.createElement(_FlexiTableHeaderRow2.default, {
      columns: columns,
      halfGutterWidth: halfGutterWidth,
      marginWidth: marginWidth
    });

    var limitedData = data || [];
    if ((0, _isNumber3.default)(rowLimit)) {
      limitedData = (0, _take3.default)(data, rowLimit);
    }

    var rows = limitedData.map(function (x, i) {
      return _react2.default.createElement(_FlexiTableRow2.default, {
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
      rowWidth = (0, _tableCalculator.calculateRowWidth)(columnsWidths, marginWidth, halfGutterWidth);
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

    return _react2.default.createElement(
      _reactMeasure2.default,
      {
        bounds: true,
        onResize: handleResize
      },
      function (_ref) {
        var measureRef = _ref.measureRef;
        return _react2.default.createElement(
          'div',
          { ref: measureRef, className: className },
          _react2.default.createElement(
            'div',
            {
              className: (0, _classnames2.default)('FlexiTable--outer-box', {
                'FlexiTable--border-box': overflowX
              }),
              ref: function ref(el) {
                tableRef = el;
              },
              style: overflowStyle
            },
            _react2.default.createElement(
              'div',
              {
                className: (0, _classnames2.default)('FlexiTable', 'FlexiTable-' + uuid, {
                  'FlexiTable--measure-mode': isInMeasureMode,
                  'FlexiTable--border-box': !overflowX
                }),
                style: measureModeStyle
              },
              _react2.default.createElement(
                'div',
                { className: 'FlexiTable--header' },
                headerRow
              ),
              _react2.default.createElement(
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
  (0, _react.useEffect)(function () {
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
  (0, _react.useEffect)(function () {
    setStartState();
  }, [props.columns, props.halfGutterWidth, props.marginWidth, props.rowLimit, props.data]);

  // componentWillUpdate
  (0, _react.useEffect)(function () {
    updateSizeStyles(calcColumnWidths);
  }, [calcColumnWidths, hasCalculatedFlexColumns]);

  // componentDidUpdate
  (0, _react.useEffect)(function () {

    if (tableRef && !hasRenderedTestFlexColumns) {
      setStartState();
    } else if (hasRenderedTestFlexColumns && !hasMeasuredTestColumns) {
      var dynamicColumns = props.columns.filter(function (x) {
        return x.fixedWidth == null;
      });
      var _gatheredWidthData = (0, _tableCalculator.buildWidthData)(dynamicColumns, getColumnCellWidths);
      setHasRenderedTestFlexColumns(true);
      setHasCalculatedFlexColumns(false);
      setGatheredWidthData(_gatheredWidthData);
    } else if (hasMeasuredTestColumns && !hasCalculatedFlexColumns) {
      var tableWidth = tableRef.clientWidth;
      var _calcColumnWidths = (0, _tableCalculator.calculateColumnsWidths)(props.columns, gatheredWidthData, props.marginWidth, props.halfGutterWidth, tableWidth);

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
  columns: _propTypes2.default.array,
  data: _propTypes2.default.array,
  halfGutterWidth: _propTypes2.default.number,
  marginWidth: _propTypes2.default.number,
  rowLimit: _propTypes2.default.number
} : {};

exports.default = FlexiTable;
module.exports = exports['default'];