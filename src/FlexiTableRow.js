import React from 'react'
import PropTypes from 'prop-types'
import FlexiTableCell from './FlexiTableCell'

export default class FlexiTableRow extends React.Component {
  static propTypes = {
    rowData: PropTypes.any.isRequired,
    columns: PropTypes.array.isRequired,
    rowNumber: PropTypes.number.isRequired,
    isFirstRow: PropTypes.bool.isRequired,
    isLastRow: PropTypes.bool.isRequired,
    halfGutterWidth: PropTypes.number.isRequired,
    marginWidth: PropTypes.number.isRequired,
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.columns !== nextProps.columns ||
      this.props.rowData !==  nextProps.rowData ||
      this.props.rowNumber !== nextProps.rowNumber ||
      this.props.isFirstRow !== nextProps.isFirstRow ||
      this.props.isLastRow !== nextProps.isLastRow ||
      this.props.halfGutterWidth !== nextProps.halfGutterWidth ||
      this.props.marginWidth !== nextProps.marginWidth
    )
  }

  render() {
    const {
      rowData,
      columns,
      rowNumber,
      isFirstRow,
      isLastRow,
      halfGutterWidth,
      marginWidth,
    } = this.props

    const cells = columns.map((x, i) => {
      return (
        <FlexiTableCell
          key={i}
          rowData={rowData}
          column={x}
          rowNumber={rowNumber}
          columnNumber={i}
          isFirstColumn={i === 0}
          isLastColumn={i === columns.length - 1}
          isFirstRow={isFirstRow}
          isLastRow={isLastRow}
          halfGutterWidth={halfGutterWidth}
          marginWidth={marginWidth}
        />
      )
    })

    return (
      <div className={`FlexiTableRow FlexiTableRow--row-number-${rowNumber}`} >
        {cells}
      </div>
    )
  }
}

