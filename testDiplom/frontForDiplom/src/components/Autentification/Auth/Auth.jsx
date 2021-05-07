import { Form, Input, Button, Checkbox, Statistic, Space } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import './Auth.css';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions/auth';
import { NavLink, useHistory } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import ConfirmEmail from '../ConfirmEmail/ConfirmEmail';
import moment from 'moment';

const { Countdown } = Statistic;

const Auth = (props) => {
  const history = useHistory();
  const [confirmEmail, setConfirmEmail] = useState(false);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [tryAuth, setTryAuth] = useState(0);
  let errorMessage = [];

  const onFinish = async (values) => {
    setTryAuth(tryAuth + 1);
    setUsername(values.username);
    setPassword(values.password);
    authLogic(values.username, values.password);
  };

  const authLogic = async (username, password) => {
    await props.onAuth(username, password);
  };

  useEffect(() => {
    if (props.loading === false && (props.token || props.error))
      if (props.error === null) history.push('/');
  }, [props.error, props.history, props.loading, props.token]);

  const onFinishFailed = (errorInfo) => {
    setTryAuth(tryAuth + 1);
  };

  useEffect(() => {
    if (props.error === 'Пройдите сначала активацию через почту!') {
      setConfirmEmail(true);
    }
  }, [props.error, errorMessage]);

  if (props.error || errorMessage.length !== 0) {
    if (typeof props.error.response === 'undefined') {
      errorMessage.push(props.error);
    } else {
      for (let key in props.error.response.data) {
        errorMessage.push(props.error.response.data[key]);
      }
    }
  }

  return (
    <div style={{ marginLeft: '40%', height: '100vh', marginTop: '40px' }}>
      {errorMessage.map((e, i) => (
        <p style={{ color: 'red' }} key={i}>
          {e}
        </p>
      ))}
      {confirmEmail ? (
        <ConfirmEmail
          username={username}
          password={password}
          authLogic={authLogic}
          confirmed={props.confirmed}
          loading={props.loading}
        />
      ) : (
        <Form
          name="normal_login"
          className="login-form"
          style={{ maxWidth: '300px' }}
          onFinishFailed={onFinishFailed}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: 'Пожалуйста напишите свой логин!',
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Никнейм"
              disabled={props.loading}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Пожалуйста напишите свой пароль!',
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Пароль"
              disabled={props.loading}
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Запомнить меня</Checkbox>
            </Form.Item>

            {/*<a className="login-form-forgot" style={{ float: 'right' }} href="">*/}
            {/*  Забыли пароль?*/}
            {/*</a>*/}
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: '100%' }}
              className="login-form-button"
              loading={props.loading}
              disabled={tryAuth >= 3}
            >
              Войти
            </Button>
            {tryAuth >= 3 ? (
              <>
                <hr />
                <Space direction="horizontal" size={'small'}>
                  <Countdown
                    title={'Попробуйте еще раз через:'}
                    value={Date.now() + 1000 * 60}
                    onFinish={() => setTryAuth(2)}
                  />
                </Space>
              </>
            ) : null}
            <br />
            <br />
            Или <NavLink to="/register">зарегистрируйтесь сейчас!</NavLink>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    loading: state.loading,
    error: state.error,
    token: state.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAuth: (username, password) => dispatch(actions.authLogin(username, password)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
