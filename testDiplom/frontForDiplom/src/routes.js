import React from "react";
import { Route, Redirect } from "react-router-dom";
import AboutPage from "./pages/about/AboutPage";
import Auth from "./components/Autentification/Auth/Auth";
import Register from "./components/Autentification/Registration/Register";

const BaseRouter = () => (
  <div>
    <Route path="/" />
    <Route path="/about" component={AboutPage} />
    <Route path="/admin" exact render={() => <Redirect to="/admin" />} />
    <Route path="/auth" component={Auth} />
    <Route path="/register" component={Register} />
  </div>
);

export default BaseRouter;
