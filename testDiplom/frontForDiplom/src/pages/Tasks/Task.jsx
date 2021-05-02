import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import  { Redirect, useParams } from 'react-router-dom';
import { Drawer, Divider, Col, Row, Button, Spin, Input, DatePicker, Select} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import moment from 'moment';
import getCookie from '../../common/parseCookies';
import { formatForDate } from '../../common/date';

const { Option } = Select;
const { TextArea } = Input;

// const DatePickers = ({data})=>{

//   // const onChangeStartDate = (date) => {
//   //   setStartDate(date.format('YYYY-MM-DD'));
//   //   console.log("Start Date: ", start_date);
//   // }

//   // const onChangeFinishDate = (date) =>{
//   //   setFinishDate(date.format('YYYY-MM-DD'));
//   //   console.log("Finish Date: ", finish_date);
//   // }

//   return( 
//     <>
//             <Col span={6} style={{textAlign: 'center'}}>
//                 <p>Дата начала:</p>
//                 <DatePicker 
//                     allowClear={false}
//                     // onChange={onChangeStartDate} 
//                     defaultValue={moment(data.start_date, "YYYY-MM-dd")}
//                     // defaultPickerValue = {moment(data.start_date, "YYYY-MM-dd")} 
//                   />
//               </Col>
//               <Col span={6} style={{textAlign: 'center'}}>
//                 <p>Дата окончания: </p>
//                 <DatePicker
//                   allowClear={false}  
//                   // onChange={onChangeFinishDate} 
//                   defaultValue={moment(data.finish_date, "YYYY-MM-dd")} 
//                   // defaultPickerValue = {moment(data.finish_date, "YYYY-MM-dd")} 
//                 />
//               </Col>
//       </>
//   )
// }

