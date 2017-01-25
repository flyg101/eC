import React, { Component } from 'react';

import {
  Well,
  Col,
  Button,
  Row,
  Pager,
  Form,
  FormGroup,
  FormControl,
  InputGroup,
  Checkbox,
  Accordion,
  Panel,
  ProgressBar,
  Link,
  ControlLabel
} from 'react-bootstrap';

import FontAwesome from 'react-fontawesome';
import Dropzone from 'react-dropzone';

import walletValidator from 'wallet-address-validator';
import numeral from 'numeral';

import firebase, {
  storeRef
} from '../firebase/index';


// Create Terms of Service TOS Component
const TOS = React.createClass({
  render: () => {
    return (
      <Accordion>
        <Panel header={'click to read TERMS OF SERVICE'} eventKey='1' >
          <p>Terms of Service and Trade</p>
        </Panel>
      </Accordion>
    )
  }
})


class MainPriceChecker extends Component {

  constructor(props) {
    super(props);
    var liveRate = JSON.parse(localStorage.getItem('eCRates'))
    this.state = {
      echange: JSON.parse(localStorage.getItem('echange')),
      rates: liveRate,
      tPage: 'mainPage',
      progress: null,
      uploadStatus: null,
      validator: false,
      validatorCheck: false,
      errorMessage: false,
      clickVerifier: false,
      buyButton: true,
      sellButton: true,
      buyBtcVal: 1,
      buyNgnVal: numeral((liveRate.dol * liveRate.buy)).format('0,0.[00]'),
      buyDolVal: numeral(liveRate.dol).format('0,0.[00]'),
      sellBtcVal: 1,
      sellNgnVal: numeral((liveRate.dol * liveRate.sell)).format('0,0.[00]'),
      sellDolVal: numeral(liveRate.dol).format('0,0.[00]')
    }

    //Bind Component functions to constructor
    this.loadMainPage = this.loadMainPage.bind(this)

    this.loadBuyPage1 = this.loadBuyPage1.bind(this)
    this.loadBuyPage2 = this.loadBuyPage2.bind(this)
    this.loadBuyPage3 = this.loadBuyPage3.bind(this)

    this.loadSellPage1 = this.loadSellPage1.bind(this)
    this.loadSellPage2 = this.loadSellPage2.bind(this)
    this.loadSellPage3 = this.loadSellPage3.bind(this)

    this.loadBuyComplete = this.loadBuyComplete.bind(this)
    this.loadBuyCancel = this.loadBuyCancel.bind(this)
    this.loadSellComplete = this.loadSellComplete.bind(this)
    this.loadSellCancel = this.loadSellCancel.bind(this)

    this.checkBox = this.checkBox.bind(this)
    this.validate = this.validate.bind(this)

    this.btcUpd = this.btcUpd.bind(this)
    this.ngnUpd = this.ngnUpd.bind(this)
    this.dolUpd = this.dolUpd.bind(this)

    this.sellBtcUpd = this.sellBtcUpd.bind(this)
    this.sellNgnUpd = this.sellNgnUpd.bind(this)
    this.sellDolUpd = this.sellDolUpd.bind(this)

  }

