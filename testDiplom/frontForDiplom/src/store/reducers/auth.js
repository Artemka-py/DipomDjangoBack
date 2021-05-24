import * as actionTypes from '../actions/actionsTypes';
import updateObject from '../utility';

// Создание начального состояния
const initialState = {
  token: null,
  error: null,
  loading: false,
  username: null,
  confirmed: false,
};

// Логика изменения стэйта.

const authStart = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: true,
  });
};

const authSuccess = (state, action) => {
  return updateObject(state, {
    token: action.token,
    username: action.username,
    error: null,
    loading: false,
    confirmed: true,
  });
};

const authFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false,
    username: null,
    confirmed: false,
  });
};

const authLogout = (state, action) => {
  return updateObject(state, {
    token: null,
    username: null,
    confirmed: false,
  });
};

// Вызывает логику и изменяет глобальный стейт в зависимости от события.
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START:
      return authStart(state, action);
    case actionTypes.AUTH_SUCCESS:
      return authSuccess(state, action);
    case actionTypes.AUTH_FAIL:
      return authFail(state, action);
    case actionTypes.AUTH_LOGOUT:
      return authLogout(state, action);
    default:
      return state;
  }
};

export default reducer;
