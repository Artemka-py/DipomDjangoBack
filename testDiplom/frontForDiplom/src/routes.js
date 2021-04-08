import React from 'react';
import { Route, Redirect, Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import AboutPage from './pages/about/AboutPage';
import Auth from './components/Autentification/Auth/Auth';
import Register from './components/Autentification/Registration/Register';
import Project from './pages/Projects/Project';
import Task from './pages/Tasks/Task';
import { connect } from 'react-redux';

const customHistory = createBrowserHistory();

const BaseRouter = ({ username, isAuthenticated }) => (
  <div>
    <Route path="/" />
    <Route path="/about" component={AboutPage} />
    <Route path="/admin" exact render={() => <Redirect to="/admin" />} />
    <Route path="/auth" component={Auth} />
    <Route path="/register" component={Register} />
    {isAuthenticated === true && (
      <>
        <Route path="/projects" component={Project} />
        <Route path="/tasks" component={Task} />
        <Route path="/projects/:id" exact component="" />
      </>
    )}
  </div>
);

const mapStateToProps = (state) => {
  return {
    username: state.username,
  };
};

export default BaseRouter;
