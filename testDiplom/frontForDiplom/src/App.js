import React from 'react';
import Master from './layouts/master';
import 'antd/dist/antd.css';
import * as actions from './store/actions/auth';
import { connect } from 'react-redux';
import BaseRouter from './routes';
import { BrowserRouter as Router } from 'react-router-dom';

/**
 * Роутер всего приложения.
 *
 * @param {any} props Прокинутые переменные.
 * @return возвращает логику работы, оболочку и сами компоненты приложения.
 */
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

// Подключение store хранилища данных и забор нужных данных
const mapStateToProps = (state) => ({
  isAuthenticated: state.token !== null,
});

// Использование общей логики всего приложения
const mapDispatchToProps = (dispatch) => ({
  onTryAutoSignup: () => dispatch(actions.authCheckState()),
});

// Эксопрт компонента
export default connect(mapStateToProps, mapDispatchToProps)(App);
