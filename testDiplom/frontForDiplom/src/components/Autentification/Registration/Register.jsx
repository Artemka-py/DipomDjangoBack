import React, { useEffect, useState } from 'react';
import { Checkbox, Form, Input, Modal, Button } from 'antd';
import { ExclamationCircleOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { connect } from 'react-redux';
import { Prompt } from 'react-router';
import classes from './Register.module.css';
import * as actions from '../../../store/actions/auth';
import ConfirmEmail from '../ConfirmEmail/ConfirmEmail';
import { useHistory } from 'react-router-dom';

/**
 * Страница регистрации.
 *
 * @return возвращает разметку.
 */
const Register = (props) => {
  const history = useHistory();
  const [form] = Form.useForm();
  const [confirm, setConfirm] = useState(false);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [shouldBlockNavigation, setShouldBlockNavigation] = useState(false);
  let errorMessage = [];

  // Логика завершения регистрации
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
    setUsername(values.username);
    setPassword(values.password1);
    setShouldBlockNavigation(false);
    props.onRegister(values.username, values.email, values.password1, values.password2);
  };

  // Предварительная настройка ПП
  function showPromiseConfirm() {
    Modal.confirm({
      title: 'Ура вы новый пользователь!!!',
      icon: <ExclamationCircleOutlined />,
      width: 700,
      content:
        'Теперь предлагаем вам создать новый проект или же попросите своего управляющего проектом добавить вас в уже созданный проект!',
      okText: 'Да создам новый проект!',
      cancelText: 'Подожду пока добавят в проект',
      onOk() {
        history.push('/projectscr');
      },
      onCancel() {
        history.push('/');
      },
    });
  }

  useEffect(() => {
    if (props.loading === false && (props.token || props.error)) {
      setShouldBlockNavigation(true);
      if (props.error === null) {
        showPromiseConfirm();
      }
    }
  }, [props.error, props.history, props.loading, props.token]);

  useEffect(() => {
    if (props.error === 'Пройдите сначала активацию через почту!') {
      setConfirm(true);
      setShouldBlockNavigation(false);
    }
  }, [props.error, errorMessage]);

  const authLogic = async (username, password) => {
    await props.onAuth(username, password);
  };

  useEffect(() => {
    if (!shouldBlockNavigation) {
      window.onbeforeunload = () => true;
    } else {
      window.onbeforeunload = undefined;
    }
  }, []);

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
    <div className={classes.test}>
      {errorMessage.map((e, i) => (
        <p style={{ color: 'red' }} key={i}>
          {e}
        </p>
      ))}

      {confirm ? (
        <ConfirmEmail
          username={username}
          password={password}
          authLogic={authLogic}
          confirmed={props.confirmed}
          loading={props.loading}
        />
      ) : (
        <Form form={form} name="register" onFinish={onFinish} scrollToFirstError>
          <Form.Item
            name="username"
            label="Никнейм"
            rules={[
              {
                required: true,
                message: 'Пожалуйста напишите ваш никнейм!',
                whitespace: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              {
                type: 'email',
                message: 'Некорректный E-mail!',
              },
              {
                required: true,
                message: 'Пожалуйста напишите ваш E-mail!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password1"
            label="Пароль"
            rules={[
              {
                required: true,
                message: 'Пожалуйста напишите пароль!',
              },
              {
                min: 8,
                message: 'Пароль должен состоять минимум из 8 символов!',
              },
            ]}
            hasFeedback
          >
            <Input.Password
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Form.Item
            name="password2"
            label="Подтвердите пароль"
            dependencies={['password1']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Пожалуйста потдвердите ваш пароль!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password1') === value) {
                    return Promise.resolve();
                  }

                  return Promise.reject('Оба пароля должны совпадать!');
                },
              }),
            ]}
          >
            <Input.Password
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>
          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error(
                          'Извините, но вы должны согласиться с обработкой персональных данных для дальнейшей работы!',
                        ),
                      ),
              },
            ]}
          >
            <Checkbox>
              Я согласен с{' '}
              <a
                href="https://www.severstal.com/pdf/rus/about/privacy/"
                target="_blank"
                rel="noreferrer noopener"
              >
                обработкой персональных данных
              </a>
            </Checkbox>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              style={{ width: '100%' }}
              htmlType="submit"
              loading={props.loading}
            >
              Зарегистрироваться
            </Button>
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
    onRegister: (username, email, password1, password2) =>
      dispatch(actions.authSignup(username, email, password1, password2)),
    onAuth: (username, password) => dispatch(actions.authLogin(username, password)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
