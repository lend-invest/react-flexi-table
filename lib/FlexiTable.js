'use strict';

exports.__esModule = true;
exports.default = undefined;

var _class, _temp;

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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function generateUuid() {
  // https://gist.github.com/jed/982883
  return function b(a) {
    return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, b);
  }();
}

var FlexiTable = (_temp = _class = function (_React$Component) {
  _inherits(FlexiTable, _React$Component);

  function FlexiTable(props) {
    _classCallCheck(this, FlexiTable);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.clearSizeStyles = function () {
      if (_this.tableStyle) {
        _this.tableStyle.innerText = '';
      }
    };

    _this.updateSizeStyles = function (calcColumnWidths) {
      _this.clearSizeStyles();
      var _this$props = _this.props,
          columns = _this$props.columns,
          marginWidth = _this$props.marginWidth,
          halfGutterWidth = _this$props.halfGutterWidth;

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

      var styles = '.FlexiTable-' + _this.uuid + ' .FlexiTableRow { min-width: ' + rowWidth + 'px; max-width: ' + rowWidth + 'px; width: ' + rowWidth + 'px;}';
      columnsWithWidths.forEach(function (c) {
        styles += ' .FlexiTable-' + _this.uuid + ' .FlexiTable--column-' + c.name + ' .FlexiTableCell { min-width: ' + c.width + 'px; max-width: ' + c.width + 'px; width: ' + c.width + 'px;}';
      });
      _this.tableStyle.innerText = styles;
    };

    _this.setStartState = function () {
      _this.clearSizeStyles();
      var dynamicColumns = _this.props.columns.filter(function (x) {
        return x.fixedWidth == null;
      });

      //if all the columns have a fixed width, then don't bother calculating
      if (dynamicColumns.length === 0) {
        _this.setState({
          hasRenderedTestFlexColumns: true,
          hasMeasuredTestColumns: true,
          hasCalculatedFlexColumns: true
        });
      } else {
        _this.setState({
          hasRenderedTestFlexColumns: true,
          hasMeasuredTestColumns: false,
          hasCalculatedFlexColumns: false
        });
      }
    };

    _this.handleResize = function (contentRect) {
      if (!_this.state.hasCalculatedFlexColumns) {
        //ignore the change if we haven't yet calcluated the flex columns, it's to be expected

      } else if (contentRect.bounds.width !== _this.state.measuredTableWidth) {
        // we need to recalculate columns
        _this.setState({
          hasCalculatedFlexColumns: false
        });
      }
    };

    _this.getColumnCellWidths = function (columnName) {
      // Unless the user has set some odd styles the flex styles when
      // isInMeasureMode = true should have caused each cell to grow to the
      // maximum width. Now we just need to go through them all and collect
      // the data.
      var cellSelector = '.FlexiTable-' + _this.uuid + ' .FlexiTable--column-' + columnName + ' .FlexiTableCell';
      var cells = _this.tableRef.querySelectorAll(cellSelector);
      var result = (0, _map3.default)(cells, function (x) {
        return x.scrollWidth;
      });
      return result;
    };

    _this.renderContents = function (columns, isInMeasureMode) {
      var _this$props2 = _this.props,
          data = _this$props2.data,
          rowLimit = _this$props2.rowLimit,
          halfGutterWidth = _this$props2.halfGutterWidth,
          marginWidth = _this$props2.marginWidth,
          className = _this$props2.className;
      var calcColumnWidths = _this.state.calcColumnWidths;


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

      var overflowX = rowWidth != null && _this.state.measuredTableWidth != null && _this.state.measuredTableWidth < rowWidth;
      var overflowStyle = overflowX ? { overflowX: 'scroll' } : {};

      var measureModeStyle = {};
      if (isInMeasureMode && _this.tableRef) {
        // The height shouldn't shrink when we switch to measure-mode,
        // otherwise it can mess with the scroll position on the page
        // if the table is near the bottom
        measureModeStyle.minHeight = _this.tableRef.clientHeight;
      }

      return _react2.default.createElement(
        _reactMeasure2.default,
        {
          bounds: true,
          onResize: _this.handleResize
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
                  _this.tableRef = el;
                },
                style: overflowStyle
              },
              _react2.default.createElement(
                'div',
                {
                  className: (0, _classnames2.default)('FlexiTable', 'FlexiTable-' + _this.uuid, {
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

    _this.uuid = generateUuid();
    _this.state = {
      hasRenderedTestFlexColumns: false,
      hasMeasuredTestColumns: false,
      hasCalculatedFlexColumns: false,
      calcColumnWidths: null
    };
    return _this;
  }

  FlexiTable.prototype.componentDidMount = function componentDidMount() {
    this.tableStyle = document.createElement('style');
    document.head.appendChild(this.tableStyle);

    if (this.tableRef) {
      this.setStartState();
    }
  };

  FlexiTable.prototype.componentWillUnmount = function componentWillUnmount() {
    if (this.tableStyle) {
      document.head.removeChild(this.tableStyle);
    }
  };

  // Note: rather than passing widths down to each react component when we
  // change the calculated widths we just update a stylesheet. This has a
  // big perf improvement becuase react doesn't need to re-render every
  // cell.

  FlexiTable.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    if (this.props.columns !== nextProps.columns || this.props.halfGutterWidth !== nextProps.halfGutterWidth || this.props.marginWidth !== nextProps.marginWidth || this.props.rowLimit !== nextProps.rowLimit) {
      // columns have changed, we need to re-gather widths and recalculate
      this.setStartState();
    } else if (this.props.data !== nextProps.data) {
      // data has changed, we need to re-gather widths and recalculate
      this.setStartState();
    }
  };

  FlexiTable.prototype.componentWillUpdate = function componentWillUpdate(nextProps, nextState) {
    if (!this.state.hasCalculatedFlexColumns && nextState.hasCalculatedFlexColumns) {
      // if we just calculated the column widths, update them
      this.updateSizeStyles(nextState.calcColumnWidths);
    }
  };

  FlexiTable.prototype.componentDidUpdate = function componentDidUpdate() {
    var _state = this.state,
        hasRenderedTestFlexColumns = _state.hasRenderedTestFlexColumns,
        hasMeasuredTestColumns = _state.hasMeasuredTestColumns,
        hasCalculatedFlexColumns = _state.hasCalculatedFlexColumns;


    if (this.tableRef && !hasRenderedTestFlexColumns) {
      this.setStartState();
    } else if (hasRenderedTestFlexColumns && !hasMeasuredTestColumns) {
      var dynamicColumns = this.props.columns.filter(function (x) {
        return x.fixedWidth == null;
      });
      var gatheredWidthData = (0, _tableCalculator.buildWidthData)(dynamicColumns, this.getColumnCellWidths);
      this.setState({
        hasMeasuredTestColumns: true,
        hasCalculatedFlexColumns: false,
        gatheredWidthData: gatheredWidthData
      });
    } else if (hasMeasuredTestColumns && !hasCalculatedFlexColumns) {
      var tableWidth = this.tableRef.clientWidth;
      var calcColumnWidths = (0, _tableCalculator.calculateColumnsWidths)(this.props.columns, this.state.gatheredWidthData, this.props.marginWidth, this.props.halfGutterWidth, tableWidth);

      this.setState({
        hasCalculatedFlexColumns: true,
        calcColumnWidths: calcColumnWidths,
        measuredTableWidth: tableWidth
      });
    }
  };

  FlexiTable.prototype.render = function render() {
    var columns = this.props.columns;


    if (!this.state.hasRenderedTestFlexColumns || !this.state.hasMeasuredTestColumns) {
      //render in a measure mode to calculate columns
      var dynamicColumns = columns.filter(function (x) {
        return x.fixedWidth == null;
      });
      //if all columns are a fixed size, we don't need to do a measure render
      if (dynamicColumns.length) {
        return this.renderContents(dynamicColumns, true);
      }
    }

    return this.renderContents(columns, false);
  };

  return FlexiTable;
}(_react2.default.Component), _class.defaultProps = {
  halfGutterWidth: 25,
  marginWidth: 20
}, _temp);
exports.default = FlexiTable;
FlexiTable.propTypes = process.env.NODE_ENV !== "production" ? {
  columns: _propTypes2.default.array,
  data: _propTypes2.default.array,
  halfGutterWidth: _propTypes2.default.number,
  marginWidth: _propTypes2.default.number,
  rowLimit: _propTypes2.default.number
} : {};
module.exports = exports['default'];