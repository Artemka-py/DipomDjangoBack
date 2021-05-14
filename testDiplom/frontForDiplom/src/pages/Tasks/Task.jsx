import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Redirect, useParams } from 'react-router-dom';
import {
  Drawer,
  Divider,
  Col,
  Row,
  Button,
  Spin,
  Input,
  DatePicker,
  Select,
  notification,
  Tabs,
  Comment,
  Avatar,
  List,
} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import moment from 'moment';
import getCookie from '../../common/parseCookies';
import { formatForDate } from '../../common/date';

const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;
const dateFormat = 'YYYY-MM-DD';
const toast = (type, message) =>
  notification[type]({
    message: message,
    placement: 'bottomLeft',
    duration: 2,
  });

const Task = (props) => {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(true);
  const [data, setData] = useState(null);
  const [finish_date, setFinishDate] = useState(null);
  const [start_date, setStartDate] = useState(null);
  const { task_id } = useParams();
  const [editable, setEditable] = useState(false);
  const [task_name, setTaskName] = useState(null);
  const [task_description, setTaskDescription] = useState(null);
  const [task_developer_login, setTaskDeveloper] = useState(null);
  const [parent_task, setParentTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [comments, setComments] = useState([]);
  const [issues, setIssues] = useState([]);
  const [newComment, setNewComment] = useState(null);
  const [newIssue, setNewIssue] =useState({});
  const [project_id, setProjectId] = useState(null);
  const [project, setProject] = useState({});

  let realFetchData;
  let CSRF;

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
    window.location.assign('/tasks');
  };

  const onClickEdit = async () => {
    await fetchTasks(project_id);
    await fetchDevelopers(project_id);
    setEditable(true);
  };

  const onChangeStartDate = (date) => {
    setStartDate(date.format('YYYY-MM-DD'));
  };

  const onChangeFinishDate = (date) => {
    setFinishDate(date.format('YYYY-MM-DD'));
  };

  const onEditTask = () => {
    console.log('Update data: ');
    CSRF = getCookie('csrftoken');

    let updatedValues = {
      task_name: task_name || data.task_name,
      task_developer_login: task_developer_login || data.task_developer_login,
      start_date: start_date || data.start_date,
      finish_date: finish_date || data.finish_date,
      parent: parent_task || data.parent,
      description: task_description || data.description,
    };
    console.log(updatedValues);

    axios
      .patch(`http://localhost:8000/api/tasks/${task_id}/`, {
        task_name: task_name || data.task_name,
        task_developer_login: task_developer_login || data.task_developer_login,
        start_date: start_date || data.start_date,
        finish_date: finish_date || data.finish_date,
        parent: parent_task || data.parent,
        description: task_description || data.description,
      })
      .then(async (res) => {
        await fetchData();
        toast('success', 'Данные успешно изменены!');
      })
      .catch((err) => {
        toast('error', 'Произошла ошибка попробуйте еще раз! ' + err.message);
      });

    setEditable(false);
  };

  const fetchData = async () => {
    await axios
      .get(`http://localhost:8000/api/tasks/${task_id}/`)
      .then((res) => {
        setData(res.data);
        setProjectId(res.data.project_task);
        fetchProjectData(res.data.project_task);
        fetchComments(task_id);
        fetchIssues(task_id);
        setFinishDate(res.data.finish_date);
        setStartDate(res.data.start_date);
        if (res.data.parent) {
          fetchParentTask(res.data.parent);
        }
      })
      .catch((err) => console.error(err));
  };

  const fetchProjectData = async (project_id) => {
    await axios
      .get(`http://localhost:8000/api/projects/${project_id}/`)
      .then((res) => {
        setProject(res.data);
      })
      .catch((err) => console.error(err));
  };

  const fetchTasks = async (project_id) => {
    await axios
      .get(`http://localhost:8000/tasks-projects/${project_id}/`)
      .then((res) => {
        setTasks(res.data);
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

  const fetchParentTask = async (task_id) => {
    await axios
      .get(`http://localhost:8000/api/tasks/${task_id}/`)
      .then((res) => {
        setParentTask(res.data);
      })
      .catch((err) => console.error(err));
  };

  const fetchComments = async (task_id) =>{
    await axios
      .get(`http://localhost:8000/comments-task/${task_id}/`)
      .then((res) => {
        setComments(res.data);
      })
      .catch((err) => console.error(err));
  };

  const fetchIssues = async (task_id) => {
    await axios
      .get(`http://localhost:8000/issues-task/${task_id}/`)
      .then((res) => {
        setIssues(res.data);
      })
      .catch((err) => console.error(err));
  };

  const onTaskDeveloperChange = (e) => {
    setTaskDeveloper(e.value);
  };
  const selectParentTaskHandler = (e) => {
    setParentTask(e.value);
  };
  const onTaskNameChange = (e) => {
    setTaskName(e.target.value);
  };
  const onTaskDescriptionChange = (e) => {
    setTaskDescription(e.target.value);
  };

  const onChangeComment = (e)=>{
    setNewComment(e.target.value);
  }

  const onChangeIssue = (e)=>{
    setNewIssue(e.target.value);
  }

  const onAddComment = ()=>{
    CSRF = getCookie('csrftoken');
    console.log('task_id: ', task_id);
    console.log('comment_text: ', newComment);

    axios
      .post(`http://localhost:8000/api/notes/`,
        {
          note_task_id: task_id,
          note_desc: newComment,
          note_name: 'Default comment',
          note_client_login: props.username,
          note_date: Date.now(),
        },
        {
          headers: {
            'X-CSRFToken': CSRF,
          },
        }
      ).then((res) => {
        toast('success', 'Comment Successfuly Added!');
        fetchComments(task_id);
      })
      .catch((err) => {
        toast('error', 'Произошла ошибка попробуйте еще раз! ' + err.message);
      });
  };

  const onAddIssue = ()=>{
    CSRF = getCookie('csrftoken');

    axios
      .post(`http://localhost:8000/api/issues/`,
        {
          issue_task: task_id,
          note_description: newIssue,
          issue_name: 'Default comment',
          issue_date: Date.now(),
        },
        {
          headers: {
            'X-CSRFToken': CSRF,
          },
        }
      ).then((res) => {
        toast('success', 'Comment Successfuly Added!');
        fetchIssues(task_id);
      })
      .catch((err) => {
        toast('error', 'Произошла ошибка попробуйте еще раз! ' + err.message);
      });
  };

  useEffect(() => {
    setLoading(true);

    fetchData().then(() => setLoading(false));
    // let realFetchData = setInterval(fetchData, 10000);
    // return () => clearInterval(realFetchData);
  }, []);

  return (
    <>
      <Drawer
        width={840}
        placement="right"
        closable={false}
        onClose={onClose}
        visible={visible}
        // editable = {editable}
      >
        {loading ? (
          <Spin />
        ) : (
          <>
            {editable ? (
              <>
                <Row>
                  <Col span={16}>
                    <Input defaultValue={data && data.task_name} onChange={onTaskNameChange} />
                  </Col>
                  <Col span={8}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{ float: 'right' }}
                      onClick={onEditTask}
                    >
                      Сохранить
                    </Button>
                  </Col>
                </Row>
                <Divider />
                <Row>
                  <p
                    className="site-description-item-profile-p"
                    style={{
                      marginBottom: 12,
                      fontSize: '18px',
                      fontWeight: 'bold',
                    }}
                  >
                    Описание
                  </p>
                  <TextArea rows={6} onChange={onTaskDescriptionChange} />
                </Row>
                <Row>
                  <p>
                    <span>Задача для проекта: </span>
                    <b>{project && project.project_name}</b>
                  </p>
                </Row>
                <Row>
                  <span>Родительская задача: </span>
                  <Select
                    showSearch
                    style={{ marginLeft: 15, width: 200 }}
                    optionFilterProp="children"
                    defaultValue={data && data.parent}
                    onChange={selectParentTaskHandler}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {tasks &&
                      tasks.map((val, idx) => (
                        <Option value={val.pk} key={idx}>
                          {val.fields.task_name}
                        </Option>
                      ))}
                  </Select>
                </Row>
                <Divider />
                <Row>
                  <Col span={6} style={{ textAlign: 'center' }}>
                    <p>
                      Постановщик:<br></br>
                    </p>
                    <Input
                      disabled
                      defaultValue={data && data.task_setter_login}
                      prefix={<UserOutlined />}
                    />
                  </Col>
                  <Col span={6} style={{ textAlign: 'center' }}>
                    <p>Исполнитель: </p>
                    <Select
                      prefix={<UserOutlined />}
                      onChange={onTaskDeveloperChange}
                      defaultValue={data && data.task_developer_login}
                    >
                      {developers &&
                        developers.map((val, idx) => (
                          <Option value={val.developer_login} key={idx}>
                            {val.developer_login}
                          </Option>
                        ))}
                    </Select>
                  </Col>
                  {data && (
                    <>
                      <Col span={6} style={{ textAlign: 'center' }}>
                        <p>Дата начала:</p>
                        <DatePicker
                          allowClear={false}
                          onChange={onChangeStartDate}
                          defaultValue={start_date && moment(data.start_date, 'YYYY-MM-DD')}
                        />
                      </Col>
                      <Col span={6} style={{ textAlign: 'center' }}>
                        <p>Дата окончания: </p>
                        <DatePicker
                          allowClear={false}
                          onChange={onChangeFinishDate}
                          defaultValue={finish_date && moment(data.finish_date, 'YYYY-MM-DD')}
                        />
                      </Col>
                    </>
                  )}
                </Row>
                <Divider />
              </>
            ) : (
              <>
                <Row>
                  <Col span={16}>
                    <p
                      className="site-description-item-profile-p"
                      style={{
                        marginBottom: 24,
                        fontSize: '24px',
                        fontWeight: 'bold',
                      }}
                    >
                      {data && data.task_name}
                    </p>
                  </Col>
                  <Col span={8}>
                    <Button style={{ float: 'right' }} htmlType="button" onClick={onClickEdit}>
                      Редактировать
                    </Button>
                  </Col>
                </Row>
                <Divider />
                <Row>
                  <p
                    className="site-description-item-profile-p"
                    style={{
                      marginBottom: 12,
                      fontSize: '18px',
                      fontWeight: 'bold',
                    }}
                  >
                    Описание
                  </p>
                  <p style={{ marginBottom: 24 }}>{data && data.description}</p>
                </Row>
                <Row>
                  <p>
                    Задача для проекта: <b>{project && project.project_name}</b>
                  </p>
                </Row>
                <Row>
                  <p>
                    Родительская задача: <b>{parent_task && parent_task.task_name}</b>
                  </p>
                </Row>
                <Divider />
                <Row>
                  <Col span={6} style={{ textAlign: 'center' }}>
                    <p>
                      Постановщик: <br></br>
                      <b>{data && data.task_setter_login}</b>
                    </p>
                  </Col>
                  <Col span={6} style={{ textAlign: 'center' }}>
                    <p>
                      Исполнитель: <br></br>
                      <b>{data && data.task_developer_login}</b>
                    </p>
                  </Col>
                  <Col span={6} style={{ textAlign: 'center' }}>
                    <p>
                      Дата начала: <br></br>
                      <b>{data && data.start_date}</b>
                    </p>
                  </Col>
                  <Col span={6} style={{ textAlign: 'center' }}>
                    <p>
                      Дата окончания: <br></br>
                      <b>{data && data.finish_date}</b>
                    </p>
                  </Col>
                </Row>
                <Divider />
                <Row>
                  <Tabs tabPosition="left">
                    <TabPane tab="Comments" key="1">
                      <Row>
                        <p>Comments</p>
                        <TextArea rows={6} placeholder="Leave a Comment" style={{marginBottom: 15}} onChange={onChangeComment}/>
                        <button type="button" onClick={onAddComment} disabled={!newComment}> Add Comment</button>
                        <Divider></Divider>
                        {/* {comments && comments.map((item, idx)=>(
                        <Comment
                          author={<a>{item.fields.note_client_login}</a>}
                          avatar={
                            <Avatar
                              src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                              alt="Han Solo"
                            />
                          }
                          content={
                            <p>
                              {item.fields.note_desc}
                            </p>
                          }
                          datetime={
                              <span>{moment(item.fields.note_date, 'YYYY-MM-DD').fromNow()}</span>
                          }
                        />))} */}
                        {<List
                          className="comment-list"
                          header={`${comments.length} replies`}
                          itemLayout="horizontal"
                          dataSource={comments}
                          renderItem={item => (
                            <li>
                              <Comment
                                author={<a>{item.fields.note_client_login}</a>}
                                avatar={
                                  <Avatar
                                    src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                                    alt="Han Solo"
                                  />
                                }
                                content={
                                  <p>
                                    {item.fields.note_desc}
                                  </p>
                                }
                                datetime={
                                    <span>{moment(item.fields.note_date, 'YYYY-MM-DD').fromNow()}</span>
                                }
                              />
                            </li>
                          )}
                        />}
                      </Row>
                    </TabPane>
                    <TabPane tab="Issues" key="2">
                      <Row>
                        <TextArea rows={6} placeholder="Add an Issue" style={{marginBottom: 15}} onChange={onChangeIssue}/>
                        <button type="button" onClick={onAddIssue} disabled={!newIssue}> Add Issue</button>
                        <Divider></Divider>
                        <p>Issues</p>
                        {/* {issues && issues.map((item, idx)=>(
                        <Comment
                          content={
                            <p>
                              {item.fields.issue_description}
                            </p>
                          }
                          datetime={
                              <span>{moment(item.fields.issue_date, 'YYYY-MM-DD').fromNow()}</span>
                          }
                        />))} */}
                      </Row>
                    </TabPane>
                  </Tabs>
                </Row>
              </>
            )}
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
