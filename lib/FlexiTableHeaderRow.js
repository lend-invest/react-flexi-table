'use strict';

exports.__esModule = true;
exports.default = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _FlexiTableHeaderCell = require('./FlexiTableHeaderCell');

var _FlexiTableHeaderCell2 = _interopRequireDefault(_FlexiTableHeaderCell);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FlexiTableHeaderRow = function (_React$Component) {
  _inherits(FlexiTableHeaderRow, _React$Component);

  function FlexiTableHeaderRow() {
    _classCallCheck(this, FlexiTableHeaderRow);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  FlexiTableHeaderRow.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
    return this.props.columns !== nextProps.columns || this.props.halfGutterWidth !== nextProps.halfGutterWidth || this.props.marginWidth !== nextProps.marginWidth;
  };

  FlexiTableHeaderRow.prototype.render = function render() {
    var _props = this.props,
        columns = _props.columns,
        halfGutterWidth = _props.halfGutterWidth,
        marginWidth = _props.marginWidth;


    var headerCells = columns.map(function (x, i) {
      return _react2.default.createElement(_FlexiTableHeaderCell2.default, {
        key: i,
        column: x,
        columnNumber: i,
        isFirstColumn: i === 0,
        isLastColumn: i === columns.length - 1,
        isFirstRow: true,
        isLastRow: true,
        halfGutterWidth: halfGutterWidth,
        marginWidth: marginWidth
      });
    });

    return _react2.default.createElement(
      'div',
      { className: 'FlexiTableHeaderRow FlexiTableRow' },
      headerCells
    );
  };

  return FlexiTableHeaderRow;
}(_react2.default.Component);

exports.default = FlexiTableHeaderRow;
FlexiTableHeaderRow.propTypes = process.env.NODE_ENV !== "production" ? {
  columns: _propTypes2.default.array.isRequired,
  halfGutterWidth: _propTypes2.default.number.isRequired,
  marginWidth: _propTypes2.default.number.isRequired
} : {};
module.exports = exports['default'];