  loadMainPage() {
    this.setState({ tPage: 'mainPage', uploadStatus: null })
  }
  loadBuyPage1() {
    this.setState({ tPage: 'buyPage1' })
  }
  loadBuyPage2() {
    // Load buyPage2 and reset previous validator states
    this.setState({
      tPage: 'buyPage2',
      validator: false,
      validatorCheck: false,
      errorMessage: false,
      clickVerifier: false
    })
  }
  loadBuyPage3() {
    this.setState({
      tPage: 'buyPage3',
    })
    // This function also adds the transaction values to database

  }
  loadSellPage1() {
    this.setState({ tPage: 'sellPage1' })
  }
  loadSellPage2() {
    this.setState({ tPage: 'sellPage2' })
  }
  loadSellPage3() {
    this.setState({ tPage: 'sellPage3' })
    // This function also adds the transaction values to database
  }
  loadBuyComplete() {
    // TODO - Set transaction on db to PROCESSING

    this.setState({ tPage: 'buyComplete' })

  }
  loadBuyCancel() {
    // TODO - Set transaction on db to CANCELLED

    this.setState({ tPage: 'buyCancel' })
  }
  loadSellComplete() {
    //TODO - Set transaction in db to PROCESSING

    this.setState({ tPage: 'sellComplete' })
  }
  loadSellCancel() {
    // TODO - Set transaction in db to CANCELLED

    this.setState({ tPage: 'sellCancel' })
  }
  checkBox() {
    this.setState({ validatorCheck: !this.state.validatorCheck })
    this.state.clickVerifier ? this.setState({ validator: true }) : this.setState({ validator: false })
  }
  validate(e) {
    var address = walletValidator.validate(e.target.value);
    if (!address) {
      this.setState({ errorMessage: true })
    } else {
      this.setState({ errorMessage: false })
      this.setState({ clickVerifier: true })
    }
    if (address && this.state.validatorCheck) {
      this.setState({ validator: true })
      this.setState({ errorMessage: false })
    } else {
      this.setState({ validator: false })
    }
  }

  // Buy Price Ticker functions
  btcUpd(e) {
    if (!e.target.value || parseFloat(e.target.value) <= 0) {
      this.setState({ buyButton: false })
    } else {
      this.setState({ buyButton: true })
    }
    this.setState({
      buyBtcVal: e.target.value,
      buyNgnVal: numeral(parseFloat(e.target.value) * parseFloat(this.state.rates.dol) * parseFloat(this.state.rates.buy)).format('0,0.[00]'),
      buyDolVal: numeral(parseFloat(e.target.value) * parseFloat(this.state.rates.dol)).format('0,0.[00]')
    })
  }
  ngnUpd(e) {
    if (!e.target.value || parseFloat(e.target.value) <= 0) {
      this.setState({ buyButton: false })
    } else {
      this.setState({ buyButton: true })
    }
    this.setState({
      buyNgnVal: e.target.value,//no parsing here to allow .0 characters
      buyBtcVal: numeral(parseFloat(e.target.value) / (parseFloat(this.state.rates.buy) * (parseFloat(this.state.rates.dol)))).format('0.[00000000]'),
      buyDolVal: numeral(parseFloat(e.target.value) / parseFloat(this.state.rates.buy)).format('0,0.[00]')
    })
  }
  dolUpd(e) {
    if (!e.target.value || parseFloat(e.target.value) <= 0) {
      this.setState({ buyButton: false })
    } else {
      this.setState({ buyButton: true })
    }
    this.setState({
      buyDolVal: e.target.value,
      buyBtcVal: numeral(parseFloat(e.target.value) / parseFloat(this.state.rates.dol)).format('0.[00000000]'),
      buyNgnVal: numeral(parseFloat(e.target.value) * parseFloat(this.state.rates.buy)).format('0,0.[00]')
    })
  }

  // Sell Price Ticker functions
  sellBtcUpd(e) {
    if (!e.target.value || parseFloat(e.target.value) <= 0) {
      this.setState({ sellButton: false })
    } else {
      this.setState({ sellButton: true })
    }
    this.setState({
      sellBtcVal: e.target.value,
      sellNgnVal: numeral(parseFloat(e.target.value) * parseFloat(this.state.rates.dol) * parseFloat(this.state.rates.sell)).format('0,0.[00]'),
      sellDolVal: numeral(parseFloat(e.target.value) * parseFloat(this.state.rates.dol)).format('0,0.[00]')
    })
  }
  sellNgnUpd(e) {
    if (!e.target.value || parseFloat(e.target.value) <= 0) {
      this.setState({ sellButton: false })
    } else {
      this.setState({ sellButton: true })
    }
    this.setState({
      sellNgnVal: e.target.value,//no parsing here to allow .0 characters
      sellBtcVal: numeral(parseFloat(e.target.value) / (parseFloat(this.state.rates.sell) * (parseFloat(this.state.rates.dol)))).format('0.[00000000]'),
      sellDolVal: numeral(parseFloat(e.target.value) / parseFloat(this.state.rates.sell)).format('0,0.[00]')
    })
  }
  sellDolUpd(e) {
    if (!e.target.value || parseFloat(e.target.value) <= 0) {
      this.setState({ sellButton: false })
    } else {
      this.setState({ sellButton: true })
    }
    this.setState({
      sellDolVal: e.target.value,
      sellBtcVal: numeral(parseFloat(e.target.value) / parseFloat(this.state.rates.dol)).format('0.[00000000]'),
      sellNgnVal: numeral(parseFloat(e.target.value) * parseFloat(this.state.rates.sell)).format('0,0.[00]')
    })
  }

