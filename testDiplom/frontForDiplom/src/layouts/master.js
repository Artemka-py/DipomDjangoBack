import React, { useEffect, useState } from 'react';
import {
  Button,
  Drawer,
  Layout,
  Menu,
  Form,
  Col,
  Row,
  Input,
  Select,
  DatePicker,
  Spin,
} from 'antd';
import { Footer } from 'antd/es/layout/layout';
import { Link } from 'react-router-dom';
import '../App.css';
import { connect } from 'react-redux';
import * as actions from '../store/actions/auth';
import axios from 'axios';

const { Header, Content } = Layout;
const { Option } = Select;

const Master = (props) => {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState(null);

  const lkHandler = async () => {
    setVisible(true);

    await axios
      .get(`http://localhost:8000/api/users/${props.username}/`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.error(err));
  };

  const onClose = () => {
    setVisible(false);
    setData(null);
  };

  useEffect(() => {
    if (window.location.pathname) console.log('robit');
    console.log(window.location.pathname);
  }, [window.location.pathname]);

  return (
    <Layout>
      <Header className="header">
        <div className="logo" />
        <Menu theme="dark" style={{ color: '#fff' }} mode="horizontal" defaultSelectedKeys={['1']}>
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
                <Form layout="vertical" hideRequiredMark>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true, message: 'Please enter user name' }]}
                      >
                        <Input placeholder="Please enter user name" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="url"
                        label="Url"
                        rules={[{ required: true, message: 'Please enter url' }]}
                      >
                        <Input
                          style={{ width: '100%' }}
                          addonBefore="http://"
                          addonAfter=".com"
                          placeholder="Please enter url"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="owner"
                        label="Owner"
                        rules={[{ required: true, message: 'Please select an owner' }]}
                      >
                        <Select placeholder="Please select an owner">
                          <Option value="xiao">Xiaoxiao Fu</Option>
                          <Option value="mao">Maomao Zhou</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="type"
                        label="Type"
                        rules={[{ required: true, message: 'Please choose the type' }]}
                      >
                        <Select placeholder="Please choose the type">
                          <Option value="private">Private</Option>
                          <Option value="public">Public</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="approver"
                        label="Approver"
                        rules={[{ required: true, message: 'Please choose the approver' }]}
                      >
                        <Select placeholder="Please choose the approver">
                          <Option value="jack">Jack Ma</Option>
                          <Option value="tom">Tom Liu</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="dateTime"
                        label="DateTime"
                        rules={[{ required: true, message: 'Please choose the dateTime' }]}
                      >
                        <DatePicker.RangePicker
                          style={{ width: '100%' }}
                          getPopupContainer={(trigger) => trigger.parentElement}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={24}>
                      <Form.Item
                        name="description"
                        label="Description"
                        rules={[
                          {
                            required: true,
                            message: 'please enter url description',
                          },
                        ]}
                      >
                        <Input.TextArea rows={4} placeholder="please enter url description" />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
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
