import React, { useState, useEffect } from 'react';
import classnames from 'classnames'
import PropTypes from 'prop-types'
import _map from 'lodash/map'
import _take from 'lodash/take'
import _isNumber from 'lodash/isNumber'
import Measure from 'react-measure'
import FlexiTableRow from './FlexiTableRow'
import FlexiTableHeaderRow from './FlexiTableHeaderRow'
import {
  buildWidthData,
  calculateColumnsWidths,
  calculateRowWidth,
} from './tableCalculator'
import './FlexiTable.scss'

function generateUuid() {
  // https://gist.github.com/jed/982883
  return (function b(a){return a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,b)})()
}

const FlexiTable = (props) => {
  const uuid = generateUuid();
  const { columns } = props;
  const [hasRenderedTestFlexColumns, setHasRenderedTestFlexColumns] = useState(false)
  const [hasMeasuredTestColumns, setHasMeasuredTestColumns] = useState(false)
  const [hasCalculatedFlexColumns, setHasCalculatedFlexColumns] = useState(false)
  const [calcColumnWidths, setCalcColumnWidths] = useState(null)
  const [gatheredWidthData, setGatheredWidthData] = useState(null)
  const [measuredTableWidth, setMeasuredTableWidth] = useState(null)

  let tableStyle;
  let tableRef;

  const clearSizeStyles = () => {
    if (tableStyle) {
      tableStyle.innerText = ''
    }
  }

  const setStartState = () => {
    clearSizeStyles()
    const dynamicColumns = props.columns.filter(x => x.fixedWidth == null)
    
    //if all the columns have a fixed width, then don't bother calculating
    if (dynamicColumns.length === 0) {
      setHasRenderedTestFlexColumns(true)
      setHasMeasuredTestColumns(true)
      setHasCalculatedFlexColumns(true)
    } else {
      setHasRenderedTestFlexColumns(true)
      setHasMeasuredTestColumns(false)
      setHasCalculatedFlexColumns(false)
    }
  }

  const updateSizeStyles = (calcColumnWidths) => {
    clearSizeStyles()
    const { columns, marginWidth, halfGutterWidth } = props

    // extend the column data with our calculated widths
    const columnsWithWidths = columns.map(c => ({
      name: c.name,
      width: (calcColumnWidths && calcColumnWidths[c.name]) || c.fixedWidth
    }))

    const rowWidth = calculateRowWidth(
      columnsWithWidths.map(x => x.width),
      marginWidth,
      halfGutterWidth
    )

    let styles = `.FlexiTable-${uuid} .FlexiTableRow { min-width: ${rowWidth}px; max-width: ${rowWidth}px; width: ${rowWidth}px;}`
    columnsWithWidths.forEach(c => {
      styles += ` .FlexiTable-${uuid} .FlexiTable--column-${c.name} .FlexiTableCell { min-width: ${c.width}px; max-width: ${c.width}px; width: ${c.width}px;}`
    })
    tableStyle.innerText = styles
  }

  const getColumnCellWidths = (columnName) => {
    // Unless the user has set some odd styles the flex styles when
    // isInMeasureMode = true should have caused each cell to grow to the
    // maximum width. Now we just need to go through them all and collect
    // the data.
    const cellSelector = `.FlexiTable-${this.uuid} .FlexiTable--column-${columnName} .FlexiTableCell`
    const cells = tableRef.querySelectorAll(cellSelector)
    const result = _map(cells, x => x.scrollWidth)
    return result
  }

  const handleResize = (contentRect) => {
    if (!hasCalculatedFlexColumns) {
      //ignore the change if we haven't yet calcluated the flex columns, it's to be expected

    } else if (contentRect.bounds.width !== measuredTableWidth)  {
      // we need to recalculate columns
      setHasCalculatedFlexColumns(false)
    }
  }

  const renderContents = (columns, isInMeasureMode) => {
    const {
      data,
      rowLimit,
      halfGutterWidth,
      marginWidth,
      className,
    } = props

    const headerRow = (
      <FlexiTableHeaderRow
        columns={columns}
        halfGutterWidth={halfGutterWidth}
        marginWidth={marginWidth}
      />
    )

    let limitedData = data || []
    if (_isNumber(rowLimit)) {
      limitedData = _take(data, rowLimit)
    }

    const rows = limitedData.map((x, i) => {
      return (
        <FlexiTableRow
          key={i}
          rowData={x}
          columns={columns}
          rowNumber={i}
          isFirstRow={i === 0}
          isLastRow={i === data.length - 1}
          halfGutterWidth={halfGutterWidth}
          marginWidth={marginWidth}
        />
      )
    })

    // Manually handle overflow based on our own measurements
    // Note: We switch the outer-box class based on the overflow. It's the
    // only way I could figure to have the border look correct both during
    // overflow due to min-widths and underflow due to max-width restrictions
    let rowWidth = null
    if (!isInMeasureMode && calcColumnWidths) {
      // extend the column data with our calculated widths
      const columnsWidths = columns.map(c => calcColumnWidths[c.name] || c.fixedWidth)
      rowWidth = calculateRowWidth(columnsWidths, marginWidth, halfGutterWidth)
    }

    const overflowX = rowWidth != null
      && measuredTableWidth != null
      && measuredTableWidth < rowWidth
    const overflowStyle = overflowX ? { overflowX: 'scroll' } : {}

    let measureModeStyle = {}
    if (isInMeasureMode && tableRef) {
      // The height shouldn't shrink when we switch to measure-mode,
      // otherwise it can mess with the scroll position on the page
      // if the table is near the bottom
      measureModeStyle.minHeight = tableRef.clientHeight;
    }

    return (
      <Measure
        bounds
        onResize={handleResize}
      >
        {({ measureRef }) =>
          <div ref={measureRef} className={className}>
            <div
              className={classnames('FlexiTable--outer-box', {
                'FlexiTable--border-box': overflowX
              })}
              ref={el => {tableRef = el}}
              style={overflowStyle}
            >
              <div
                className={classnames('FlexiTable', `FlexiTable-${uuid}`, {
                  'FlexiTable--measure-mode': isInMeasureMode,
                  'FlexiTable--border-box': !overflowX
                })}
                style={measureModeStyle}
              >
                <div className='FlexiTable--header'>
                  {headerRow}
                </div>
                <div className='FlexiTable--body'>
                  {rows}
                </div>
              </div>
            </div>
          </div>
        }
      </Measure>
    )
  }

  // componentDidMount
  useEffect(() => {
    tableStyle = document.createElement('style');
    document.head.appendChild(tableStyle)
    if (tableRef) {
      setStartState()
    }

    return () => {
      if (tableStyle) {
        document.head.removeChild(tableStyle)
      }
    }
  }, [])

  // componentWillReceiveProps
  useEffect(() => {
    setStartState()

  }, [props.columns, props.halfGutterWidth, props.marginWidth, props.rowLimit, props.data])

  // componentWillUpdate
  useEffect(() => {
    updateSizeStyles(calcColumnWidths)

  }, [calcColumnWidths, hasCalculatedFlexColumns])

  // componentDidUpdate
  useEffect(() => {

    if (tableRef && !hasRenderedTestFlexColumns) {
      setStartState()

    } else if (hasRenderedTestFlexColumns && !hasMeasuredTestColumns) {
      const dynamicColumns = props.columns.filter(x => x.fixedWidth == null)
      const gatheredWidthData = buildWidthData(dynamicColumns, getColumnCellWidths)
      setHasRenderedTestFlexColumns(true)
      setHasCalculatedFlexColumns(false)
      setGatheredWidthData(gatheredWidthData)

    } else if (hasMeasuredTestColumns && !hasCalculatedFlexColumns) {
      const tableWidth = tableRef.clientWidth
      const calcColumnWidths = calculateColumnsWidths(
        props.columns,
        gatheredWidthData,
        props.marginWidth,
        props.halfGutterWidth,
        tableWidth,
      )

      setHasCalculatedFlexColumns(true)
      setCalcColumnWidths(calcColumnWidths)
      setMeasuredTableWidth(tableWidth)

    }

  }, [columns])

  if (!hasRenderedTestFlexColumns || !hasMeasuredTestColumns) {
    //render in a measure mode to calculate columns
    const dynamicColumns = columns.filter(x => x.fixedWidth == null)
    //if all columns are a fixed size, we don't need to do a measure render
    if (dynamicColumns.length) {
      return renderContents(dynamicColumns, true)
    }
  }

  return renderContents(columns, false)
 
}

FlexiTable.defaultProps = {
  halfGutterWidth: 25,
    marginWidth: 20,
}

FlexiTable.propTypes = {
  columns: PropTypes.array,
    data: PropTypes.array,
    halfGutterWidth: PropTypes.number,
    marginWidth: PropTypes.number,
    rowLimit: PropTypes.number,
}

export default FlexiTable;