  render() {

    var tickerPage;

    var mainPage = (
      <div>
        <p>Select your preferred Transaction below:</p>
        <Col md={6} sm={6} xs={6} style={{ textAlign: 'right', borderRight: 30 }} >
          <br />
          <Button bsSize='large' bsStyle='success' onClick={this.loadBuyPage1} >BUY</Button>
        </Col>

        <Col md={6} sm={6} xs={6} style={{ textAlign: 'left', borderLeft: 30 }} >
          <br />
          <Button bsSize='large' bsStyle='info' onClick={this.loadSellPage1} >SELL</Button>
        </Col>
      </div>
    );

    var buyPage1 = (
      <div>
        <h5>BUY BITCOIN</h5>
        <hr />
        <p>PRICE TICKER</p>
        <div>
          <Form inline>
            <FormGroup bsSize='large' >
              <InputGroup>
                <InputGroup.Addon><b className='moneyIcon'>&#579;</b></InputGroup.Addon>
                <FormControl type='text' value={this.state.buyBtcVal} onChange={this.btcUpd} />
              </InputGroup>
              <InputGroup>
                <InputGroup.Addon><b className='moneyIcon'>&#8358;</b></InputGroup.Addon>
                <FormControl type='text' value={this.state.buyNgnVal} onChange={this.ngnUpd} />
              </InputGroup>
              <InputGroup>
                <InputGroup.Addon><b className='moneyIcon'>&#36;</b></InputGroup.Addon>
                <FormControl type='text' value={this.state.buyDolVal} onChange={this.dolUpd} />
              </InputGroup>
            </FormGroup>
            <hr />
            <Button bsStyle='primary' disabled={!this.state.buyButton} bsSize='large' onClick={this.loadBuyPage2}>
              BUY
            </Button>
          </Form>
        </div>
        <Pager>
          <Pager.Item onSelect={this.loadMainPage} >&larr; BACK</Pager.Item>
        </Pager>
      </div>
    );

    var buyPage2 = (
      <div>
        <h4>Confirmation</h4><hr />
        <form>
          <FormGroup bsSize="large">
            <p>Enter Receiving Bitcoin Wallet Address</p>
            <br />
            <b>Bitcoin Address</b>
            <FormControl type="text" placeholder="eg: 16dAwJttDm5oiSAZUYMqgWWGHso1jjSg9C" onChange={this.validate} />
            {this.state.errorMessage ? (
              <p className='redC' >Invalid Wallet Address</p>
            ) : (<i></i>)}
          </FormGroup>
        </form>

        <TOS />
        <form>
          <Checkbox checked={this.state.validatorCheck} onChange={this.checkBox} >
            I Accept the Terms of Service
          </Checkbox>
        </form>
        <br />
        <Button bsStyle='primary' disabled={!this.state.validator} bsSize='large' onClick={this.loadBuyPage3} >SUBMIT TRANSACTION</Button>
        <Pager>
          <Pager.Item onSelect={this.loadBuyPage1} >&larr; BACK</Pager.Item>
        </Pager>
      </div>
    );

    var buyPage3 = (
      <div>
        <h4>Make Payment</h4><hr />
        <Panel header={(<h5>Transaction Details</h5>)} >
          <p>Kindly complete Payment within 3 hours</p>
          <hr />
          <p><b>Bank:</b>  Diamond Bank</p><hr />
          <p><b>Account Name:</b>  Gbaski Sales Ltd.</p><hr />
          <p><b>Account Number:</b>  0123456789</p><hr />
          <p><b>Amount:</b>  45000 NGN</p><hr />
          <p><b>Transaction Reference:</b>  458T2P3W89</p><hr />
        </Panel>
        <Accordion>
          <Panel header={(<h5>Complete/Cancel Transaction</h5>)}>
            <p>After paying the specified Amount into the Bank Account, you can click the 'Payment Complete' button below.</p>
            <p>If however, you do not plan to complete this transaction, click the 'Cancel' button below, at no charge</p><hr />
            <p>To help us process your Transaction faster and more efficiently, kindly upload a proof of payment (picture of bank teller, receipt, bank statement, mobile app screenshot etc) on the next page</p>
            <p>Or send it as an email attachment to <a href="mailto:paid@echange.ng?Subject=eChange%20Payment%20Proof" target='_blank'>paid@eChange.NG</a></p>
            <hr />
            <Button bsStyle='success' bsSize='large' onClick={this.loadBuyComplete} >Payment Complete</Button>{'  '} <Button bsStyle='danger' bsSize='large' onClick={this.loadBuyCancel} >Cancel</Button>
          </Panel>
        </Accordion>
      </div>
    );

    var sellPage1 = (
      <div>
        <h5>SELL BITCOIN</h5>
        <hr />
        <p>PRICE TICKER</p>
        <div>
          <Form inline>
            <FormGroup bsSize='large' >
              <InputGroup>
                <InputGroup.Addon><b className='moneyIcon'>&#579;</b></InputGroup.Addon>
                <FormControl type='text' value={this.state.sellBtcVal} onChange={this.sellBtcUpd} />
              </InputGroup>
              <InputGroup>
                <InputGroup.Addon><b className='moneyIcon'>&#8358;</b></InputGroup.Addon>
                <FormControl type='text' value={this.state.sellNgnVal} onChange={this.sellNgnUpd} />
              </InputGroup>
              <InputGroup>
                <InputGroup.Addon><b className='moneyIcon'>&#36;</b></InputGroup.Addon>
                <FormControl type='text' value={this.state.sellDolVal} onChange={this.sellDolUpd} />
              </InputGroup>
            </FormGroup>
            <hr />
            <Button bsStyle='info' disabled={!this.state.sellButton} bsSize='large' onClick={this.loadSellPage2}>
              SELL
            </Button>
          </Form>
        </div>
        <Pager>
          <Pager.Item onSelect={this.loadMainPage} >&larr; BACK</Pager.Item>
        </Pager>
      </div>
    );

    var sellPage2 = !this.state.echange.bankDetails ? (
      <div>
        <h4>No Bank Accounts Found</h4>
        <p>Please Go to <Link to='/main/accounts' >Accounts Page</Link> to add a Bank Account</p>
        <hr />
        <Link to='/main/accounts' ><Button bsStyle='link' >&larr; Accounts Page</Button></Link>
      </div>
    ) : (
        <div>
          <h4>Confirmation</h4><hr />
          <form>
            <FormGroup>
              <ControlLabel>Select Receiving Bank Account</ControlLabel>
              <FormControl componentClass='select' placeholder='Bank Account &darr;' >
                {
                  Object.keys(this.state.echange.bankDetails).map((key, i) => {
                    var resBank = this.state.echange.bankDetails[key];
                    return (
                      <option value={(i + 1).toString() + resBank.bankName}>{resBank.bankName} | {resBank.accNum} | {resBank.accName}</option>
                    )
                  })
                }
              </FormControl>
            </FormGroup>
          </form>
          <hr/>
          <TOS />
          <form>
            <Checkbox >
              I Accept the Terms of Service
          </Checkbox>
          </form>
          <br />
          <Button bsStyle='primary' bsSize='large' onClick={this.loadSellPage3} >SUBMIT TRANSACTION</Button>
          <Pager>
            <Pager.Item onSelect={this.loadSellPage1} >&larr; BACK</Pager.Item>
          </Pager>
        </div>
      );

    var sellPage3;

    // Conditionally render complete upload message
    var barStatus;
    if (this.state.uploadStatus === 1) {
      barStatus = (<p className='redC'>Upload Failed. Please Try Again :(</p>)
    } else if (this.state.uploadStatus === 2) {
      barStatus = (<p className='greenC'>File Uploaded Successfully! :)</p>)
    } else if (this.state.uploadStatus === 3) {
      barStatus = (<p className='typewriter'>UPLOADING.........</p>)
    } else {
      barStatus = (<i></i>)
    }

    var buyComplete = (
      <div>
        <h5>Transaction 98UGDG009</h5>
        <p>Receiving Address: 16dAwJttDm5oiSAZUYMqgWWGHso1jjSg9C</p><hr />
        <p>You have marked this Transaction as Paid</p>
        <p>Kinldy upload a proof of payment below (teller, receipt, app screenshot, etc)</p>
        <p>This ensures your transaction will be processed without delay <FontAwesome name='clock-o' size='2x' /></p><hr />
        <p>Or send it as an email attachment to <a href="mailto:paid@echange.ng?Subject=eChange%20Payment%20Proof" target='_blank'>paid@eChange.NG</a></p>
        <div>
          <Dropzone style={{ borderStyle: 'dashed', borderRadius: '5px', borderWidth: '3px', borderColor: 'skyblue' }}
            onDrop={(file) => {
              var uploadTask = storeRef.child('proof/' + firebase.auth().currentUser.uid + file[0].name).put(file[0]);
              uploadTask.on('state_changed', (snapshot) => {
                this.setState({ uploadStatus: 3 })
              }, (err) => {
                this.setState({ uploadStatus: 1 })
              }, () => {
                this.setState({ uploadStatus: 2 })
              })
            } }>
            <hr />
            <p>Drag & Drop image files here or Click to select file</p>
            <p>You can upload multiple files</p>
            <hr />
            {barStatus}
          </Dropzone>
        </div>
        <hr />
        <Pager>
          <Pager.Item onSelect={this.loadMainPage} >&larr; Back to Dashboard</Pager.Item>
        </Pager>
      </div>
    );
    var buyCancel;
    var sellComplete;
    var sellCancel;

    // Condtionally render Price Ticker Page
    // by setting the value of tickerPage to page string based on state
    if (this.state.tPage === 'mainPage') {
      tickerPage = mainPage;
    } else if (this.state.tPage === 'buyPage1') {
      tickerPage = buyPage1;
    } else if (this.state.tPage === 'buyPage2') {
      tickerPage = buyPage2;
    } else if (this.state.tPage === 'buyPage3') {
      tickerPage = buyPage3;
    } else if (this.state.tPage === 'sellPage1') {
      tickerPage = sellPage1;
    } else if (this.state.tPage === 'sellPage2') {
      tickerPage = sellPage2
    } else if (this.state.tPage === 'sellPage3') {
      tickerPage = sellPage3;
    } else if (this.state.tPage === 'buyComplete') {
      tickerPage = buyComplete;
    } else if (this.state.tPage === 'buyCancel') {
      tickerPage = buyCancel;
    } else if (this.state.tPage === 'sellComplete') {
      tickerPage = sellComplete;
    } else if (this.state.tPage === 'sellCancel') {
      tickerPage = sellCancel;
    } else {
      tickerPage = mainPage;
    }

    return (
      <div>
        <Well>
          <Row className='clearfix'>
            {tickerPage}
          </Row>
        </Well>
      </div>
    )
  }
}


export default MainPriceChecker
