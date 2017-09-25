import React, {Component} from 'react'
import {render} from 'react-dom'
import _get from 'lodash/get'
import moment from 'moment'

import FlexiTable from '../../src'

import './demo.scss'

function CurrencyValue(props) {
  const formatter = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' })
  return (<span>{formatter.format(props.amount)}</span>)
}

function DateValue(props) {
  const dt = moment(props.date, "YYYY-MM-DD")
  return (<span>{dt.format("DD. MMM YYYY")}</span>)
}

class Demo extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render () {

    // Example  table data
    const tableData = [{
      loan_details: {
        address: { street: 'London Lane', county: 'London', postcode: 'E8' },
        ltv: '43.75',
        repayment_date: '2017-07-26',
        state: 'In arrears',
        isExtended: false,
      },
      tranche_name: 'A',
      invested_amount: { currency: 'GBP', amount: '868.00' },
      interest_rate: '6.50',
      unpaid_interest: null,
    }, {
      loan_details: {
        address: { street: 'Old Montague Street', county: 'London', postcode: 'N1' },
        ltv: '53.88',
        repayment_date: '2017-10-20',
        state: 'On schedule',
        isExtended: true,
      },
      tranche_name: 'A',
      invested_amount: { currency: 'GBP', amount: '1000.00' },
      interest_rate: '7.00',
      unpaid_interest: null,
    }, {
      loan_details: {
        address: { street: 'Chase Side', county: 'London', postcode: 'N14' },
        ltv: '63.75',
        repayment_date: '2017-10-28',
        state: 'In arrears',
        isExtended: false,
      },
      tranche_name: 'A',
      invested_amount: { currency: 'GBP', amount: '772.00' },
      interest_rate: '7.75',
      unpaid_interest: { currency: 'GBP', amount: '30.00' },
    }, {
      loan_details: {
        address: { street: 'Woodside Avenue', county: 'London', postcode: 'N6' },
        ltv: '75.00',
        repayment_date: '2017-10-29',
        state: 'On schedule',
        isExtended: false,
      },
      tranche_name: 'A',
      invested_amount: { currency: 'GBP', amount: '100.00' },
      interest_rate: '7.70',
      unpaid_interest: null,
    }, {
      loan_details: {
        address: { street: 'Harold Road', county: 'London', postcode: 'NSE19' },
        ltv: '61.55',
        repayment_date: '2017-10-29',
        state: 'Out of term / in breach',
        isExtended: false,
        isPartRepaid: true,
      },
      tranche_name: 'A',
      invested_amount: { currency: 'GBP', amount: '100.00' },
      interest_rate: '7.70',
      unpaid_interest: null,
    }]


    const tableColumns = [{
      // name is just used for css classes and things, it's just an identifier
      name: 'Loan',
      headerComponent: () => {
        return (
          <div>
            <div>Loan</div>
            <div>
              <span> Tranche </span> |
              <span> Interest rate</span> |
              <span> Loan to value</span>
            </div>
          </div>
        )
      },
      // Dont use a cellDataSelector in this case, we'll use the rowData as is
      //cellDataSelector: ,
      cellComponent: ({cellData: x}) => {
        return (
          <div>
            <div>{x.loan_details.address.street}, {x.loan_details.address.county}, {x.loan_details.address.postcode}</div>
            <div>
              <span> {x.tranche_name}</span> |
              <span> {x.interest_rate}</span> |
              <span> {x.loan_details.ltv}</span>
            </div>
          </div>
        )
      },
      minWidth: 200,
      maxWidth: 350,

    }, {
      name: 'Invested',
      headerComponent: () => <span>Invested</span>,
      // for the cell data you can define a path that lodash.get can use
      cellDataSelector: 'invested_amount.amount',
      cellComponent: ({cellData: x}) => <CurrencyValue amount={x} />,
      minWidth: 100,
      fitToContentWidth: true,

    }, {
      name: 'Repayment',
      headerComponent: () => <span>Repayment</span>,
      // or for the cell data you can define a function
      cellDataSelector: x => x.loan_details.repayment_date,
      cellComponent: ({cellData: x}) => <DateValue date={x} />,
      fixedWidth: 100,

    }, {
      name: 'Performance',
      headerComponent: () => <span>Performance</span>,
      cellDataSelector: 'loan_details.state',
      fitToContentWidth: true,
      // use the default cell component

    }, {
      name: 'Comment',
      headerComponent: () => <span>Comment</span>,
      // Dont use a cellDataSelector in this case, we'll use the rowData as is
      //cellDataSelector: '',
      // Build our own cell component for this case
      cellComponent: ({cellData: x}) => {
        const unpaidInterestAmount = _get(x, 'unpaid_interest.amount')
        return (
          <div>
            { x.loan_details.isExtended && <div>Extended</div> }
            { x.loan_details.isPartRepaid && <div>Part repaid</div> }
            { unpaidInterestAmount &&
                <div><CurrencyValue amount={unpaidInterestAmount} /> income owed</div> }
          </div>
        )
      },
      minWidth: 120,
      maxWidth: 300,
    }]

    return (
      <div className="Demo">
        <h1>ReactFlexiTable Demo</h1>
        <FlexiTable
          className="DemoTable"
          columns={tableColumns}
          data={tableData}
          halfGutterWidth={25}
          marginWidth={20}
        />
      </div>
    )
  }
}

render(<Demo/>, document.querySelector('#demo'))
