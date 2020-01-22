var _class, _temp;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
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

      var rowWidth = calculateRowWidth(columnsWithWidths.map(function (x) {
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
      var result = _map(cells, function (x) {
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

      var overflowX = rowWidth != null && _this.state.measuredTableWidth != null && _this.state.measuredTableWidth < rowWidth;
      var overflowStyle = overflowX ? { overflowX: 'scroll' } : {};

      var measureModeStyle = {};
      if (isInMeasureMode && _this.tableRef) {
        // The height shouldn't shrink when we switch to measure-mode,
        // otherwise it can mess with the scroll position on the page
        // if the table is near the bottom
        measureModeStyle.minHeight = _this.tableRef.clientHeight;
      }

      return React.createElement(
        Measure,
        {
          bounds: true,
          onResize: _this.handleResize
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
                  _this.tableRef = el;
                },
                style: overflowStyle
              },
              React.createElement(
                'div',
                {
                  className: classnames('FlexiTable', 'FlexiTable-' + _this.uuid, {
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

  FlexiTable.prototype.UNSAFE_componentWillReceiveProps = function UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.columns !== nextProps.columns || this.props.halfGutterWidth !== nextProps.halfGutterWidth || this.props.marginWidth !== nextProps.marginWidth || this.props.rowLimit !== nextProps.rowLimit) {
      // columns have changed, we need to re-gather widths and recalculate
      this.setStartState();
    } else if (this.props.data !== nextProps.data) {
      // data has changed, we need to re-gather widths and recalculate
      this.setStartState();
    }
  };

  FlexiTable.prototype.UNSAFE_componentWillUpdate = function UNSAFE_componentWillUpdate(nextProps, nextState) {
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
      var gatheredWidthData = buildWidthData(dynamicColumns, this.getColumnCellWidths);
      this.setState({
        hasMeasuredTestColumns: true,
        hasCalculatedFlexColumns: false,
        gatheredWidthData: gatheredWidthData
      });
    } else if (hasMeasuredTestColumns && !hasCalculatedFlexColumns) {
      var tableWidth = this.tableRef.clientWidth;
      var calcColumnWidths = calculateColumnsWidths(this.props.columns, this.state.gatheredWidthData, this.props.marginWidth, this.props.halfGutterWidth, tableWidth);

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
}(React.Component), _class.defaultProps = {
  halfGutterWidth: 25,
  marginWidth: 20
}, _temp);
export { FlexiTable as default };
FlexiTable.propTypes = process.env.NODE_ENV !== "production" ? {
  columns: PropTypes.array,
  data: PropTypes.array,
  halfGutterWidth: PropTypes.number,
  marginWidth: PropTypes.number,
  rowLimit: PropTypes.number
} : {};