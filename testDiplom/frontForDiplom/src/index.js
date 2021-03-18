import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { createStore, compose, applyMiddleware } from 'redux';
import BugBattle from 'bugbattle';
import reducer from './store/reducers/auth';
import reportWebVitals from './reportWebVitals';
import App from './App';
import { ConfigProvider } from 'antd';
import locale from 'antd/lib/locale/ru_RU';

BugBattle.initialize('zLjvOGurHVEfdYBvQrXAEBTAd6Cl2I0T', BugBattle.FEEDBACK_BUTTON);
BugBattle.enableCrashDetector(true);
BugBattle.setMainColor('#3c94e5');

const composeEnhances = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(reducer, composeEnhances(applyMiddleware(thunk)));

const app = (
  <Provider store={store}>
    <BrowserRouter>
      <ConfigProvider locale={locale}>
        <App />
      </ConfigProvider>
    </BrowserRouter>
  </Provider>
);

ReactDOM.render(app, document.getElementById('root'));

reportWebVitals();
