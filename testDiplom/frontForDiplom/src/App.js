import React from "react";
import Master from "./layouts/master";
import "antd/dist/antd.css";
import * as actions from "./store/actions/auth";
import { connect } from "react-redux";
import BaseRouter from "./routes";
import { BrowserRouter as Router } from "react-router-dom";

const App = (props) => {
  props.onTryAutoSignup();

  return (
    <div>
      <Router>
        <Master {...props}>
          <BaseRouter />
        </Master>
      </Router>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.token !== null,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
