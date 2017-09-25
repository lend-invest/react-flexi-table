import React from 'react'
import PropTypes from 'prop-types'

export default class FlexiTableDefaultCellComponent extends React.Component {
  static propTypes = {
    cellData: PropTypes.any,
  }

  render() {
    return (
      <div
        className='FlexiTableDefaultCellComponent'
      >{this.props.cellData}</div>
    )
  }
}


