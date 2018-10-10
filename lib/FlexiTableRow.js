'use strict';

exports.__esModule = true;
exports.default = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _FlexiTableCell = require('./FlexiTableCell');

var _FlexiTableCell2 = _interopRequireDefault(_FlexiTableCell);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FlexiTableRow = function (_React$Component) {
  _inherits(FlexiTableRow, _React$Component);

  function FlexiTableRow() {
    _classCallCheck(this, FlexiTableRow);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  FlexiTableRow.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
    return this.props.columns !== nextProps.columns || this.props.rowData !== nextProps.rowData || this.props.rowNumber !== nextProps.rowNumber || this.props.isFirstRow !== nextProps.isFirstRow || this.props.isLastRow !== nextProps.isLastRow || this.props.halfGutterWidth !== nextProps.halfGutterWidth || this.props.marginWidth !== nextProps.marginWidth;
  };

  FlexiTableRow.prototype.render = function render() {
    var _props = this.props,
        rowData = _props.rowData,
        columns = _props.columns,
        rowNumber = _props.rowNumber,
        isFirstRow = _props.isFirstRow,
        isLastRow = _props.isLastRow,
        halfGutterWidth = _props.halfGutterWidth,
        marginWidth = _props.marginWidth;


    var cells = columns.map(function (x, i) {
      return _react2.default.createElement(_FlexiTableCell2.default, {
        key: i,
        rowData: rowData,
        column: x,
        rowNumber: rowNumber,
        columnNumber: i,
        isFirstColumn: i === 0,
        isLastColumn: i === columns.length - 1,
        isFirstRow: isFirstRow,
        isLastRow: isLastRow,
        halfGutterWidth: halfGutterWidth,
        marginWidth: marginWidth
      });
    });

    return _react2.default.createElement(
      'div',
      { className: 'FlexiTableBodyRow FlexiTableRow FlexiTableRow--row-number-' + rowNumber },
      cells
    );
  };

  return FlexiTableRow;
}(_react2.default.Component);

exports.default = FlexiTableRow;
FlexiTableRow.propTypes = process.env.NODE_ENV !== "production" ? {
  rowData: _propTypes2.default.any.isRequired,
  columns: _propTypes2.default.array.isRequired,
  rowNumber: _propTypes2.default.number.isRequired,
  isFirstRow: _propTypes2.default.bool.isRequired,
  isLastRow: _propTypes2.default.bool.isRequired,
  halfGutterWidth: _propTypes2.default.number.isRequired,
  marginWidth: _propTypes2.default.number.isRequired
} : {};
module.exports = exports['default'];