import React, { useState, useEffect, useRef } from 'react';
import {
  Spin,
  Typography,
  DatePicker,
  Space,
  Button,
  notification,
  Select,
  Image,
  Input,
  Table,
  Popconfirm,
  Checkbox,
  Switch,
} from 'antd';
import axios from 'axios';
import { connect } from 'react-redux';
import moment from 'moment';
import {
  CheckCircleTwoTone,
  CloseSquareTwoTone,
  EditOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import classes from './DetailProject.module.css';
import { logout } from '../../../store/actions/auth';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;
let realTimeFetch;
const dateFormat = 'YYYY-MM-DD';
let dataForTree = [];
const toast = (type, message) =>
  notification[type]({
    message: message,
    placement: 'bottomLeft',
    duration: 2,
  });
const columnsForTasks = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
    width: '12%',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    width: '30%',
    key: 'address',
  },
];

// transform data to treeObject
function transformDataToTree(data) {
  dataForTree = [];
  let treeData = [];
  let cur_lvls = [];
  data.map(function (item, i, arr) {
    let treeItem = {
      key: item.pk,
      task_name: item.fields.task_name,
      task_developer: item.fields.task_developer_login,
      task_setter: item.fields.task_developer_login,
      start_date_plan: item.fields.start_date,
      finish_date_plan: item.fields.finish_date,
      children: [],
    };

    let parent_key = item.fields.parent;
    if (parent_key == null) {
      treeData.push(treeItem);
      if (cur_lvls.length === 0) cur_lvls[0] = 0;
      else {
        cur_lvls[0] += 1;
      }
    } else {
      let lvl_down = 0;
      let copy = treeData[cur_lvls[0]];
      console.log(copy);
      while (parent_key !== copy.key) {
        copy = copy.children[cur_lvls[lvl_down]];
        lvl_down += 1;
      }
      lvl_down += 1;
      if (cur_lvls[lvl_down] === undefined) {
        cur_lvls[lvl_down] = 0;
      } else {
        cur_lvls[lvl_down] += 1;
      }
      copy.children.push(treeItem);
    }
  });

  return treeData;
}

function TreeDataUi(data) {
  dataForTree = transformDataToTree(data);
  return (
    <>
      <Table columns={columnsForTasks} dataSource={dataForTree} />
    </>
  );
}

