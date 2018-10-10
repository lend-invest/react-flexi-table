function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import PropTypes from 'prop-types';
import FlexiTableHeaderCell from './FlexiTableHeaderCell';

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
      return React.createElement(FlexiTableHeaderCell, {
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

    return React.createElement(
      'div',
      { className: 'FlexiTableHeaderRow FlexiTableRow' },
      headerCells
    );
  };

  return FlexiTableHeaderRow;
}(React.Component);

export { FlexiTableHeaderRow as default };
FlexiTableHeaderRow.propTypes = process.env.NODE_ENV !== "production" ? {
  columns: PropTypes.array.isRequired,
  halfGutterWidth: PropTypes.number.isRequired,
  marginWidth: PropTypes.number.isRequired
} : {};