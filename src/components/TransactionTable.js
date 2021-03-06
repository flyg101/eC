import React, { Component } from 'react';

import {
  Table,
  Label
} from 'react-bootstrap';

import { LinkContainer } from 'react-router-bootstrap'

class TransactionTable extends Component {
  render() {
    return (
      <div>
        <h5>Transactions History</h5>
        <Table striped condensed hover responsive bordered >
          <thead>
            <tr>
              <th>TYPE</th>
              <th>TIME</th>
              <th>AMOUNT</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {!this.props.transactions ? (
              <tr>
                <td>No Transactions Found</td>
              </tr>
            ) : Object.keys(this.props.transactions).map((key, i) => {
              var transData = this.props.transactions[key];
              return (
                <LinkContainer to='/main/transactions' key={(i + 1).toString()}>
                  <tr>
                    <td>{transData.type}</td>
                    <td>{transData.time}</td>
                    <td> &#579;{transData.btcAmount} - &#8358;{transData.ngnAmount} - &#36;{transData.dolAmount}</td>
                    <td><Label bsStyle={transData.statusLabel} >{transData.status}</Label></td>
                  </tr>
                </LinkContainer>

              )
            })

            }
          </tbody>
        </Table>
      </div>
    )
  }
}

export default TransactionTable
