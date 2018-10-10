'use strict';

exports.__esModule = true;
exports.default = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FlexiTableRowVSpace = function (_React$Component) {
  _inherits(FlexiTableRowVSpace, _React$Component);

  function FlexiTableRowVSpace() {
    _classCallCheck(this, FlexiTableRowVSpace);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  FlexiTableRowVSpace.prototype.render = function render() {
    return _react2.default.createElement('div', { className: 'FlexiTableRowVSpace FlexiTableRowVSpace--edge-' + this.props.edge });
  };

  return FlexiTableRowVSpace;
}(_react2.default.Component);

FlexiTableRowVSpace.propTypes = process.env.NODE_ENV !== "production" ? {
  edge: _propTypes2.default.string
} : {};

var FlexiTableSectionVSpace = function (_React$Component2) {
  _inherits(FlexiTableSectionVSpace, _React$Component2);

  function FlexiTableSectionVSpace() {
    _classCallCheck(this, FlexiTableSectionVSpace);

    return _possibleConstructorReturn(this, _React$Component2.apply(this, arguments));
  }

  FlexiTableSectionVSpace.prototype.render = function render() {
    return _react2.default.createElement('div', { className: 'FlexiTableSectionVSpace FlexiTableSectionVSpace--edge-' + this.props.edge });
  };

  return FlexiTableSectionVSpace;
}(_react2.default.Component);

FlexiTableSectionVSpace.propTypes = process.env.NODE_ENV !== "production" ? {
  edge: _propTypes2.default.string
} : {};

var FlexiTableColumnGutter = function (_React$Component3) {
  _inherits(FlexiTableColumnGutter, _React$Component3);

  function FlexiTableColumnGutter() {
    _classCallCheck(this, FlexiTableColumnGutter);

    return _possibleConstructorReturn(this, _React$Component3.apply(this, arguments));
  }

  FlexiTableColumnGutter.prototype.render = function render() {
    var _props = this.props,
        side = _props.side,
        width = _props.width;


    var style = {
      width: width,
      minWidth: width,
      maxWidth: width
    };

    return _react2.default.createElement('div', {
      className: 'FlexiTableColumnGutter FlexiTableColumnGutter--side-' + side,
      style: style
    });
  };

  return FlexiTableColumnGutter;
}(_react2.default.Component);

FlexiTableColumnGutter.propTypes = process.env.NODE_ENV !== "production" ? {
  side: _propTypes2.default.string.isRequired,
  width: _propTypes2.default.number.isRequired
} : {};

var FlexiTableColumnMargin = function (_React$Component4) {
  _inherits(FlexiTableColumnMargin, _React$Component4);

  function FlexiTableColumnMargin() {
    _classCallCheck(this, FlexiTableColumnMargin);

    return _possibleConstructorReturn(this, _React$Component4.apply(this, arguments));
  }

  FlexiTableColumnMargin.prototype.render = function render() {
    var _props2 = this.props,
        side = _props2.side,
        width = _props2.width;


    var style = {
      width: width,
      minWidth: width,
      maxWidth: width
    };

    return _react2.default.createElement('div', {
      className: 'FlexiTableColumnMargin FlexiTableColumnMargin--side-' + side,
      style: style
    });
  };

  return FlexiTableColumnMargin;
}(_react2.default.Component);

FlexiTableColumnMargin.propTypes = process.env.NODE_ENV !== "production" ? {
  side: _propTypes2.default.string.isRequired,
  width: _propTypes2.default.number.isRequired
} : {};

var FlexiTableCellSpacer = function (_React$Component5) {
  _inherits(FlexiTableCellSpacer, _React$Component5);

  function FlexiTableCellSpacer() {
    _classCallCheck(this, FlexiTableCellSpacer);

    return _possibleConstructorReturn(this, _React$Component5.apply(this, arguments));
  }

  FlexiTableCellSpacer.prototype.render = function render() {
    var _props3 = this.props,
        isFirstColumn = _props3.isFirstColumn,
        isLastColumn = _props3.isLastColumn,
        isFirstRow = _props3.isFirstRow,
        isLastRow = _props3.isLastRow,
        halfGutterWidth = _props3.halfGutterWidth,
        marginWidth = _props3.marginWidth;


    var topSpace = isFirstRow ? _react2.default.createElement(FlexiTableSectionVSpace, { edge: 'top' }) : _react2.default.createElement(FlexiTableRowVSpace, { edge: 'top' });
    var bottomSpace = isLastRow ? _react2.default.createElement(FlexiTableSectionVSpace, { edge: 'bottom' }) : _react2.default.createElement(FlexiTableRowVSpace, { edge: 'bottom' });

    var leftSpace = isFirstColumn ? _react2.default.createElement(FlexiTableColumnMargin, { side: 'left', width: marginWidth }) : _react2.default.createElement(FlexiTableColumnGutter, { side: 'left', width: halfGutterWidth });
    var rightSpace = isLastColumn ? _react2.default.createElement(FlexiTableColumnMargin, { side: 'right', width: marginWidth }) : _react2.default.createElement(FlexiTableColumnGutter, { side: 'right', width: halfGutterWidth });

    return _react2.default.createElement(
      'div',
      null,
      topSpace,
      _react2.default.createElement(
        'div',
        { className: 'FlexiTableCellSpacer--inner-row' },
        leftSpace,
        this.props.children,
        rightSpace
      ),
      bottomSpace
    );
  };

  return FlexiTableCellSpacer;
}(_react2.default.Component);

exports.default = FlexiTableCellSpacer;
FlexiTableCellSpacer.propTypes = process.env.NODE_ENV !== "production" ? {
  isFirstColumn: _propTypes2.default.bool.isRequired,
  isLastColumn: _propTypes2.default.bool.isRequired,
  isFirstRow: _propTypes2.default.bool.isRequired,
  isLastRow: _propTypes2.default.bool.isRequired,
  halfGutterWidth: _propTypes2.default.number.isRequired,
  marginWidth: _propTypes2.default.number.isRequired
} : {};
module.exports = exports['default'];