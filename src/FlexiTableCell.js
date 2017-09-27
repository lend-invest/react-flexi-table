import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import _get from 'lodash/get'
import FlexiTableCellSpacer from './FlexiTableSpacers'
import FlexiTableDefaultCellComponent from './FlexiTableDefaultCellComponent'

export default class FlexiTableCell extends React.Component {
  static propTypes = {
    rowData: PropTypes.any,
    rowNumber: PropTypes.number,
    column: PropTypes.object.isRequired,
    columnNumber: PropTypes.number.isRequired,
    isFirstColumn: PropTypes.bool.isRequired,
    isLastColumn: PropTypes.bool.isRequired,
    isFirstRow: PropTypes.bool.isRequired,
    isLastRow: PropTypes.bool.isRequired,
    halfGutterWidth: PropTypes.number.isRequired,
    marginWidth: PropTypes.number.isRequired,
  }

  getCellData = () => {
    const {
      rowData,
      rowNumber,
      columnNumber,
      column: {
        columnName,
        cellDataSelector
      },
    } = this.props

    if (!cellDataSelector) {
      // default to the row data if the implementor hasn't provided any row data
      return rowData

    } else if (typeof cellDataSelector === 'string') {
      return _get(rowData, cellDataSelector)

    } else if (typeof cellDataSelector === 'function') {
      return cellDataSelector(rowData, rowNumber, columnName, columnNumber, this.props.column)

    } else {
      throw Error(`Unkown cellDataSelector type: ${cellDataSelector.toString()}`)
    }
  }

  render() {
    const {
      rowData,
      rowNumber,
      columnNumber,
      column: {
        name: columnName,
        cellComponent,
        cellClassNameSelector,
      },
      isFirstColumn,
      isLastColumn,
      isFirstRow,
      isLastRow,
      halfGutterWidth,
      marginWidth,
    } = this.props

    const cellData = this.getCellData()
    const outerCellClassName = cellClassNameSelector
      && cellClassNameSelector({
        cellData,
        rowData,
        rowNumber,
        columnName,
        columnNumber,
        column: this.props.column,
      })
    const CellComponent = cellComponent || FlexiTableDefaultCellComponent

    return (
      <div
        className={classnames(
          'FlexiTableCell--outer',
          `FlexiTableCell--column-num-${columnNumber}`,
          outerCellClassName,
          {
            [`FlexiTable--column-${columnName}`]: !!columnName,
            [`FlexiTable--row-${rowNumber}`]: !!rowNumber,
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
          <div className='FlexiTableBodyCell FlexiTableCell'>
            <CellComponent
              cellData={cellData}
              rowNumber={rowNumber}
              rowData={rowData}
              columnName={columnName}
              column={this.props.column}
              columnNumber={columnNumber}
            />
          </div>
        </FlexiTableCellSpacer>
      </div>
    )
  }
}