const Task = (props) => {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(true);
  const [data, setData] = useState(null);
  const { task_id }= useParams();
  const [editable, setEditable] = useState(false);
  const [finish_date, setFinishDate] = useState('');
  const [start_date, setStartDate] = useState('');
  const [task_name, setTaskName] = useState('');
  const [task_descriptioin, setTaskDescription] = useState();
  const [task_developer_login, setTaskDeveloper] = useState();
  const [parent_task, setParentTask] = useState();
  const [tasks, setTasks] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [project_id, setProjectId] = useState();
  let realFetchData;
  let CSRF;


  realFetchData =useRef(null);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
    window.location.assign('/tasks');
  };

  const onClickEdit = async() => {

    await fetchTasks(project_id);
    await fetchDevelopers(project_id);

    setEditable(true);
  }

  const onEditTask = () => {
    console.log("Update data: ");
    CSRF = getCookie('csrftoken');
    
    // console.log(values);
    
    axios
      .patch(`http://localhost:8000/api/tasks/${task_id}/`,
        {
          task_name: data.task_name | task_name,
          task_developer_login: data.task_developer_login |task_developer_login,
          start_date: data.start_date | start_date,
          finish_date: data.finish_date | finish_date,
          parent: data.parent | parent_task,
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
        // console.log(res.data);
        setData(res.data);
        setProjectId(res.data.project_task);
        setStartDate(res.dara.start_date);
        setFinishDate(res.data.finish_date);
        // console.log("local value: ", data.project_task);
      })
      .catch((err) => console.error(err));
      
  }

  const fetchTasks = async(project_id)=>{
    await axios
      .get(`http://localhost:8000/tasks-projects/${project_id}/`)
      .then((res) => {
        console.log(res.data);
        setTasks(res.data);
      })
      .catch((err) => console.error(err));
  }

  const fetchDevelopers = async(project_id)=>{
    await axios
          .get(`http://localhost:8000/workgroup-developers/${project_id}/`)
          .then(async (res) => {
            console.log(res.data);
            setDevelopers(res.data);
          })
          .catch((err) => console.error(err));
  }

  const onTaskDeveloperChange = (e) =>{
    setTaskDeveloper(e.value);
  }
  const selectParentTaskHandler = (e) =>{
    setParentTask(e.value);
  }

  const renderTasksList= ()=>{
    return (
      <> 
         {!tasks ? 
            (<Option><Spin /></Option>) :  
            (tasks.map((val)=> {return
              <Option value={val.developer_login}>{val.developer_login}</Option>
            }
            ))
          }
      </>
    );
  };

  const renderDevelopersList= ()=>{
    return (
      <> 
         {!developers ? 
            (<Option><Spin /></Option>) :  
            (developers.map((val)=>{
               <Option value={val.developer_login}>{val.developer_login}</Option>
              }
            ))
          }
      </>
    );
  };

  useEffect(() => {
    setLoading(true);
    
    fetchData().then(()=>setLoading(false));
    
    realFetchData = setInterval(fetchData, 10000);

    return () => clearInterval(realFetchData);
  },[]);

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
          {!loading ? (<Spin />) : (
          <>
            {editable ? (
              <>
              <Row>
                <Col span={16}>
                  <Input 
                      defaultValue={data.task_name}
                  />
                </Col>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
                <Col span={8}>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    style={{float: 'right'}}
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
                    fontWeight: 'bold'
                  }}>
                  Описание
                </p>
                <TextArea 
                    rows={6}
                />
              </Row>
              <Row>
                <p>
                  <span>Задача для проекта:  </span>
                  <b>
                    {data.project_task}
                  </b>
                </p>
              </Row>
              <Row>
                <span>Родительская задача:  </span>
                {/* <Select
                showSearch
                style={{ width: 200 }}
                // optionFilterProp="children"
                defaultValue={{value: data.parent}} 
                onChange={selectParentTaskHandler}
                prefix={<UserOutlined/>} 
                // filterOption={(input, option) =>
                // option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            >
               { {renderTasksList} }
            </Select> */}
              </Row>
              <Divider />
              <Row>
                <Col 
                  span={6} 
                  style={{textAlign: 'center'}}>
                  <p>Постановщик:<br></br>
                  </p>
                    <Input 
                      disabled
                      // defaultValue={data.task_setter_login} 
                      prefix={<UserOutlined/>} 
                    />
                </Col>
                <Col span={6} style={{textAlign: 'center'}}>
                  <p>Исполнитель: <br></br>
                  </p>
                    {/* <Select 
                      onChange = {onTaskDeveloperChange}
                      // defaultValue={{ value: data.task_developer_login }}
                    >
                    {{renderDevelopersList} 
                    </Select> */}
                </Col>
                {/* <DatePickers data={data} /> */}
                  <Col span={6} style={{textAlign: 'center'}}>
                  <p>Дата начала:</p>
                  <DatePicker 
                      allowClear={false}
                      // onChange={onChangeStartDate} 
                      defaultValue={moment(data.start_date, "YYYY-MM-dd")}
                      // defaultPickerValue = {moment(data.start_date, "YYYY-MM-dd")} 
                    />
                </Col>
                <Col span={6} style={{textAlign: 'center'}}>
                  <p>Дата окончания: </p>
                  <DatePicker
                    allowClear={false}  
                    // onChange={onChangeFinishDate} 
                    defaultValue={moment(data.finish_date, "YYYY-MM-dd")} 
                    // defaultPickerValue = {moment(data.finish_date, "YYYY-MM-dd")} 
                  />
                </Col>
              </Row>
              <Divider />
              <Row>
                <p>Comments</p>
              </Row>
              </>)
            :(
            <>
              <Row>
                <Col span={16}>
                  <p 
                    className="site-description-item-profile-p" 
                    style={{ 
                      marginBottom: 24,
                      fontSize: '24px',
                      fontWeight: 'bold'}}
                    >
                      {data.task_name}
                  </p>
                </Col>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
                <Col span={8}>
                 <Button 
                    style={{float: 'right'}}
                    htmlType="button" 
                    onClick={onClickEdit}
                    >
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
                    fontWeight: 'bold'
                  }}>
                  Описание
                </p>
                <p style={{ marginBottom: 24}}>
                {data.description}
                </p>
              </Row>
              <Row>
                <span>Задача для проекта:</span>
                <b>{data.project_task}</b>
              </Row>
              <Row>
                <span>Родительская задача:</span>
                <b>{data.parent}</b>
              </Row>
              <Divider />
              <Row>
                <Col 
                  span={6} 
                  style={{textAlign: 'center'}}>
                  <p>Постановщик:<br></br> 
                   <b>
                      {data.task_setter_login}
                    </b>
                  </p>
                </Col>
                <Col span={6} style={{textAlign: 'center'}}>
                  <p>Исполнитель: <br></br> 
                    <b>
                      {data.task_developer_login}
                    </b>
                  </p>
                </Col>
                <Col span={6} style={{textAlign: 'center'}}>
                  <p>Дата начала: <br></br>
                    <b>{data.start_date}</b>
                  </p>
                </Col>
                <Col span={6} style={{textAlign: 'center'}}>
                  <p>Дата окончания: <br></br>
                    <b>{data.finish_date}</b>
                  </p>
                </Col>
              </Row>
              <Divider />
              <Row>
                <p>Comments</p>
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