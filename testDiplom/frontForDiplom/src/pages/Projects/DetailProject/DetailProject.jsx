import React, { useState, useEffect } from 'react';
import { Spin, Typography, DatePicker, Space, Button, notification, Select, Image } from 'antd';
import axios from 'axios';
import { connect } from 'react-redux';
import moment from 'moment';
import { EditOutlined, SaveOutlined } from '@ant-design/icons';
import classes from './DetailProject.module.css';

const { Title } = Typography;
const { Option } = Select;
let realTimeFetch;
const dateFormat = 'YYYY-MM-DD';
const toast = (type) =>
  notification[type]({
    message:
      type === 'success' ? 'Данные успешно изменены!' : 'Произошла ошибка попробуйте еще раз!',
    placement: 'bottomLeft',
    duration: 2,
  });

const DetailProject = ({ match, username }) => {
  const ID = match.params.id;
  const [loading, setLoading] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [rights, setRights] = useState(false);
  const [editable, setEditable] = useState(false);
  const [dataProject, setDataProject] = useState({});
  const [clients, setClients] = useState([]);
  const [managers, setManagers] = useState([]);

  const fetchData = async () => {
    await axios.get(`http://127.0.0.1:8000/project-orgs/${ID}/`).then((res) => {
      setDataProject(res.data[0]);
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
    console.log(dataProject);
    await axios
      .get(`http://127.0.0.1:8000/client-org/${dataProject.organisation_id}/`)
      .then((res) => {
        console.log(res.data);
        setClients(res.data);
      })
      .catch((err) => console.error(err));
  };

  const fetchManagers = async () => {
    await axios
      .get(`http://127.0.0.1:8000/api/man/`)
      .then((res) => {
        console.log(res.data);
        setManagers(res.data);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    setLoading(true);

    checkRights().then(() => console.log(rights));
    fetchData().then(() => setLoading(false));

    realTimeFetch = setInterval(fetchData, 10000);

    return () => clearInterval(realTimeFetch);
  }, []);

  const editableHandle = async (e) => {
    if (e.target.innerText === 'Изменить проект') {
      setLoadingEdit(true);
      await fetchClients();
      await fetchManagers();
      setEditable(true);
      setLoadingEdit(false);
    } else {
      setLoadingEdit(true);
      toast('success');
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

  return (
    <div>
      {loading ? (
        <Spin size="large" />
      ) : (
        <div style={{ margin: '15px', paddingTop: '15px' }}>
          {/*<h1>{'Rights: ' + rights}</h1>*/}

          <div style={{ display: 'inline-block', width: '-webkit-fill-available' }}>
            <Image
              className={classes.round}
              style={{ display: 'inline-block', marginBottom: '20px' }}
              src={`http://localhost:8000/media/${dataProject.organisation_image_src}`}
            />
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

          <br />

          <Space direction="horizontal" size={12}>
            <DatePicker defaultValue={moment(dataProject.start_date_plan, dateFormat)} disabled />
            <DatePicker
              defaultValue={moment(dataProject.finish_date_plan, dateFormat)}
              disabled={!editable}
            />
          </Space>

          <br />

          <Space direction="horizontal" size={'large'} style={{ marginTop: '15px' }}>
            {!editable ? (
              <>
                <Title level={3}>{dataProject.project_client_login}</Title>
                <Title level={3}>{dataProject.project_manager_login}</Title>
              </>
            ) : (
              <>
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
