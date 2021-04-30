import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Drawer, Divider, Col, Row, Button, Spin, Input, DatePicker, Form } from 'antd';
import getCookie from '../../common/parseCookies';
import { formatForDate } from '../../common/date';
import SelectUser from './SelectUser';
import SelectProject from './SelectProject';
import SelectTask from './SelectTask';
import { UserOutlined } from '@ant-design/icons';

const { TextArea } = Input;
let realFetchData;

const AddTask = (props) => {
  const [visible, setVisible] = useState(true);
  const [project_id, setProject] = useState('');
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
          description: values.task_description,
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

  const onProjectChange = (project)=>{
    console.log('Project changed', project);
    setProject(project);
  }

  const fetchProjectData = () =>{
    
  }

   useEffect(() => {
      console.log(project_id);
      console.log('rerender');
   }, [project_id]);

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
                          message: 'Пожалуйста, напишите название задачи',
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
                <Col span={24}>
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
                          message: 'Пожалуйста, напишите описание задачи',
                        },
                    ]}
                >
                  <TextArea rows={6} 
                      placeholder="Введите описание задачи"/>
                </Form.Item>
                </Col>
              </Row>
              <Row>
                <span>Задача для проекта:</span>
                <Form.Item 
                    name="project_id" 
                    rules={[
                      {
                        required: true,
                        message: 'Пожалуйста, выберите проект',
                      },
                    ]}
                  >
                    {<SelectProject 
                    onChange = {onProjectChange}
                    />}
                </Form.Item>
              </Row>
              <Row>
                <span>Родительская задача:</span>
                <Form.Item 
                    name="parent_id" 
                    rules={[
                      {
                        // required: true,
                      },
                    ]}
                  >
                    {<SelectTask 
                      onChange
                      project_id = {project_id}
                    />}
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
                      disabled={true}
                      rules={[
                        {
                          required: true,
                          message: 'Пожалуйста, выберите постановщика задачи',
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
                        message: 'Пожалуйста выберите исполнителя',
                      },
                    ]}
                  >
                    {project_id && <SelectUser 
                      project_id = {project_id}
                    /> }
                  </Form.Item>
                </Col>
                <Col span={6} style={{textAlign: 'center'}}>
                  <p>Дата начала:</p>
                  <Form.Item 
                    name="start_date" 
                    rules={[
                      {
                        required: true,
                        message: 'Пожалуйста выберите дату начала задачи',
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
                        message: 'Пожалуйста выберите дату окончания задачи',
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