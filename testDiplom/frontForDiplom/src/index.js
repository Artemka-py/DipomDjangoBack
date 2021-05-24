import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { createStore, compose, applyMiddleware } from 'redux';
import BugBattle from 'bugbattle';
import reducer from './store/reducers/auth';
import reportWebVitals from './reportWebVitals';
import { ConfigProvider } from 'antd';
import locale from 'antd/lib/locale/ru_RU';
import mixpanel from 'mixpanel-browser';
import PreLoader from './components/PreLoader/PreLoader.jsx';
import { toast } from './pages/Projects/DetailProject/DetailProject';
const App = lazy(() => import('./App'));

// Подключение мониторинга в реальном времени
mixpanel.init('087836e72b7918aa48ee6cee520596da');

// Подключение и инициализация багрепорта для пользователей
BugBattle.initialize('zLjvOGurHVEfdYBvQrXAEBTAd6Cl2I0T', BugBattle.FEEDBACK_BUTTON);
BugBattle.enableCrashDetector(true);
BugBattle.setMainColor('#3c94e5');

// Подключение плагина для разработки
const composeEnhances = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Создание общего хранилища данных
export const store = createStore(reducer, composeEnhances(applyMiddleware(thunk)));

// Функция проверяющая браузер, на котором запустился сайт
var browser = (function () {
  var test = function (regexp) {
    return regexp.test(window.navigator.userAgent);
  };
  switch (true) {
    case test(/edg/i):
      toast('warning', 'Извините, но наш сайт может не правильно отрабатывать в вашем бразуере!');
      return 'edge';
    case test(/opr/i) && (!!window.opr || !!window.opera):
      toast('warning', 'Извините, но наш сайт может не правильно отрабатывать в вашем бразуере!');
      return 'opera';
    case test(/chrome/i) && !!window.chrome:
      return 'chrome';
    case test(/trident/i):
      toast('warning', 'Извините, но наш сайт может не правильно отрабатывать в вашем бразуере!');
      return 'ie';
    case test(/firefox/i):
      toast('warning', 'Извините, но наш сайт может не правильно отрабатывать в вашем бразуере!');
      return 'firefox';
    case test(/safari/i):
      toast('warning', 'Извините, но наш сайт может не правильно отрабатывать в вашем бразуере!');
      return 'safari';
    default:
      return 'other';
  }
})();

/**
 * Роутер всего приложения.
 *
 * @return все приложение.
 */
const app = (
  <Suspense fallback={<PreLoader />}>
    <Provider store={store}>
      <BrowserRouter>
        <ConfigProvider locale={locale}>
          <App />
        </ConfigProvider>
      </BrowserRouter>
    </Provider>
  </Suspense>
);

ReactDOM.render(app, document.getElementById('root'));

reportWebVitals();
