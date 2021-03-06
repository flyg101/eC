import React, { Component } from 'react';
import * as actions from '../firebase/actions';

import {
  Panel,
  Button,
  Row,
  Col
} from 'react-bootstrap';

import FontAwesome from 'react-fontawesome';
import { LinkContainer } from 'react-router-bootstrap';

class Signup extends Component {
  handleGoogleSignup() {
    actions.startGoogleLogin();
  }
  handleFacebookSignup() {
    actions.startFacebookLogin();
  }
  render() {
    return (
      <div className='isCenter'>
        <Panel>
          <Row className='clearfix'>
            <Col md={4} mdOffset={4} sm={6} smOffset={3} xs={10} xsOffset={1} >
              <h4>SIGNUP</h4>
              <br />
              <Button onClick={this.handleFacebookSignup} bsSize='large' className='btn-social btn-facebook' block><FontAwesome name='facebook' /> Signup with Facebook </Button>
              <br />
              <Button onClick={this.handleGoogleSignup} bsSize='large' className='btn-social btn-google' block><FontAwesome name='google' /> Signup with Google </Button>
              <hr />
              <h4>OR...</h4>
              <hr />
              <br />
              <LinkContainer to='/login' ><Button><FontAwesome name='sign-in' size='2x' /> LOGIN WITH SOCIAL ACCOUNT</Button></LinkContainer>
              <br />
              <FontAwesome name='bitcoin' size='3x' />
              <br />
            </Col>
          </Row>

        </Panel>
      </div>
    );
  }
}


export default Signup;
