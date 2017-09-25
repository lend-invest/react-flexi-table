import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import _map from 'lodash/map'
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

export default class FlexiTable extends React.Component {
  static propTypes = {
    columns: PropTypes.array,
    data: PropTypes.array,
    halfGutterWidth: PropTypes.number,
    marginWidth: PropTypes.number,
  }

  static defaultProps = {
    halfGutterWidth: 25,
    marginWidth: 20,
  }

  constructor(props) {
    super(props)
    this.uuid = generateUuid()
    this.state = {
      hasRenderedTestFlexColumns: false,
      hasMeasuredTestColumns: false,
      hasCalculatedFlexColumns: false,
      calcColumnWidths: null,
    }
  }

  componentDidMount() {
    this.tableStyle = document.createElement('style')
    document.head.appendChild(this.tableStyle)

    if (this.tableRef) {
      this.setStartState()
    }
  }

  componentWillUnmount() {
    if (this.tableStyle) {
      document.head.removeChild(this.tableStyle)
    }
  }

  // Note: rather than passing widths down to each react component when we
  // change the calculated widths we just update a stylesheet. This has a
  // big perf improvement becuase react doesn't need to re-render every
  // cell.

  clearSizeStyles = () => {
    if (this.tableStyle) {
      while (this.tableStyle.sheet.cssRules.length) {
        this.tableStyle.sheet.deleteRule(0)
      }
    }
  }

  updateSizeStyles = (calcColumnWidths) => {
    this.clearSizeStyles()
    const { columns, marginWidth, halfGutterWidth } = this.props

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

    this.tableStyle.sheet.insertRule(`.FlexiTable-${this.uuid} .FlexiTableRow { min-width: ${rowWidth}px; max-width: ${rowWidth}px; width: ${rowWidth}px;}` , 0)
    columnsWithWidths.forEach(c => {
      this.tableStyle.sheet.insertRule(`.FlexiTable-${this.uuid} .FlexiTable--column-${c.name} .FlexiTableCell { min-width: ${c.width}px; max-width: ${c.width}px; width: ${c.width}px;}` , 0)
    })
  }

  setStartState = () => {
    this.clearSizeStyles()
    const dynamicColumns = this.props.columns.filter(x => x.fixedWidth == null)
    
    //if all the columns have a fixed width, then don't bother calculating
    if (dynamicColumns.length === 0) {
      this.setState({
        hasRenderedTestFlexColumns: true,
        hasMeasuredTestColumns: true,
        hasCalculatedFlexColumns: true,
      })
    } else {
      this.setState({
        hasRenderedTestFlexColumns: true,
        hasMeasuredTestColumns: false,
        hasCalculatedFlexColumns: false,
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.columns !== nextProps.columns ||
      this.props.halfGutterWidth !== nextProps.halfGutterWidth ||
      this.props.marginWidth !== nextProps.marginWidth
    ) {
      // columns have changed, we need to re-gather widths and recalculate
      this.setStartState()

    } else if (this.props.data !== nextProps.data) {
      // data has changed, we need to re-gather widths and recalculate
      this.setStartState()
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (!this.state.hasCalculatedFlexColumns && nextState.hasCalculatedFlexColumns) {
      // if we just calculated the column widths, update them
      this.updateSizeStyles(nextState.calcColumnWidths)
    }
  }

  componentDidUpdate() {
    const {
      hasRenderedTestFlexColumns,
      hasMeasuredTestColumns,
      hasCalculatedFlexColumns,
    } = this.state

    if (this.tableRef && !hasRenderedTestFlexColumns) {
      this.setStartState()

    } else if (hasRenderedTestFlexColumns && !hasMeasuredTestColumns) {
      const dynamicColumns = this.props.columns.filter(x => x.fixedWidth == null)
      const gatheredWidthData = buildWidthData(dynamicColumns, this.getColumnCellWidths)
      this.setState({
        hasMeasuredTestColumns: true,
        hasCalculatedFlexColumns: false,
        gatheredWidthData,
      })

    } else if (hasMeasuredTestColumns && !hasCalculatedFlexColumns) {
      const tableWidth = this.tableRef.clientWidth
      const calcColumnWidths = calculateColumnsWidths(
        this.props.columns,
        this.state.gatheredWidthData,
        this.props.marginWidth,
        this.props.halfGutterWidth,
        tableWidth,
      )

      this.setState({
        hasCalculatedFlexColumns: true,
        calcColumnWidths,
        measuredTableWidth: tableWidth
      })
    }
  }


  handleResize = (contentRect) => {
    if (!this.state.hasCalculatedFlexColumns) {
      //ignore the change if we haven't yet calcluated the flex columns, it's to be expected

    } else if (contentRect.bounds.width !== this.state.measuredTableWidth)  {
      // we need to recalculate columns
      this.setState({
        hasCalculatedFlexColumns: false
      })
    }
  }

  getColumnCellWidths = (columnName) => {
    // Unless the user has set some odd styles the flex styles when
    // isInMeasureMode = true should have caused each cell to grow to the
    // maximum width. Now we just need to go through them all and collect
    // the data.
    const cellSelector = `.FlexiTable-${this.uuid} .FlexiTable--column-${columnName} .FlexiTableCell`
    const cells = this.tableRef.querySelectorAll(cellSelector)
    const result = _map(cells, x => x.scrollWidth)
    return result
  }

  renderContents = (columns, isInMeasureMode) => {
    const {
      data,
      halfGutterWidth,
      marginWidth,
      className,
    } = this.props
    const { calcColumnWidths } = this.state

    const headerRow = (
      <FlexiTableHeaderRow
        columns={columns}
        halfGutterWidth={halfGutterWidth}
        marginWidth={marginWidth}
      />
    )

    const rows = data.map((x, i) => {
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
      && this.state.measuredTableWidth != null
      && this.state.measuredTableWidth < rowWidth
    const overflowStyle = overflowX ? { overflowX: 'scroll' } : {}

    return (
      <Measure
        bounds
        onResize={this.handleResize}
      >
        {({ measureRef }) =>
          <div ref={measureRef} className={className}>
            <div
              className={classnames('FlexiTable--outer-box', {
                'FlexiTable--border-box': overflowX
              })}
              ref={el => {this.tableRef = el}}
              style={overflowStyle}
            >
              <div
                className={classnames('FlexiTable', `FlexiTable-${this.uuid}`, {
                  'FlexiTable--measure-mode': isInMeasureMode,
                  'FlexiTable--border-box': !overflowX
                })}
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

  render() {
    const { columns } = this.props

    if (!this.state.hasRenderedTestFlexColumns || !this.state.hasMeasuredTestColumns) {
      //render in a measure mode to calculate columns
      const dynamicColumns = columns.filter(x => x.fixedWidth == null)
      //if all columns are a fixed size, we don't need to do a measure render
      if (dynamicColumns.length) {
        return this.renderContents(dynamicColumns, true)
      }
    }

    return this.renderContents(columns, false)
  }
}
