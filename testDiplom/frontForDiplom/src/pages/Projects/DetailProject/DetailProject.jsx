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
  Tooltip,
  Drawer,
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
import { Link } from 'react-router-dom';
import { formatForDate } from '../../../common/date';
import StatisticProject from './StatisticProject/StatisticProject';

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
const columnsForTask = [
  {
    title: 'Название задачи',
    dataIndex: 'task_name',
    key: 'name',
    align: 'center',
    sorter: (a, b) => a.task_name.length - b.task_name.length,
    sortDirections: ['descend', 'ascend'],
    render: (text, row, index) => {
      return <Link to={`/tasks/${row.key}`}>{text}</Link>;
    },
  },
  {
    title: 'Исполнитель',
    dataIndex: 'task_developer',
    key: 'task_developer',
    align: 'center',
    sorter: (a, b) => a.task_developer.length - b.task_developer.length,
    sortDirections: ['descend', 'ascend'],
    ellipsis: {
      showTitle: false,
    },
    render: (task_developer) => (
      <Tooltip placement="topLeft" title={task_developer}>
        {task_developer}
      </Tooltip>
    ),
  },
  {
    title: 'Постановщик',
    dataIndex: 'task_setter',
    key: 'task_setter',
    align: 'center',
    sorter: (a, b) => a.task_setter.length - b.task_setter.length,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: 'Дата начала проекта',
    dataIndex: 'start_date_plan',
    key: 'start_date_plan',
    align: 'center',
    sorter: (a, b) => a.start_date_plan.length - b.start_date_plan.length,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: 'Дата окончания проекта',
    dataIndex: 'finish_date_plan',
    key: 'finish_date_plan',
    align: 'center',
    sorter: (a, b) => a.finish_date_plan.length - b.finish_date_plan.length,
    sortDirections: ['descend', 'ascend'],
  },
];

// transform data to treeObject
function transformDataToTree(data) {
  let treeData = [];
  let cur_lvls = [];

  data.map(function (item, i, arr) {
    let treeItem = {
      key: item.pk,
      task_name: item.fields.task_name,
      task_developer: item.fields.task_developer_login,
      task_setter: item.fields.task_setter_login,
      start_date_plan: item.fields.start_date,
      finish_date_plan: item.fields.finish_date,
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

      if (typeof copy.children === 'undefined') copy.children = [];
      copy.children.push(treeItem);
    }
  });

  return treeData;
}

function TreeDataUi(data) {
  let newData = transformDataToTree(data);
  return (
    <>
      <Table columns={columnsForTask} dataSource={newData} />
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
  const [newStatus, setNewStatus] = useState(null);
  const [newFinishDate, setNewFinishDate] = useState(null);
  const [newManager, setNewManager] = useState(null);
  const [newClient, setNewClient] = useState(null);
  const [newInfoProject, setNewInfoProject] = useState(null);
  const [openStatisticDrawer, setOpenStatisticDrawer] = useState(false);

  const selectNewDeveloperRef = useRef(null);

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
  ];

  const columnsEdit = [
    ...columns,
    {
      title: 'Операции',
      dataIndex: 'operation',
      render: (_, record) => (
        <Popconfirm
          title="Уверены, что хотите удалить данного разработчика?"
          onConfirm={() => deleteDeveloperFromProject(record)}
        >
          <a>Удалить</a>
        </Popconfirm>
      ),
    },
  ];

  const deleteDeveloperFromProject = async (rec) => {
    await axios
      .delete(`http://localhost:8000/api/workdl/${rec.list_id}/`)
      .then(async (res) => {
        await fetchDevelopers();
        toast('success', 'Успешное удаление разработчика!');
      })
      .catch((err) => {
        toast('error', 'Что-то пошло не так! ' + err.message);
      });
  };

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
      console.log(dataProject);

      setEditable(true);
      setLoadingEdit(false);
    } else {
      setLoadingEdit(true);

      let finishDate;
      if (newFinishDate)
        finishDate = formatForDate(newFinishDate._d.toLocaleString().substr(0, 10));

      await axios
        .patch(`http://localhost:8000/api/projects/${ID}/`, {
          finish_date_plan: finishDate || dataProject.finish_date_plan,
          finish_date_fact: finishDate || dataProject.finish_date_fact,
          project_status: newStatus || dataProject.status_id,
          project_info: newInfoProject || dataProject.project_info,
          project_client_login: newClient || dataProject.project_client_login,
          project_manager_login: newManager || dataProject.project_manager_login,
        })
        .then(async (res) => {
          await fetchData();
          toast('success', 'Данные успешно изменены!');
        })
        .catch((err) => {
          toast('error', 'Произошла ошибка попробуйте еще раз! ' + err.message);
        });

      setEditable(false);
      setLoadingEdit(false);
    }
  };

  const changeDateHandler = (e) => {
    setNewFinishDate(e);
  };

  const changeInfoHandler = (e) => {
    setNewInfoProject(e.target.value);
  };

  const handleChangeClient = (e) => {
    setNewClient(e.value);
  };

  const handleChangeManager = (e) => {
    setNewManager(e.value);
  };

  const handleChangeStatus = (e) => {
    setNewStatus(e.value);
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
          await addNewDevToWorkGroup();
        })
        .catch((err) => console.error(err));
    } else {
      await addNewDevToWorkGroup();
    }

    setNewDeveloper('');
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
        dataForTree = res.data;
      })
      .catch((err) => console.error(err));
  };

  const handleOpenStatistic = () => {
    setOpenStatisticDrawer(true);
  };

  const closeStatisticDrawer = () => setOpenStatisticDrawer(false);

  return (
    <div>
      {loading ? (
        <Spin size="large" />
      ) : (
        <div style={{ margin: '15px', paddingTop: '15px' }}>
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

            <Button
              onClick={handleOpenStatistic}
              style={{ float: 'right', marginTop: '7px', marginRight: '10px' }}
              type="primary"
            >
              Статистика
            </Button>

            <Drawer width={700} visible={openStatisticDrawer} onClose={closeStatisticDrawer}>
              <StatisticProject projectId={ID} work_Id={dataProject.project_workgroup_id} />
            </Drawer>
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
                      <Option key={idx} value={value.status_id}>
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
              onChange={changeDateHandler}
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

            {!editable ? (
              <Table
                dataSource={developers}
                rowKey={(record) => record.id}
                bordered
                pagination={false}
                columns={columns}
              />
            ) : (
              <>
                <Space direction={'horizontal'} size={'small'}>
                  <Title level={4}>Это все пользователи:</Title>
                  <Select
                    labelInValue
                    style={{ width: 220 }}
                    ref={selectNewDeveloperRef}
                    onChange={changeNewDevHandler}
                  >
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
                  columns={columnsEdit}
                />
              </>
            )}
          </Space>

          <hr />
          <Title level={3}>Описание проекта:</Title>
          {!editable ? (
            <Paragraph ellipsis={{ rows: 2, expandable: true, symbol: '...' }}>
              {dataProject.project_info}
            </Paragraph>
          ) : (
            <TextArea
              showCount
              maxLength={500}
              onChange={changeInfoHandler}
              defaultValue={dataProject.project_info}
            />
          )}

          {editable && <br />}
          <hr />

          <Title level={3}>Задачи (только просмотр):</Title>
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