const DetailProject = ({ match, username }) => {
  const ID = match.params.id;
  const [loading, setLoading] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [rights, setRights] = useState(false);
  const [editable, setEditable] = useState(false);
  const [dataProject, setDataProject] = useState({});
  const [clients, setClients] = useState([]);
  const [managers, setManagers] = useState([]);
  const [imgVisible, setImgVisible] = useState(false);
  const [statuses, setStatuses] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [allDevelopers, setAllDevelopers] = useState([]);
  const [newDeveloper, setNewDeveloper] = useState(null);
  const [loadingAddDev, setLoadingAddDev] = useState(false);
  const [teamLeadCheck, setTeamLeadCheck] = useState(false);
  const [outCheck, setOutCheck] = useState(false);

  const columns = [
    {
      title: 'Логин разработчика',
      dataIndex: 'developer_login',
      key: 'developer_login',
    },
    {
      title: 'Тимлид',
      dataIndex: 'head_status',
      key: 'head_status',
      render: (text) => (
        <>
          {text ? (
            <CheckCircleTwoTone twoToneColor="#52c41a" />
          ) : (
            <CloseSquareTwoTone twoToneColor="#fc0505" />
          )}
        </>
      ),
    },
    {
      title: 'Операции',
      dataIndex: 'operation',
      render: (_, record) => (
        <Popconfirm
          title="Уверены, что хотите удалить данного разработчика?"
          onConfirm={() => console.log(record.key)}
        >
          <a>Удалить</a>
        </Popconfirm>
      ),
    },
  ];

  const fetchData = async () => {
    await axios.get(`http://127.0.0.1:8000/project-orgs/${ID}/`).then(async (res) => {
      setDataProject(res.data[0]);

      await axios
        .get(`http://localhost:8000/media/${res.data[0].organisation_image_src}`)
        .then(() => setImgVisible(true))
        .catch(() => setImgVisible(false));

      await axios
        .get(`http://localhost:8000/developers-in/${res.data[0].project_workgroup_id}/`)
        .then((res) => {
          setDevelopers(res.data);
        })
        .catch((err) => console.error(err));
    });
  };

  const checkRights = async () => {
    await axios
      .get(`http://127.0.0.1:8000/project-check-rights/${username}/${ID}/`)
      .then((res) => {
        setRights(!!res.data);
      })
      .catch((err) => console.error(err));
  };

  const fetchClients = async () => {
    await axios
      .get(`http://127.0.0.1:8000/client-org/${dataProject.organisation_id}/`)
      .then((res) => {
        setClients(res.data);
      })
      .catch((err) => console.error(err));
  };

  const fetchManagers = async () => {
    await axios
      .get(`http://127.0.0.1:8000/api/man/`)
      .then((res) => {
        setManagers(res.data);
      })
      .catch((err) => console.error(err));
  };

  const fetchAllDevelopers = async () => {
    await axios
      .get(`http://localhost:8000/api/users/`)
      .then((res) => {
        setAllDevelopers(res.data);
      })
      .catch((err) => console.error(err));
  };

  const fetchStatuses = async () => {
    await axios
      .get(`http://localhost:8000/api/status/`)
      .then((res) => {
        setStatuses(res.data);
      })
      .catch((err) => console.error(err));
  };

  const fetchDevelopers = async () => {
    await axios
      .get(`http://localhost:8000/developers-in/${dataProject.project_workgroup_id}/`)
      .then((res) => {
        setDevelopers(res.data);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    setLoading(true);

    checkRights().then(() => console.log('права', rights));
    getTasks().then(() => console.log());
    fetchAllDevelopers().then(() => console.log('все пользователи', allDevelopers));
    fetchData().then(() => setLoading(false));

    realTimeFetch = setInterval(fetchData, 10000);

    return () => clearInterval(realTimeFetch);
  }, []);

  const editableHandle = async (e) => {
    if (e.target.innerText === 'Изменить проект') {
      setLoadingEdit(true);

      await fetchClients();
      await fetchManagers();
      await fetchStatuses();
      await fetchDevelopers();

      setEditable(true);
      setLoadingEdit(false);
    } else {
      setLoadingEdit(true);
      toast('success', 'Данные успешно изменены!'); //'Произошла ошибка попробуйте еще раз!'
      setEditable(false);
      setLoadingEdit(false);
    }
  };

  const handleChangeClient = (value) => {
    console.log(value);
  };

  const handleChangeManager = (value) => {
    console.log(value);
  };

  const handleChangeStatus = (value) => {
    console.log(value);
  };

  const changeNewDevHandler = (e) => {
    setNewDeveloper(e.value);
  };

  const imagePreview = () => {
    window.open(`http://localhost:8000/media/${dataProject.organisation_image_src}`);
  };

  const handleAddDeveloper = async () => {
    setLoadingAddDev(true);

    for (let val in developers) {
      if (newDeveloper === developers[val].developer_login) {
        setLoadingAddDev(false);
        return toast('error', 'Такой разработчик уже участвует в проекте!');
      }
    }

    let newDev = false;

    await axios
      .get(`http://localhost:8000/api/dev/${newDeveloper}/`)
      .then((res) => (newDev = false))
      .catch((err) => (newDev = true));

    if (newDev) {
      await axios
        .post(`http://localhost:8000/api/dev/`, {
          developer_login: newDeveloper,
          outsource_spec: outCheck,
        })
        .then(async (res) => {
          console.log(res.data);
          await addNewDevToWorkGroup();
        })
        .catch((err) => console.error(err));
    } else {
      await addNewDevToWorkGroup();
    }

    setLoadingAddDev(false);
  };

  const addNewDevToWorkGroup = async () => {
    await axios
      .post(`http://localhost:8000/api/workdl/`, {
        workgroup: dataProject.project_workgroup_id,
        head_status: teamLeadCheck,
        developer_login: newDeveloper,
      })
      .then(async (res) => {
        console.log(res.data);
        await fetchDevelopers();
      })
      .catch((err) => {
        toast('error', err.message);
        console.error(err.message);
      });

    setOutCheck(false);
    setTeamLeadCheck(false);
  };

  const changeTeamHandler = (e) => {
    setTeamLeadCheck(e.target.checked);
  };

  const changeOutHandler = (e) => {
    setOutCheck(e.target.checked);
  };

  const getTasks = async () => {
    await axios
      .get(`http://localhost:8000/tasks-projects/${ID}/`)
      .then((res) => {
        console.log(res.data);
        dataForTree = res.data;
      })
      .catch((err) => console.error(err));
  };

  return (
    <div>
      {loading ? (
        <Spin size="large" />
      ) : (
        <div style={{ margin: '15px', paddingTop: '15px' }}>
          {/*<h1>{'Rights: ' + rights}</h1>*/}

          <div style={{ display: 'inline-block', width: '-webkit-fill-available' }}>
            {imgVisible && (
              <Image
                className={classes.round}
                style={{ display: 'inline-block', marginBottom: '20px', cursor: 'pointer' }}
                src={`http://localhost:8000/media/${dataProject.organisation_image_src}`}
                alt={'Попросите организацию вставить свое лого'}
                preview={false}
                onClick={imagePreview}
              />
            )}
            <Title style={{ display: 'inline-block' }}>&nbsp;{dataProject.project_name}</Title>
            {rights && (
              <Button
                onClick={editableHandle}
                style={{ float: 'right', marginTop: '7px' }}
                type="primary"
                loading={loadingEdit}
              >
                {!editable ? <EditOutlined /> : <SaveOutlined />}{' '}
                {!editable ? 'Изменить проект' : 'Сохранить изменения'}
              </Button>
            )}
          </div>

          <hr />

          <Space direction="horizontal" size={'large'} style={{ marginTop: '15px' }}>
            {!editable ? (
              <Title level={4}>Статус проекта: {dataProject.status_name}</Title>
            ) : (
              <>
                <Title level={4}>Статус проекта:&nbsp;</Title>
                <Select
                  labelInValue
                  defaultValue={{ value: dataProject.status_name }}
                  style={{ width: 120 }}
                  onChange={handleChangeStatus}
                >
                  {statuses &&
                    statuses.map((value, idx) => (
                      <Option key={idx} value={value.status_name}>
                        {value.status_name}
                      </Option>
                    ))}
                </Select>
              </>
            )}
          </Space>

          <hr />

          <div>
            <Title level={2}>Информация про организацю заказчика:</Title>
            <Title level={4}>
              Полное наименование компании: {dataProject.full_name}.&nbsp;Короткое наименование:{' '}
              {dataProject.short_name}
            </Title>
          </div>

          <hr />

          <Space direction="horizontal" size={12}>
            <Title level={4}>Дата начала:</Title>
            <DatePicker defaultValue={moment(dataProject.start_date_plan, dateFormat)} disabled />
            <Title level={4}>Дата окончания проекта:</Title>
            <DatePicker
              defaultValue={moment(dataProject.finish_date_plan, dateFormat)}
              disabled={!editable}
            />
          </Space>

          <hr />

          <Space direction="horizontal" size={'large'} style={{ marginTop: '15px' }}>
            {!editable ? (
              <>
                <Title level={3}>Клиент (логин): {dataProject.project_client_login}</Title>
                <Title level={3}>
                  Менеджер проекта (логин): {dataProject.project_manager_login}
                </Title>
              </>
            ) : (
              <>
                <Title level={4}>Клиент (логин): </Title>
                <Select
                  labelInValue
                  defaultValue={{ value: dataProject.project_client_login }}
                  style={{ width: 120 }}
                  onChange={handleChangeClient}
                >
                  {clients &&
                    clients.map((value, idx) => (
                      <Option key={idx} value={value.pk}>
                        {value.pk}
                      </Option>
                    ))}
                </Select>

                <Title level={4}>Менеджер проекта (логин): </Title>
                <Select
                  labelInValue
                  defaultValue={{ value: dataProject.project_manager_login }}
                  style={{ width: 120 }}
                  onChange={handleChangeManager}
                >
                  {managers &&
                    managers.map((value, idx) => (
                      <Option key={idx} value={value.manager_login}>
                        {value.manager_login}
                      </Option>
                    ))}
                </Select>
              </>
            )}
          </Space>

          <hr />

          <Space direction="vertical" size={'small'} style={{ marginBottom: '15px' }}>
            <Title level={3}>Разработчики:</Title>

            <Space direction={'horizontal'} size={'small'}>
              <Title level={4}>Это все пользователи:</Title>
              <Select labelInValue style={{ width: 220 }} onChange={changeNewDevHandler}>
                {allDevelopers &&
                  allDevelopers.map((value, idx) => (
                    <Option key={idx} value={value.username}>
                      {value.username}
                    </Option>
                  ))}
              </Select>

              <Checkbox onChange={changeOutHandler} checked={outCheck}>
                Удаленно
              </Checkbox>
              <Checkbox onChange={changeTeamHandler} checked={teamLeadCheck}>
                Тимлидер
              </Checkbox>

              <Button onClick={handleAddDeveloper} loading={loadingAddDev} type="primary">
                Добавить разработчика
              </Button>
            </Space>

            <Table
              dataSource={developers}
              rowKey={(record) => record.id}
              bordered
              pagination={false}
              columns={columns}
            />
          </Space>

          <hr />
          <Title level={3}>Описание проекта:</Title>
          {!editable ? (
            <Paragraph ellipsis={{ rows: 2, expandable: true, symbol: '...' }}>
              {dataProject.project_info}
            </Paragraph>
          ) : (
            <TextArea showCount maxLength={500} defaultValue={dataProject.project_info} />
          )}

          {editable && <br />}
          <hr />

          <Title level={3}>Задачи:</Title>
          {dataForTree.length > 0 ? TreeDataUi(dataForTree) : 'Задач еще нет'}
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    username: state.username,
  };
};

export default connect(mapStateToProps)(DetailProject);
