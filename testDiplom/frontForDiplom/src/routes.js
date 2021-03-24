import React from 'react';
import { Route, Redirect, Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import AboutPage from './pages/about/AboutPage';
import Auth from './components/Autentification/Auth/Auth';
import Register from './components/Autentification/Registration/Register';
import Project from './pages/Projects/Project';
<<<<<<< Updated upstream
import Task from './pages/Tasks/Task'
=======
// import Task from './pages/Tasks/Task'
>>>>>>> Stashed changes
import Tasks_list from './pages/Tasks/Tasks_list';

const customHistory = createBrowserHistory();


const BaseRouter = () => (
  <div>
    <Route path="/" />
    <Route path="/about" component={AboutPage} />
    <Route path="/admin" exact render={() => <Redirect to="/admin" />} />
    <Route path="/auth" component={Auth} />
    <Route path="/register" component={Register} />
    <Route path="/projects" component={Project} />
    <Route path="/tasks" component={Tasks_list} />
    <Route path="/projects/:id" exact component="" />
  </div>
);

export default BaseRouter;
