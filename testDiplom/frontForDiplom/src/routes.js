import React from 'react';
import { Route, Redirect, Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import AboutPage from './pages/about/AboutPage';
import Auth from './components/Autentification/Auth/Auth';
import Register from './components/Autentification/Registration/Register';
import Project from './pages/Projects/Project';
import Tasks from './pages/Tasks/Tasks';
import DetailProject from './pages/Projects/DetailProject/DetailProject';
import HomePage from './pages/HomePage/HomePage';

const customHistory = createBrowserHistory();

const BaseRouter = ({ username, isAuthenticated }) => (
  <div>
    <Route path="/" exact component={HomePage} />
    <Route path="/about" component={AboutPage} />
    <Route path="/admin" exact render={() => <Redirect to="/admin" />} />
    <Route path="/auth" component={Auth} />
    <Route path="/register" component={Register} />
    {isAuthenticated && (
      <>
        <Route path="/project-detail/:id" component={DetailProject} />
        <Route path="/projects:cr" component={Project} />
        <Route path="/projects" component={Project} />
        <Route path="/tasks" component={Tasks} />
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
