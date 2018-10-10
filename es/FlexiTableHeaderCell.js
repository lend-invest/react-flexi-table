function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import FlexiTableCellSpacer from './FlexiTableSpacers';

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
      return React.createElement(
        'span',
        null,
        columnName
      );
    };

    return React.createElement(
      'div',
      {
        className: classnames('FlexiTableHeaderCell--outer', 'FlexiTable--column-num-' + columnNumber, (_classnames = {}, _classnames['FlexiTable--column-' + columnName] = !!columnName, _classnames))
      },
      React.createElement(
        FlexiTableCellSpacer,
        {
          isFirstRow: isFirstRow,
          isLastRow: isLastRow,
          isFirstColumn: isFirstColumn,
          isLastColumn: isLastColumn,
          halfGutterWidth: halfGutterWidth,
          marginWidth: marginWidth
        },
        React.createElement(
          'div',
          { className: 'FlexiTableHeaderCell FlexiTableCell' },
          React.createElement(CellComponent, {
            column: this.props.column,
            columnName: columnName,
            columnNumber: columnNumber
          })
        )
      )
    );
  };

  return FlexiTableHeaderCell;
}(React.Component);

export { FlexiTableHeaderCell as default };
FlexiTableHeaderCell.propTypes = process.env.NODE_ENV !== "production" ? {
  column: PropTypes.object.isRequired,
  columnNumber: PropTypes.number.isRequired,
  isFirstColumn: PropTypes.bool.isRequired,
  isLastColumn: PropTypes.bool.isRequired,
  isFirstRow: PropTypes.bool.isRequired,
  isLastRow: PropTypes.bool.isRequired,
  halfGutterWidth: PropTypes.number.isRequired,
  marginWidth: PropTypes.number.isRequired
} : {};