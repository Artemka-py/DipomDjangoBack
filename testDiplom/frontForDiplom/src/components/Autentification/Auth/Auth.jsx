import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import './Auth.css';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions/auth';
import { NavLink, useHistory } from 'react-router-dom';
import { useEffect } from 'react';

// const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const Auth = (props) => {
  const history = useHistory();
  let errorMessage = null;

  const onFinish = async (values) => {
    console.log('Received values of form: ', values);
    props.onAuth(values.username, values.password);
    // console.log(props.loading);
  };

  useEffect(() => {
    if (props.loading === false && (props.token || props.error))
      if (props.error === null) history.push('/');
  }, [props.error, props.history, props.loading, props.token]);

  const onFinishFailed = (errorInfo) => {};

  if (props.error || errorMessage) {
    errorMessage = <p style={{ color: 'red' }}>{props.error.response.data.non_field_errors}</p>;
  }

  return (
    <div style={{ marginLeft: '40%', height: '100vh', marginTop: '40px' }}>
      {errorMessage}
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

          <a className="login-form-forgot" style={{ float: 'right' }} href="">
            Забыли пароль?
          </a>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ width: '100%' }}
            className="login-form-button"
            loading={props.loading}
          >
            Войти
          </Button>
          <br />
          <br />
          Или <NavLink to="/register">зарегистрируйтесь сейчас!</NavLink>
        </Form.Item>
      </Form>
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
