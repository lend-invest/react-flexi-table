import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import FlexiTableCellSpacer from './FlexiTableSpacers'

export default class FlexiTableHeaderCell extends React.Component {
  static propTypes = {
    column: PropTypes.object.isRequired,
    columnNumber: PropTypes.number.isRequired,
    isFirstColumn: PropTypes.bool.isRequired,
    isLastColumn: PropTypes.bool.isRequired,
    isFirstRow: PropTypes.bool.isRequired,
    isLastRow: PropTypes.bool.isRequired,
    halfGutterWidth: PropTypes.number.isRequired,
    marginWidth: PropTypes.number.isRequired,
  }

  render() {
    const {
      columnNumber,
      column: {
        name: columnName,
        headerComponent,
      },
      isFirstColumn,
      isLastColumn,
      isFirstRow,
      isLastRow,
      halfGutterWidth,
      marginWidth,
    } = this.props

    const CellComponent = headerComponent || (() => <span>{columnName}</span>)

    return (
      <div
        className={classnames(
          'FlexiTableHeaderCell',
          `FlexiTableHeaderCell--column-${columnNumber}`,
          `FlexiTable-column-num-${columnNumber}`,
          {
            [`FlexiTableHeaderCell--${columnName}`]: !!columnName,
            [`FlexiTable--column-${columnName}`]: !!columnName,
          }
        )}
      >
        <FlexiTableCellSpacer
          isFirstRow={isFirstRow}
          isLastRow={isLastRow}
          isFirstColumn={isFirstColumn}
          isLastColumn={isLastColumn}
          halfGutterWidth={halfGutterWidth}
          marginWidth={marginWidth}
        >
          <div className='FlexiTableCell--inner'>
            <CellComponent
              columnName={columnName}
              columnNumber={columnNumber}
            />
          </div>
        </FlexiTableCellSpacer>
      </div>
    )
  }

}

