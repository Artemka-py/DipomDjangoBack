import React, { useState, useEffect } from 'react';
import { KeyOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import { toast } from '../../../pages/Projects/DetailProject/DetailProject';
import axios from 'axios';

/**
 * Подтверждение почты пользователя
 *
 * @param {string} username
 * @param {string} password
 * @param {function} authLogic
 * @param {boolean} loading
 * @return возвращает разметку.
 */
const ConfirmEmail = ({ username, password, authLogic, loading }) => {
  const [key, setKey] = useState('');
  const [keyData, setKeyData] = useState(null);

  const handleKeyChange = (e) => {
    setKey(e.target.value);
  };

  // Проверка ключа пользователя
  const handleSubmitKey = () => {
    if (key == keyData)
      axios
        .patch(`http://localhost:8000/api/users/${username}/`, {
          is_Active: true,
        })
        .then(() => {
          authLogic(username, password);
        })
        .catch((err) => toast('error', err.message));
    else {
      toast('warning', 'Не правильный ключ!');
      setKey('');
    }
  };

  // Отправка письма
  const sendEmail = () => {
    axios
      .get(`http://localhost:8000/verify-email/${username}/`)
      .then((res) => {
        console.log(res.data);
        setKeyData(res.data);
      })
      .catch((err) => toast('error', err.message));
  };

  useEffect(() => {
    sendEmail();
  }, []);

  return (
    <>
      <h2>Письмо было отправлено на вашу почту!</h2>
      <h1>Введите код из письма на вашей почте!</h1>
      <Input
        size={'middle'}
        value={key}
        onChange={handleKeyChange}
        style={{ width: '400px' }}
        prefix={<KeyOutlined className="site-form-item-icon" />}
        placeholder="Введите ключ"
        disabled={loading}
      />
      <Button
        type="primary"
        htmlType="submit"
        style={{ width: '400px', marginTop: '15px' }}
        className="login-form-button"
        onClick={handleSubmitKey}
        loading={loading}
        disabled={key.length < 6}
      >
        Подтвердить
      </Button>
    </>
  );
};

export default ConfirmEmail;
