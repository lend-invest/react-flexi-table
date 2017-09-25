import React from 'react'
import PropTypes from 'prop-types'
import FlexiTableHeaderCell from './FlexiTableHeaderCell'

export default class FlexiTableHeaderRow extends React.Component {
  static propTypes = {
    columns: PropTypes.array.isRequired,
    halfGutterWidth: PropTypes.number.isRequired,
    marginWidth: PropTypes.number.isRequired,
  }

  render () {
    const {
      columns,
      halfGutterWidth,
      marginWidth,
    } = this.props

    const headerCells = columns.map((x, i) => {
      return (
        <FlexiTableHeaderCell
          key={i}
          column={x}
          columnNumber={i}
          isFirstColumn={i === 0}
          isLastColumn={i === columns.length - 1}
          isFirstRow={true}
          isLastRow={true}
          halfGutterWidth={halfGutterWidth}
          marginWidth={marginWidth}
        />
      )
    })

    return (
      <div className='FlexiTableHeaderRow' >
        {headerCells}
      </div>
    )
  }
}

