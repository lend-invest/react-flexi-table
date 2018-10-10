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

var FlexiTableDefaultCellComponent = function (_React$Component) {
  _inherits(FlexiTableDefaultCellComponent, _React$Component);

  function FlexiTableDefaultCellComponent() {
    _classCallCheck(this, FlexiTableDefaultCellComponent);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  FlexiTableDefaultCellComponent.prototype.render = function render() {
    return _react2.default.createElement(
      'div',
      {
        className: 'FlexiTableDefaultCellComponent'
      },
      this.props.cellData
    );
  };

  return FlexiTableDefaultCellComponent;
}(_react2.default.Component);

exports.default = FlexiTableDefaultCellComponent;
FlexiTableDefaultCellComponent.propTypes = process.env.NODE_ENV !== "production" ? {
  cellData: _propTypes2.default.any
} : {};
module.exports = exports['default'];