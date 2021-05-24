import React, { useEffect, useState } from 'react';
import {
  Button,
  Drawer,
  Layout,
  Menu,
  Input,
  DatePicker,
  Upload,
  Spin,
  Space,
  Image,
  Switch,
} from 'antd';
import { Footer } from 'antd/es/layout/layout';
import { Link } from 'react-router-dom';
import '../App.css';
import { connect } from 'react-redux';
import * as actions from '../store/actions/auth';
import axios from 'axios';
import { Offline } from 'react-detect-offline';
import {
  CalendarOutlined,
  EditOutlined,
  LoadingOutlined,
  PhoneOutlined,
  PlusOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import classes from './master.module.css';
import getCookie from '../common/parseCookies';
import { toast } from '../pages/Projects/DetailProject/DetailProject';
import moment from 'moment';
import { formatForDate } from '../common/date';

const { Header, Content } = Layout;
const dateFormat = 'YYYY/MM/DD';

/**
 * Мастер страница.
 *
 * @return возвращает разметку.
 */
const Master = (props) => {
  const [visible, setVisible] = useState(false);
  const [imgVisible, setImgVisible] = useState(false);
  const [data, setData] = useState(null);
  const [editable, setEditable] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [loadingChn, setLoadingChn] = useState(false);
  const [date, setDate] = useState(null);
  const [phone, setPhone] = useState(null);
  const [name, setName] = useState(null);
  const [middleName, setMiddleName] = useState(null);
  const [surName, setSurName] = useState(null);
  const [oldPassword, setOldPassword] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [uploadData, setUploadData] = useState({ imageUrl: null, loading: false });
  const [checked, setChecked] = useState(false);

  // Логика личного кабинета
  const lkHandler = async () => {
    setVisible(true);

    await axios
      .get(`http://localhost:8000/api/users/${props.username}/`)
      .then((res) => {
        setData(res.data);

        axios
          .get(res.data.user_image_src)
          .then(() => {
            setImgVisible(true);
            setUploadData({ imageUrl: res.data.user_image_src, loading: false });
          })
          .catch(() => setImgVisible(false));
      })
      .catch((err) => console.error(err));
  };

  const onClose = () => {
    setVisible(false);
    setData(null);
  };

  // Логика загрузки аватарки
  const uploadButton = (
    <div>
      {uploadData.loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Загрузить</div>
    </div>
  );

  useEffect(() => {
    if (window.location.pathname) console.log('robit');
  }, [window.location.pathname]);

  // Логика изменения
  const editableHandle = async (e) => {
    if (e.target.innerText === 'Изменить проект') {
      setLoadingEdit(true);
      setEditable(true);

      setDate(moment(data.birth_date, dateFormat));
      setPhone(data.phone_num);
      setName(data.first_name);
      setSurName(data.sur_name);
      setMiddleName(data.middle_name);

      setLoadingEdit(false);
    } else {
      setLoadingEdit(true);

      let newDate;
      if (date) newDate = formatForDate(date._d.toLocaleString().substr(0, 10));

      await axios
        .patch(`http://127.0.0.1:8000/api/users/${data.username}/`, {
          birth_date: newDate || data.birth_date,
          phone_num: phone || data.phone_num,
          first_name: name || data.first_name,
          sur_name: surName || data.sur_name,
          middle_name: middleName || data.middle_name,
        })
        .then(async () => {
          await lkHandler();
          toast('success', 'Данные успешно изменены!');
        });

      setEditable(false);
      setLoadingEdit(false);
    }
  };

  // Контроль изменения даты
  const handlerChangeDate = (e, e2) => {
    setDate(e);
    console.log(e);
  };

  // Логика загрузки картинки
  const uploadAction = async (e) => {
    switch (e.method) {
      case 'post': {
        setUploadData({ imageUrl: null, loading: true });
        const uploadData = new FormData();

        uploadData.append('user_image_src', e.file, e.file.name);

        await axios
          .patch(`http://127.0.0.1:8000/api/users/${data.username}/`, uploadData)
          .then((res) => {
            console.log(res.data);
            setUploadData({ imageUrl: res.data.user_image_src, loading: false });
          })
          .catch((err) => {
            toast('error', err.message);
            setUploadData({ imageUrl: data.user_image_src, loading: false });
          });

        return e.onSuccess();
      }

      default:
        return console.log('default');
    }
  };

  return (
    <Layout className={checked ? classes.inverted : classes.nonInverted}>
      <Offline polling={{ url: `http://localhost:8000/` }}>
        <h1 style={{ color: 'red' }}>Проверьте подключение к интернету!!!</h1>
      </Offline>
      <Header className="header">
        <Menu theme={'dark'} mode="horizontal" defaultSelectedKeys={['1']}>
          <Menu.Item key="1">
            <Link to="/">Главная</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/about">О сайте</Link>
          </Menu.Item>
          {props.isAuthenticated ? (
            <>
              <Menu.Item key="5">
                <Link to="/tasks">Задачи</Link>
              </Menu.Item>
              <Menu.Item key="3">
                <Link to="/projects">Проекты</Link>
              </Menu.Item>

              <Switch
                checked={checked}
                onChange={(e) => {
                  setChecked(e);
                }}
                style={{ float: 'right', marginTop: '20px', backgroundColor: 'gray' }}
                checkedChildren="Черная тема"
                unCheckedChildren="Белая тема"
              />

              <Menu.Item style={{ float: 'right' }} key="6" onClick={props.onLogout}>
                <Link to="/">Выход</Link>
              </Menu.Item>
              <Menu.Item style={{ float: 'right' }} onClick={lkHandler} key="4">
                <a>Приветствуем вас, {props.username}!</a>
              </Menu.Item>
            </>
          ) : (
            <Menu.Item style={{ float: 'right' }} key="4">
              <Link to="/auth">Авторизация</Link>
            </Menu.Item>
          )}
        </Menu>
      </Header>
      <Layout>
        <Layout style={{ padding: '0 24px 24px' }}>
          <hr />
          <hr />
          <Content className="site-layout-background">
            <main>{props.children}</main>
          </Content>
        </Layout>
        <>
          <Drawer
            visible={visible}
            width={720}
            onClose={onClose}
            footer={
              <div
                style={{
                  textAlign: 'right',
                }}
              >
                <Button onClick={onClose} style={{ marginRight: 8 }}>
                  Отмена
                </Button>
              </div>
            }
          >
            {!data ? (
              <Spin />
            ) : (
              <>
                <>
                  <Space direction={'horizontal'} size={12}>
                    {imgVisible && editable === false && (
                      <Image
                        width={100}
                        style={{
                          width: '100px',
                          height: '100px',
                        }}
                        src={data.user_image_src}
                        preview={true}
                      />
                    )}
                    {editable && (
                      <Upload
                        name="avatar"
                        listType="picture-card"
                        className={classes.avatarUploader}
                        showUploadList={false}
                        customRequest={uploadAction}
                        beforeUpload={(file) => {
                          if (file.type === 'image/jpeg' || 'image/jpg' || 'image/png') {
                            return true;
                          }
                          toast('error', 'Можно загружать только картинки!');
                          setUploadData({ imageUrl: null, loading: false });
                          return false;
                        }}
                      >
                        {uploadData.imageUrl ? (
                          <img
                            src={uploadData.imageUrl}
                            alt="Аватарка"
                            style={{ width: '100px', height: '100px' }}
                          />
                        ) : (
                          uploadButton
                        )}
                      </Upload>
                    )}

                    {editable ? (
                      <>
                        <Input
                          type={'text'}
                          onChange={(e) => setMiddleName(e.target.value)}
                          value={middleName}
                          placeholder={'Введите фамилию'}
                        />
                        <Input
                          type={'text'}
                          onChange={(e) => setName(e.target.value)}
                          value={name}
                          placeholder={'Введите имя'}
                        />
                        <Input
                          type={'text'}
                          onChange={(e) => setSurName(e.target.value)}
                          value={surName}
                          placeholder={'Введите отчество'}
                        />
                      </>
                    ) : (
                      <h2>
                        ФИО:{' '}
                        {data.middle_name.charAt(0).toUpperCase() +
                          data.middle_name.slice(1) +
                          ' ' +
                          data.first_name.charAt(0).toUpperCase() +
                          data.first_name.slice(1) +
                          ' ' +
                          (data.sur_name !== null
                            ? data.sur_name.charAt(0).toUpperCase() + data.sur_name.slice(1)
                            : '')}
                      </h2>
                    )}

                    <Button
                      onClick={editableHandle}
                      style={{ float: 'right' }}
                      type="primary"
                      loading={loadingEdit}
                    >
                      {!editable ? <EditOutlined /> : <SaveOutlined />}{' '}
                      {!editable ? 'Изменить проект' : 'Сохранить изменения'}
                    </Button>
                  </Space>

                  <hr />

                  {editable ? (
                    <>
                      <Space direction="horizontal" size={12}>
                        <h3>
                          <DatePicker
                            disabledDate={(curDate) => {
                              return curDate && curDate > moment().endOf('day');
                            }}
                            value={date}
                            onChange={handlerChangeDate}
                          />
                        </h3>
                        <h3>
                          <Input
                            type="text"
                            prefix={<PhoneOutlined />}
                            value={phone}
                            max={17}
                            onChange={(e) => {
                              if (e.target.value.length > 17) return false;
                              setPhone(e.target.value.replace(/\D/g, ''));
                            }}
                          />
                        </h3>
                        <h3>{data.email}</h3>
                      </Space>
                    </>
                  ) : (
                    <>
                      <Space direction="horizontal" size={12}>
                        <h3>
                          {data.birth_date !== null ? (
                            <>
                              <CalendarOutlined /> Дата рождения: {data.birth_date}
                            </>
                          ) : (
                            'Вы еще не указывали свой день рождения.'
                          )}
                        </h3>
                        <h3>
                          {data.phone_num !== null ? (
                            <>
                              <PhoneOutlined /> {data.phone_num}
                            </>
                          ) : (
                            'Вы еще не указывали свой номер телефона.'
                          )}
                        </h3>
                        <h3>{data.email}</h3>
                      </Space>
                    </>
                  )}
                  <hr />
                  <h2>Смена пароля: </h2>
                  <Space direction="horizontal" size={15}>
                    <Input
                      type={'password'}
                      placeholder={'Введите старый пароль'}
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                    />
                    <Input
                      type={'password'}
                      placeholder={'Введите новый пароль'}
                      value={password1}
                      onChange={(e) => setPassword1(e.target.value)}
                    />
                    <Input
                      type={'password'}
                      placeholder={'Введите подтвердите новый пароль'}
                      value={password2}
                      onChange={(e) => setPassword2(e.target.value)}
                    />
                  </Space>
                  <Button
                    type="primary"
                    loading={loadingChn}
                    onClick={async () => {
                      setLoadingChn(true);
                      if (password1 === '' || password2 === '' || oldPassword === '') {
                        setOldPassword('');
                        setPassword1('');
                        setPassword2('');
                        setLoadingChn(false);
                        return toast('error', 'Пожалуйста введите значения в поля паролей!');
                      }

                      let CSRF = getCookie('csrftoken');

                      await axios
                        .post(
                          `http://localhost:8000/rest-auth/password/change/`,
                          {
                            new_password1: password1,
                            new_password2: password2,
                            old_password: oldPassword,
                          },
                          {
                            headers: {
                              'X-CSRFToken': CSRF,
                            },
                          },
                        )
                        .then((res) => {
                          toast('success', res.data.detail);
                          setOldPassword('');
                          setPassword1('');
                          setPassword2('');
                        })
                        .catch((err) => {
                          for (let key in err.response.data) {
                            toast('error', err.response.data[key]);
                          }
                        });
                      setLoadingChn(false);
                    }}
                    style={{ marginTop: '15px' }}
                  >
                    Сменить пароль
                  </Button>
                </>
              </>
            )}
          </Drawer>
        </>
      </Layout>
      <Footer style={{ textAlign: 'end' }}>&#169;Lytkin</Footer>
    </Layout>
  );
};

const mapStateToProps = (state) => {
  return {
    username: state.username,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLogout: () => dispatch(actions.logout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Master);
