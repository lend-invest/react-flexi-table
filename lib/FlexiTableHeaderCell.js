'use strict';

exports.__esModule = true;
exports.default = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames2 = require('classnames');

var _classnames3 = _interopRequireDefault(_classnames2);

var _FlexiTableSpacers = require('./FlexiTableSpacers');

var _FlexiTableSpacers2 = _interopRequireDefault(_FlexiTableSpacers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FlexiTableHeaderCell = function (_React$Component) {
  _inherits(FlexiTableHeaderCell, _React$Component);

  function FlexiTableHeaderCell() {
    _classCallCheck(this, FlexiTableHeaderCell);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  FlexiTableHeaderCell.prototype.render = function render() {
    var _classnames;

    var _props = this.props,
        columnNumber = _props.columnNumber,
        _props$column = _props.column,
        columnName = _props$column.name,
        headerComponent = _props$column.headerComponent,
        isFirstColumn = _props.isFirstColumn,
        isLastColumn = _props.isLastColumn,
        isFirstRow = _props.isFirstRow,
        isLastRow = _props.isLastRow,
        halfGutterWidth = _props.halfGutterWidth,
        marginWidth = _props.marginWidth;


    var CellComponent = headerComponent || function () {
      return _react2.default.createElement(
        'span',
        null,
        columnName
      );
    };

    return _react2.default.createElement(
      'div',
      {
        className: (0, _classnames3.default)('FlexiTableHeaderCell--outer', 'FlexiTable--column-num-' + columnNumber, (_classnames = {}, _classnames['FlexiTable--column-' + columnName] = !!columnName, _classnames))
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
          { className: 'FlexiTableHeaderCell FlexiTableCell' },
          _react2.default.createElement(CellComponent, {
            column: this.props.column,
            columnName: columnName,
            columnNumber: columnNumber
          })
        )
      )
    );
  };

  return FlexiTableHeaderCell;
}(_react2.default.Component);

exports.default = FlexiTableHeaderCell;
FlexiTableHeaderCell.propTypes = process.env.NODE_ENV !== "production" ? {
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