import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Drawer, Divider, Col, 
  Row, Button, Spin, Input, 
  DatePicker, Form, Select, 
  notification, 
} from 'antd';
import getCookie from '../../common/parseCookies';
import { formatForDate } from '../../common/date';
import { UserOutlined } from '@ant-design/icons';

const dateFormat = 'YYYY-MM-DD';

const { Option } = Select;
const { TextArea } = Input;
const toast = (type, message) =>
  notification[type]({
    message: message,
    placement: 'bottomLeft',
    duration: 2,
  });

const AddTask = (props) => {
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(true);
  const [finish_date, setFinishDate] = useState(null);
  const [start_date, setStartDate] = useState(null);
  const [task_name, setTaskName] = useState(null);
  const [task_description, setTaskDescription] = useState(null);
  const [task_developer_login, setTaskDeveloper] = useState(null);
  const [parent_task, setParentTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [project_id, setProjectId] = useState(null);
  const [projects, setProjects] = useState([]);

  let CSRF;

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
    window.location.assign('/tasks');
  };

  const onAddTask = (values) => {
    CSRF = getCookie('csrftoken');

    axios
      .post(`http://localhost:8000/api/tasks/`,
        {
          parent: values.parent_id || null,
          project_task: values.project_id,
          task_name: values.task_name,
          task_developer_login: values.task_developer_login,
          task_setter_login: values.task_setter_login,
          start_date: formatForDate(values.start_date._d.toLocaleString().substr(0, 10)),
          finish_date: formatForDate(values.finish_date._d.toLocaleString().substr(0, 10)),
          description: values.task_description,
          task_status: 1,
        },
        {
          headers: {
            'X-CSRFToken': CSRF,
          },
        }
      ).then((res) => {
        console.log(res);
        toast('success', 'Данные успешно сохранены!');
        setVisible(false);
        window.location.assign('/tasks');
      })
      .catch((err) => {
        toast('error', 'Произошла ошибка попробуйте еще раз! ' + err.message);
      });


  }

  const fetchTasks = async (project_id) => {
    await axios
      .get(`http://localhost:8000/tasks-projects/${project_id}/`)
      .then((res) => {
        setTasks(res.data);
        console.log(res.data);
      })
      .catch((err) => console.error(err));
  };

  const fetchDevelopers = async (project_id) => {
    await axios
      .get(`http://localhost:8000/workgroup-developers/${project_id}/`)
      .then(async (res) => {
        console.log(res.data);
        setDevelopers(res.data);
      })
      .catch((err) => console.error(err));
  };

  const fetchProjects = () =>{
    setLoading(true);

    axios
      .get(`http://localhost:8000/project-login/${props.username}/`)
      .then((res) => {
        console.log(res.data);
        setProjects(res.data);
      })
      .catch((err) => console.error(err));

    setLoading(false);
  }

  const onChangeStartDate = (date) => {
    setStartDate(date.format('YYYY-MM-DD'));
  };

  const onChangeFinishDate = (date) => {
    setFinishDate(date.format('YYYY-MM-DD'));
  };

  const onProjectChange = (project)=>{
    console.log('Project changed', project);
    setProjectId(project);
    fetchTasks(project);
    fetchDevelopers(project);
  }

  const onTaskDeveloperChange = (e) => {
    setTaskDeveloper(e.value);
  };
  // const selectParentTaskHandler = (e) => {
  //   setParentTask(e.value);
  // };
  const onTaskNameChange = (e) => {
    setTaskName(e.target.value);
  };
  const onTaskDescriptionChange = (e) => {
    console.log('Description: ', e.target.value);
    setTaskDescription(e.target.value);
  };


  

   useEffect(() => {
      setLoading(true);
      fetchProjects();
      setLoading(false);
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
                      onChange = {onTaskNameChange}
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
                  <TextArea 
                    rows={6} 
                    placeholder="Введите описание задачи"
                    onChange={onTaskDescriptionChange}
                  />
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
                    {<Select
                    showSearch
                    style={{ marginLeft: 15, width: 200 }}
                    optionFilterProp="children"
                    onChange={onProjectChange}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {projects &&
                      projects.map((val, idx) => (
                        <Option value={val.project_id} key={idx}>
                          {val.project_name}
                        </Option>
                      ))}
                  </Select> }
                </Form.Item>
              </Row>
              <Row>
                <span>Родительская задача:</span>
                <Form.Item 
                    name="parent_id" 
                    // rules={[
                    //   {
                    //     // required: true,
                    //   },
                    // ]}
                  >
                    {<Select
                    // showSearch
                    disabled={!project_id}
                    style={{ marginLeft: 15, width: 200 }}
                    // optionFilterProp="children"
                    // // onChange={selectParentTaskHandler}
                    // filterOption={(input, option) =>
                    //   option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    // }
                  >
                    {/* {!tasks ? (
                      <Option value={-1} key={-1}>
                        <Spin />
                      </Option>
                    ) :( */}
                      {tasks && tasks.map((val, idx) => (
                        <Option value={val.pk} key={idx}>
                          {val.fields.task_name}
                        </Option>
                      ))}
                  </Select> }
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
                    {<Select
                    showSearch
                    disabled={!project_id}
                    style={{ marginLeft: 15, width: 200 }}
                    optionFilterProp="children"
                    onChange={onTaskDeveloperChange}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {developers &&
                      developers.map((val, idx) => (
                        <Option value={val.developer_login} key={idx}>
                          {val.developer_login}
                        </Option>
                      ))}
                  </Select> }
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
                      onChange={onChangeStartDate} 
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
                    <DatePicker onChange={onChangeFinishDate}/>
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