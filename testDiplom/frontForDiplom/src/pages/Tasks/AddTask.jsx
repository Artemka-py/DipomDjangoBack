import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Drawer, Divider, Col, Row, Button, Spin, Input, DatePicker, Form } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import getCookie from '../../common/parseCookies';
import { formatForDate } from '../../common/date';
import SelectUser from './SelectUser';

const { TextArea } = Input;
let realFetchData;

const AddTask = (props) => {
  const [visible, setVisible] = useState(true);
  let CSRF;

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
    window.location.assign('/tasks');
  };

  const onAddTask = (values) => {
    console.log("Create data: ");
    console.log(values);
    CSRF = getCookie('csrftoken');

    axios
      .post(`http://localhost:8000/api/tasks/`,
        {
          parent_id: null,
          project_task_id: null,
          task_name: values.task_name,
          task_developer_login: values.task_developer_login,
          task_setter_login: values.task_setter_login,
          start_date: formatForDate(values.start_date._d.toLocaleString().substr(0, 10)),
          finish_date: formatForDate(values.finish_date._d.toLocaleString().substr(0, 10)),
          parent:null,
          task_stage: 1,
        },
        {
          headers: {
            'X-CSRFToken': CSRF,
          },
        }
      )
      .catch((err) => console.error(err));
  }

  function onChangeDate(date, dateString) {
    console.log(date, dateString);
  }

  // useEffect(() => {
  // }, [props.username]);

  return (
    <>
      <Drawer
          width={840}
          placement="right"
          closable={false}
          onClose={onClose}
          visible={visible}
        >
          <>
            <Form 
              hideRequiredMark 
              onFinish={onAddTask}
              initialValues={{
                task_setter_login: props.username,
              }}
            >
              <Row>
                <Col span={16}>
                  <Form.Item
                    name="task_name" 
                    rules={[
                        {
                          required: true,
                        },
                    ]}
                  >
                    <Input
                      placeholder="Название задачи"
                    />
                  </Form.Item>
                </Col>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
                <Col span={8}>
                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    style={{float: 'right'}}
                    >
                    Сохранить
                  </Button>
                </Form.Item>
                </Col>
              </Row>
              <Divider />
              <Row>
                <p 
                  className="site-description-item-profile-p" 
                  style={{ 
                    marginBottom: 12,
                    fontSize: '18px',
                    fontWeight: 'bold'
                  }}>
                  Описание
                </p>
                <Form.Item
                    name="task_description" 
                    rules={[
                        {
                          required: true,
                        },
                    ]}
                >
                  <TextArea rows={6} 
                      placeholder="Введите описание задачи"/>
                </Form.Item>
              </Row>
              <Divider />
              <Row>
                <Col 
                  span={6} 
                  style={{textAlign: 'center'}}>
                  <p>Постановщик:</p>
                    <Form.Item 
                      name="task_setter_login" 
                      disabled 
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Input prefix={<UserOutlined/>}/>
                    </Form.Item>
                </Col>
                <Col span={6} style={{textAlign: 'center'}}>
                  <p>Исполнитель:</p>
                  <Form.Item 
                    name="task_developer_login" 
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    {/* <SelectUser 
                    project_id = {DataCue.project_task_id}
                    /> */}
                  </Form.Item>
                </Col>
                <Col span={6} style={{textAlign: 'center'}}>
                  <p>Дата начала:</p>
                  <Form.Item 
                    name="start_date" 
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <DatePicker 
                      allowClear="false" 
                      onChange={onChangeDate} 
                    />
                  </Form.Item>
                </Col>
                <Col span={6} style={{textAlign: 'center'}}>
                  <p>Дата окончания:</p>
                  <Form.Item 
                    name="finish_date" 
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <DatePicker onChange={onChangeDate}/>
                  </Form.Item>
                </Col>
              </Row>
              <Divider />
            </Form>
          </>
        </Drawer>
      </>
  );
};

const mapStateToProps = (state) => {
  return {
    username: state.username,
  };
};

export default connect(mapStateToProps)(AddTask);