function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import PropTypes from 'prop-types';

var FlexiTableDefaultCellComponent = function (_React$Component) {
  _inherits(FlexiTableDefaultCellComponent, _React$Component);

  function FlexiTableDefaultCellComponent() {
    _classCallCheck(this, FlexiTableDefaultCellComponent);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  FlexiTableDefaultCellComponent.prototype.render = function render() {
    return React.createElement(
      'div',
      {
        className: 'FlexiTableDefaultCellComponent'
      },
      this.props.cellData
    );
  };

  return FlexiTableDefaultCellComponent;
}(React.Component);

export { FlexiTableDefaultCellComponent as default };
FlexiTableDefaultCellComponent.propTypes = process.env.NODE_ENV !== "production" ? {
  cellData: PropTypes.any
} : {};