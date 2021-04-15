import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import  { Redirect, useParams } from 'react-router-dom';
import { Drawer, Divider, Col, Row, Button, Spin, Input, DatePicker, Form } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import moment from 'moment';
import getCookie from '../../common/parseCookies';
import { formatForDate } from '../../common/date';

const { TextArea } = Input;
let realFetchData;

const Task = (props) => {
  const [visible, setVisible] = useState(true);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { task_id }= useParams();
  const [editable, setEditable] = useState(false);
  let getFetchData;
  let CSRF;

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
    window.location.assign('/tasks');
  };

  const onClickEdit = () => {
    setEditable(true);
  }

  const onEditTask = (values) => {
    console.log("Update data: ");
    console.log(values);
    CSRF = getCookie('csrftoken');

    axios
      .put(`http://localhost:8000/api/tasks/${task_id}/`,
        {
          task_name: values.task_name,
          task_developer_login: values.task_developer_login,
          task_setter_login: values.task_setter_login,
          start_date: formatForDate(values.start_date._d.toLocaleString().substr(0, 10)),
          finish_date: formatForDate(values.finish_date._d.toLocaleString().substr(0, 10)),
        },
        {
          headers: {
            'X-CSRFToken': CSRF,
          },
        },
      )
      .catch((err) => console.error(err));
    setEditable(false);
  }

  const fetchData = async () => {
    await axios
      .get(`http://localhost:8000/api/tasks/${task_id}/`)
      .then(async (res) => {
        console.log(res.data);
        setData(res.data);
      })
      .catch((err) => console.error(err));
  }

  function onChangeDate(date, dateString) {
    console.log(date, dateString);
  }

  useEffect(() => {
    setLoading(true);
    fetchData().then(setLoading(false));
    realFetchData = setInterval(fetchData, 1000);

    return () => clearInterval(realFetchData);
  }, [props.username]);

  return (
    <>
      <Drawer
          width={640}
          placement="right"
          closable={false}
          onClose={onClose}
          visible={visible}
          editable = {editable}
        >
          {!data ? <Spin /> : (
          <>
            <Form layout="vertical" hideRequiredMark onFinish={onEditTask}>
              <Row>
                <Col span={16}>
                  {editable ? (
                  <Form.Item
                    name="task_name" 
                    rules={[
                        {
                          required: true,
                        },
                    ]}
                  >
                    <Input 
                        defaultValue={data.task_name}
                    />
                  </Form.Item>):
                  (<p 
                    className="site-description-item-profile-p" 
                    style={{ 
                      marginBottom: 24,
                      fontSize: '24px',
                      fontWeight: 'bold'}}
                    >
                      {data.task_name}
                  </p>)}
                </Col>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
                <Col span={8}>
                  {editable ? (
                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    style={{float: 'right'}}
                    >
                    Сохранить
                  </Button>
                </Form.Item>):
                  (<Button 
                    style={{float: 'right'}}
                    htmlType="button" 
                    onClick={onClickEdit}
                    >
                    Редактировать
                  </Button>)}
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
                {editable ? 
                (/*<Form.Item
                    name="task_description" 
                    rules={[
                        {
                          required: true,
                        },
                    ]}
                  >*/
                    <TextArea 
                    rows={6} 
                    defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod temt
                    por incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                    />
                /*</Form.Item>*/ 
                ): 
                (<p style={{ marginBottom: 24}}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod temt
                por incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>)
                }
              </Row>
              <Divider />
              <Row>
                <Col 
                  span={6} 
                  style={{textAlign: 'center'}}>
                  <p>Постановщик:<br></br> 
                    {editable ? (
                    <Form.Item 
                        name="task_setter_login" 
                        rules={[
                            {
                            required: true,
                            },
                        ]}
                    >
                        <Input 
                        defaultValue={data.task_setter_login} 
                        prefix={<UserOutlined/>} 
                        />
                    </Form.Item>):
                    (<b>
                      {data.task_setter_login}
                    </b>)}
                  </p>
                </Col>
                <Col span={6} style={{textAlign: 'center'}}>
                  <p>Исполнитель: <br></br> 
                    {editable ? (
                    <Form.Item 
                        name="task_developer_login" 
                        rules={[
                            {
                            required: true,
                            },
                        ]}
                    >
                        <Input 
                        defaultValue={data.task_developer_login} 
                        prefix={<UserOutlined/>} 
                        />
                    </Form.Item>):
                    (<b>
                      {data.task_developer_login}
                    </b>)}
                  </p>
                </Col>
                <Col span={6} style={{textAlign: 'center'}}>
                  <p>Дата начала: <br></br>
                    {editable ? (
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
                        defaultValue={moment(data.start_date, "YYYY-MM-dd") }
                        />
                    </Form.Item>):
                    (<b>{data.start_date}</b>)}
                  </p>
                </Col>
                <Col span={6} style={{textAlign: 'center'}}>
                  <p>Дата окончания: <br></br>
                    {editable ? (
                    <Form.Item 
                        name="finish_date" 
                        rules={[
                            {
                            required: true,
                            },
                        ]}
                    >
                        <DatePicker onChange={onChangeDate} 
                        defaultValue={moment(data.finish_date, "YYYY-MM-dd")}
                        />
                    </Form.Item>):
                    (<b>{data.finish_date}</b>)}
                  </p>
                </Col>
              </Row>
              <Divider />
            </Form>
          </>
          )}
          
        </Drawer>
      </>
  );
};

const mapStateToProps = (state) => {
  return {
    username: state.username,
  };
};

export default connect(mapStateToProps)(Task);