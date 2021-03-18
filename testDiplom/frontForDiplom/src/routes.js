import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import AboutPage from './pages/about/AboutPage'
import Auth from './components/Autentification/Auth/Auth'
import Register from './components/Autentification/Registration/Register'
import Project from './pages/Projects/Project'
import Task from './pages/Tasks/Task'

const BaseRouter = () => (
  <div>
    <Route path="/" />
    <Route path="/about" component={AboutPage} />
    <Route path="/admin" exact render={() => <Redirect to="/admin" />} />
    <Route path="/auth" component={Auth} />
    <Route path="/register" component={Register} />
    <Route path="/projects" component={Project} />
    <Route path="/tasks" component={Task} />
  </div>
)

export default BaseRouter
