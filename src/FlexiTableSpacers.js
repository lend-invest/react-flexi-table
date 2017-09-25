import React from 'react'
import PropTypes from 'prop-types'

class FlexiTableRowVSpace extends React.Component {
  static propTypes = {
    edge: PropTypes.string,
  }

  render() {
    return (
      <div className={`FlexiTableRowVSpace FlexiTableRowVSpace--edge-${this.props.edge}`} />
    )
  }
}

class FlexiTableSectionVSpace extends React.Component {
  static propTypes = {
    edge: PropTypes.string,
  }

  render() {
    return (
      <div className={`FlexiTableSectionVSpace FlexiTableSectionVSpace--edge-${this.props.edge}`} />
    )
  }
}

class FlexiTableColumnGutter extends React.Component {
  static propTypes = {
    side: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
  }

  render() {
    const { side, width } = this.props

    const style = {
      width: width,
      minWidth: width,
      maxWidth: width,
    }

    return (
      <div
        className={`FlexiTableColumnGutter FlexiTableColumnGutter--side-${side}`}
        style={style}
      />
    )
  }
}

class FlexiTableColumnMargin extends React.Component {
  static propTypes = {
    side: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
  }

  render() {
    const { side, width } = this.props

    const style = {
      width: width,
      minWidth: width,
      maxWidth: width,
    }

    return (
      <div
        className={`FlexiTableColumnMargin FlexiTableColumnMargin--side-${side}`}
        style={style}
      />
    )
  }
}

export default class FlexiTableCellSpacer extends React.Component {
  static propTypes = {
    isFirstColumn: PropTypes.bool.isRequired,
    isLastColumn: PropTypes.bool.isRequired,
    isFirstRow: PropTypes.bool.isRequired,
    isLastRow: PropTypes.bool.isRequired,
    halfGutterWidth: PropTypes.number.isRequired,
    marginWidth: PropTypes.number.isRequired,
  }

  render() {
    const {
      isFirstColumn,
      isLastColumn,
      isFirstRow,
      isLastRow,
      halfGutterWidth,
      marginWidth,
    } = this.props

    const topSpace = isFirstRow
      ? <FlexiTableSectionVSpace edge='top' />
      : <FlexiTableRowVSpace edge='top' />
    const bottomSpace = isLastRow
      ? <FlexiTableSectionVSpace edge='bottom' />
      : <FlexiTableRowVSpace edge='bottom' />

    const leftSpace = isFirstColumn
      ? <FlexiTableColumnMargin side='left' width={marginWidth} />
      : <FlexiTableColumnGutter side='left' width={halfGutterWidth}/>
    const rightSpace = isLastColumn
      ? <FlexiTableColumnMargin side='right' width={marginWidth} />
      : <FlexiTableColumnGutter side='right' width={halfGutterWidth} />

    return (
      <div>
        {topSpace}
        <div className='FlexiTableCellSpacer--inner-row'>
          {leftSpace}
          {this.props.children}
          {rightSpace}
        </div>
        {bottomSpace}
      </div>
    )
  }
}

