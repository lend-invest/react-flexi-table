function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import PropTypes from 'prop-types';

var FlexiTableRowVSpace = function (_React$Component) {
  _inherits(FlexiTableRowVSpace, _React$Component);

  function FlexiTableRowVSpace() {
    _classCallCheck(this, FlexiTableRowVSpace);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  FlexiTableRowVSpace.prototype.render = function render() {
    return React.createElement('div', { className: 'FlexiTableRowVSpace FlexiTableRowVSpace--edge-' + this.props.edge });
  };

  return FlexiTableRowVSpace;
}(React.Component);

FlexiTableRowVSpace.propTypes = process.env.NODE_ENV !== "production" ? {
  edge: PropTypes.string
} : {};

var FlexiTableSectionVSpace = function (_React$Component2) {
  _inherits(FlexiTableSectionVSpace, _React$Component2);

  function FlexiTableSectionVSpace() {
    _classCallCheck(this, FlexiTableSectionVSpace);

    return _possibleConstructorReturn(this, _React$Component2.apply(this, arguments));
  }

  FlexiTableSectionVSpace.prototype.render = function render() {
    return React.createElement('div', { className: 'FlexiTableSectionVSpace FlexiTableSectionVSpace--edge-' + this.props.edge });
  };

  return FlexiTableSectionVSpace;
}(React.Component);

FlexiTableSectionVSpace.propTypes = process.env.NODE_ENV !== "production" ? {
  edge: PropTypes.string
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

    return React.createElement('div', {
      className: 'FlexiTableColumnGutter FlexiTableColumnGutter--side-' + side,
      style: style
    });
  };

  return FlexiTableColumnGutter;
}(React.Component);

FlexiTableColumnGutter.propTypes = process.env.NODE_ENV !== "production" ? {
  side: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired
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

    return React.createElement('div', {
      className: 'FlexiTableColumnMargin FlexiTableColumnMargin--side-' + side,
      style: style
    });
  };

  return FlexiTableColumnMargin;
}(React.Component);

FlexiTableColumnMargin.propTypes = process.env.NODE_ENV !== "production" ? {
  side: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired
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


    var topSpace = isFirstRow ? React.createElement(FlexiTableSectionVSpace, { edge: 'top' }) : React.createElement(FlexiTableRowVSpace, { edge: 'top' });
    var bottomSpace = isLastRow ? React.createElement(FlexiTableSectionVSpace, { edge: 'bottom' }) : React.createElement(FlexiTableRowVSpace, { edge: 'bottom' });

    var leftSpace = isFirstColumn ? React.createElement(FlexiTableColumnMargin, { side: 'left', width: marginWidth }) : React.createElement(FlexiTableColumnGutter, { side: 'left', width: halfGutterWidth });
    var rightSpace = isLastColumn ? React.createElement(FlexiTableColumnMargin, { side: 'right', width: marginWidth }) : React.createElement(FlexiTableColumnGutter, { side: 'right', width: halfGutterWidth });

    return React.createElement(
      'div',
      null,
      topSpace,
      React.createElement(
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
}(React.Component);

export { FlexiTableCellSpacer as default };
FlexiTableCellSpacer.propTypes = process.env.NODE_ENV !== "production" ? {
  isFirstColumn: PropTypes.bool.isRequired,
  isLastColumn: PropTypes.bool.isRequired,
  isFirstRow: PropTypes.bool.isRequired,
  isLastRow: PropTypes.bool.isRequired,
  halfGutterWidth: PropTypes.number.isRequired,
  marginWidth: PropTypes.number.isRequired
} : {};