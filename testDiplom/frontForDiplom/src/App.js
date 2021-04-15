import React from 'react';
import Master from './layouts/master';
import 'antd/dist/antd.css';
import * as actions from './store/actions/auth';
import { connect } from 'react-redux';
import BaseRouter from './routes';
import { BrowserRouter as Router } from 'react-router-dom';

const App = (props) => {
  props.onTryAutoSignup();

  return (
    <div>
      <Router>
        <Master {...props}>
          <BaseRouter isAuthenticated={props.isAuthenticated} />
        </Master>
      </Router>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.token !== null,
});

const mapDispatchToProps = (dispatch) => ({
  onTryAutoSignup: () => dispatch(actions.authCheckState()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
