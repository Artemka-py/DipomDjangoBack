import * as actionTypes from './actionsTypes';
import axios from 'axios';
import getCookie from '../../common/parseCookies';

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

export const authSuccess = (token, username) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    token,
    username,
  };
};

export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error,
  };
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('expirationDate');
  localStorage.removeItem('username');
  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};

export const checkAuthTimeout = (expirationDate) => {
  return (dispatch) => {
    setTimeout(() => dispatch(logout()), expirationDate * 1000);
  };
};

export const authLogin = (username, password) => {
  return (dispatch) => {
    dispatch(authStart());

    const CSRF = getCookie('csrftoken');

    axios
      .get(`http://localhost:8000/api/users/${username}/`)
      .then((res) => {
        console.log(res.data.is_Active === true);
        if (res.data.is_Active === false) {
          dispatch(authFail('Пройдите сначала активацию через почту!'));
        } else {
          axios
            .post(
              'http://127.0.0.1:8000/rest-auth/login/',
              {
                username,
                password,
              },
              {
                headers: {
                  'X-CSRFToken': CSRF,
                },
              },
            )
            .then((res) => {
              const token = res.data.key;
              const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
              localStorage.setItem('token', token);
              localStorage.setItem('expirationDate', expirationDate.toString());
              localStorage.setItem('username', username);
              dispatch(authSuccess(token, username));
              dispatch(checkAuthTimeout(3600));
            })
            .catch((err) => {
              console.log(err);
              dispatch(authFail(err));
            });
        }
      })
      .catch();
  };
};

export const authSignup = (username, email, password1, password2) => {
  return (dispatch) => {
    dispatch(authStart());

    const CSRF = getCookie('csrftoken');

    axios
      .post(
        'http://127.0.0.1:8000/rest-auth/registration/',
        {
          username,
          email,
          password1,
          password2,
        },
        {
          headers: {
            'X-CSRFToken': CSRF,
          },
        },
      )
      .then((res) => {
        // const token = res.data.key;
        // const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
        // localStorage.setItem('token', token);
        // localStorage.setItem('expirationDate', expirationDate.toString());
        // dispatch(authSuccess(token, username));
        // dispatch(checkAuthTimeout(3600));
        dispatch(authLogin(username, password1));
      })
      .catch((err) => {
        dispatch(authFail(err));
      });
  };
};

export const authCheckState = () => {
  return (dispatch) => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    if (token === undefined && username === undefined) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem('expirationDate'));
      if (expirationDate <= new Date()) {
        dispatch(logout());
      } else {
        dispatch(authSuccess(token, username));
        dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000));
      }
    }
  };
};
