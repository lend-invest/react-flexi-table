'use strict';

exports.__esModule = true;
exports.default = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames2 = require('classnames');

var _classnames3 = _interopRequireDefault(_classnames2);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _FlexiTableSpacers = require('./FlexiTableSpacers');

var _FlexiTableSpacers2 = _interopRequireDefault(_FlexiTableSpacers);

var _FlexiTableDefaultCellComponent = require('./FlexiTableDefaultCellComponent');

var _FlexiTableDefaultCellComponent2 = _interopRequireDefault(_FlexiTableDefaultCellComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FlexiTableCell = function (_React$Component) {
  _inherits(FlexiTableCell, _React$Component);

  function FlexiTableCell() {
    var _temp, _this, _ret;

    _classCallCheck(this, FlexiTableCell);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.getCellData = function () {
      var _this$props = _this.props,
          rowData = _this$props.rowData,
          rowNumber = _this$props.rowNumber,
          columnNumber = _this$props.columnNumber,
          _this$props$column = _this$props.column,
          columnName = _this$props$column.columnName,
          cellDataSelector = _this$props$column.cellDataSelector;


      if (!cellDataSelector) {
        // default to the row data if the implementor hasn't provided any row data
        return rowData;
      } else if (typeof cellDataSelector === 'string') {
        return (0, _get3.default)(rowData, cellDataSelector);
      } else if (typeof cellDataSelector === 'function') {
        return cellDataSelector(rowData, rowNumber, columnName, columnNumber, _this.props.column);
      } else {
        throw Error('Unkown cellDataSelector type: ' + cellDataSelector.toString());
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  FlexiTableCell.prototype.render = function render() {
    var _classnames;

    var _props = this.props,
        rowData = _props.rowData,
        rowNumber = _props.rowNumber,
        columnNumber = _props.columnNumber,
        _props$column = _props.column,
        columnName = _props$column.name,
        cellComponent = _props$column.cellComponent,
        cellClassNameSelector = _props$column.cellClassNameSelector,
        isFirstColumn = _props.isFirstColumn,
        isLastColumn = _props.isLastColumn,
        isFirstRow = _props.isFirstRow,
        isLastRow = _props.isLastRow,
        halfGutterWidth = _props.halfGutterWidth,
        marginWidth = _props.marginWidth;


    var cellData = this.getCellData();
    var outerCellClassName = cellClassNameSelector && cellClassNameSelector({
      cellData: cellData,
      rowData: rowData,
      rowNumber: rowNumber,
      columnName: columnName,
      columnNumber: columnNumber,
      column: this.props.column
    });
    var CellComponent = cellComponent || _FlexiTableDefaultCellComponent2.default;

    return _react2.default.createElement(
      'div',
      {
        className: (0, _classnames3.default)('FlexiTableCell--outer', 'FlexiTable--column-num-' + columnNumber, outerCellClassName, (_classnames = {}, _classnames['FlexiTable--column-' + columnName] = !!columnName, _classnames['FlexiTable--row-' + rowNumber] = !!rowNumber, _classnames))
      },
      _react2.default.createElement(
        _FlexiTableSpacers2.default,
        {
          isFirstRow: isFirstRow,
          isLastRow: isLastRow,
          isFirstColumn: isFirstColumn,
          isLastColumn: isLastColumn,
          halfGutterWidth: halfGutterWidth,
          marginWidth: marginWidth
        },
        _react2.default.createElement(
          'div',
          { className: 'FlexiTableBodyCell FlexiTableCell' },
          _react2.default.createElement(CellComponent, {
            cellData: cellData,
            rowNumber: rowNumber,
            rowData: rowData,
            columnName: columnName,
            column: this.props.column,
            columnNumber: columnNumber
          })
        )
      )
    );
  };

  return FlexiTableCell;
}(_react2.default.Component);

exports.default = FlexiTableCell;
FlexiTableCell.propTypes = process.env.NODE_ENV !== "production" ? {
  rowData: _propTypes2.default.any,
  rowNumber: _propTypes2.default.number,
  column: _propTypes2.default.object.isRequired,
  columnNumber: _propTypes2.default.number.isRequired,
  isFirstColumn: _propTypes2.default.bool.isRequired,
  isLastColumn: _propTypes2.default.bool.isRequired,
  isFirstRow: _propTypes2.default.bool.isRequired,
  isLastRow: _propTypes2.default.bool.isRequired,
  halfGutterWidth: _propTypes2.default.number.isRequired,
  marginWidth: _propTypes2.default.number.isRequired
} : {};
module.exports = exports['default'];