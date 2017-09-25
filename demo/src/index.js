import React, {Component} from 'react'
import {render} from 'react-dom'
import _get from 'lodash/get'
import moment from 'moment'

import FlexiTable from '../../src'

import './demo.scss'

function CurrencyValue(props) {
  const formatter = new Intl.NumberFormat('en-GB', { style: 'currency', currency: props.currency })
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
      customer: {
        firstName: 'John',
        lastName: 'Smith',
        postCode: 'N1 1CC',
        region: 'London'
      },
      account: {
        id: 'P-122334',
        signupDate: '2017-02-24',
        lifetimeValue: { currency: 'GBP', amount: '830.00' },
      },
      subscription: {
        nextPaymentDate: '2017-07-26',
        nextPaymentAmount: { currency: 'GBP', amount: '79.00' },
        lastPaymentDate: '2017-06-20',
        lastPaymentAmount: { currency: 'GBP', amount: '79.00' },
        status: 'Up to date',
        comment: ''
      },
    }, {
      customer: {
        firstName: 'Margery',
        lastName: 'Knotswood',
        postCode: 'KT3 3AB',
        region: 'Sutton-under-Whitestonecliffe'
      },
      account: {
        id: 'P-K34212',
        signupDate: '2012-06-04',
        lifetimeValue: { currency: 'GBP', amount: '12004.50' },
      },
      subscription: {
        nextPaymentDate: '2017-07-15',
        nextPaymentAmount: { currency: 'GBP', amount: '59.00' },
        lastPaymentDate: '2017-06-15',
        lastPaymentAmount: { currency: 'GBP', amount: '59.00' },
        status: 'Up to date',
        comment: ''
      },
    }, {
      customer: {
        firstName: 'Christopher',
        lastName: 'Dianetasmark',
        postCode: 'KT3 3AB',
        region: 'Kent'
      },
      account: {
        id: 'A-948121',
        signupDate: '2015-06-04',
        lifetimeValue: { currency: 'GBP', amount: '1689.00' },
      },
      subscription: {
        nextPaymentDate: '2017-07-15',
        nextPaymentAmount: { currency: 'GBP', amount: '59.00' },
        lastPaymentDate: '2017-04-15',
        lastPaymentAmount: { currency: 'GBP', amount: '59.00' },
        status: 'Overdue',
        overdueAmount:  { currency: 'GBP', amount: '177.00' },
        comment: 'This customer is consistently late with payments and can be difficult to contact.'
      },
    }]


    const tableColumns = [{
      // name is just used for css classes and things, it's just an identifier
      name: 'Loan',
      headerComponent: () => {
        return (
          <div>
            <div>Customer</div>
            <ul className="Demo--customer-sub-details">
              <li>Account</li>
              <li>Sign up date</li>
              <li>Lifetime Value</li>
            </ul>
          </div>
        )
      },
      // Dont use a cellDataSelector in this case, we'll use the rowData as is
      //cellDataSelector: ,
      cellComponent: ({cellData: x}) => {
        return (
          <div>
            <div>{x.customer.lastName}, {x.customer.firstName}</div>
            <ul className="Demo--customer-sub-details">
              <li>{x.account.id}</li>
              <li><DateValue date={x.account.signupDate} /></li>
              <li><CurrencyValue {...x.account.lifetimeValue} /></li>
            </ul>
          </div>
        )
      },
      minWidth: 360,
      maxWidth: 400,

    }, {
      name: 'Region',
      headerComponent: () => <span>Region</span>,
      // for the cell data you can define a function
      cellDataSelector: x => x.customer.region,
      cellComponent: ({cellData: x}) => <span>{x}</span>,
      maxWidth: 150,
      minWidth: 75,

    }, {
      name: 'LastPaymentDate',
      headerComponent: () => <span>Last Payment</span>,
      // or for the cell data you can define a path that lodash.get can use
      cellDataSelector: 'subscription.lastPaymentDate',
      cellComponent: ({cellData: x}) => <DateValue date={x} />,
      fixedWidth: 120,

    }, {
      name: 'LastPaymentAmount',
      headerComponent: () => <span>Amount</span>,
      cellDataSelector: 'subscription.nextPaymentAmount',
      cellComponent: ({cellData: x}) => <CurrencyValue {...x} />,
      minWidth: 70,
      //we want it to expand to it's content. We should never wrap currencies
      fitToContentWidth: true,

    }, {
      name: 'Status',
      headerComponent: () => <span>Status</span>,
      cellDataSelector: 'subscription.status',
      // we can define a function to derive a css class to be used on the
      // outer-cell for styling.
      cellClassNameSelector: ({cellData: x}) => x === 'Up to date' ? 'good' : 'bad',
      // use the default cell component
      fitToContentWidth: true,

    }, {
      name: 'Comment',
      headerComponent: () => <span>Comment</span>,
      // If we don't use a cellDataSelector we'll get the whole data item used for the row
      cellComponent: ({cellData: x}) => {
        const overdueTime = moment(x.subscription.lastPaymentDate).from(moment('2017-09-30').subtract('months', 1), true)

        return (
          <div>
            { x.subscription.overdueAmount && <div><strong>Overdue:</strong> {overdueTime}</div> }
            { x.subscription.comment && <div><strong>Comment:</strong> {x.subscription.comment}</div> }
          </div>
        )
      },
      minWidth: 200,
      maxWidth: 350,
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
