import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import {
  Table,
  Tooltip,
  Drawer,
  Form,
  Button,
  Col,
  Row,
  Input,
  Select,
  DatePicker,
  Upload,
  Space,
} from 'antd';
import { LoadingOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { formatForDate } from '../../common/date';
import getCookie from '../../common/parseCookies';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const columns = [
  {
    title: 'Название проекта',
    dataIndex: 'project_name',
    key: 'name',
    align: 'center',
    render: (text, row, index) => {
      return <Link to={`projects/${row.project_id}`}>{text}</Link>;
    },
  },
  {
    title: 'Информация о проекте',
    dataIndex: 'project_info',
    key: 'project_info',
    align: 'center',
    ellipsis: {
      showTitle: false,
    },
    render: (projectInfo) => {
      if (projectInfo.length > 150) projectInfo = projectInfo.substring(0, 150).trim() + '...';
      return (
        <Tooltip placement="topLeft" title={projectInfo}>
          {projectInfo}
        </Tooltip>
      );
    },
  },
  {
    title: 'Статус',
    dataIndex: 'status_name',
    key: 'status',
    align: 'center',
  },
  {
    title: 'Дата начала проекта',
    dataIndex: 'start_date_plan',
    key: 'start_date_plan',
    align: 'center',
  },
  {
    title: 'Дата окончания проекта',
    dataIndex: 'finish_date_plan',
    key: 'finish_date_plan',
    align: 'center',
  },
  {
    title: 'Рабочая группа',
    dataIndex: 'workgroup_name',
    key: 'workgroup_name',
    align: 'center',
  },
];
const { Option } = Select;

const Project = (props) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const [loadingSelect, setLoadingSelect] = useState(false);
  const [visible, setVisible] = useState(false);
  const [statuses, setStatuses] = useState(null);
  const [org, setOrg] = useState(null);
  const [clients, setClients] = useState(null);
  const [statusOrg, setStatusOrg] = useState(true);
  const [error, setError] = useState(null);
  const [idPictures, setIdPictures] = useState([]);
  let errorMessage = [];
  let CSRF;

  const fetchData = async () => {
    setLoading(true);

    await axios
      .get(`http://localhost:8000/project-login/${props.username}/`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.error(err));

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [props.username]);

  const handleAdd = async (e) => {
    await statusesFetch();
    await orgFetch();
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const onAddNewProject = async (formData) => {
    console.log('robit');
    setLoadingForm(true);
    const start_date_plan = formatForDate(formData.dateTime[0]._d.toLocaleString().substr(0, 10));
    const finish_date_plan = formatForDate(formData.dateTime[1]._d.toLocaleString().substr(0, 10));
    let workgId = 0;

    CSRF = getCookie('csrftoken');

    await axios
      .post(
        'http://127.0.0.1:8000/api/workg/',
        {
          workgroup_name: formData.project_workgroup,
        },
        {
          headers: {
            'X-CSRFToken': CSRF,
          },
        },
      )
      .then((res) => {
        workgId = res.data.workgroup_id;
      })
      .catch((err) => {
        setError(err);
      });

    if (workgId !== 0) {
      await axios
        .post(
          'http://127.0.0.1:8000/api/projects/',
          {
            project_name: formData.project_name,
            project_info: formData.project_info,
            finish_date_plan: finish_date_plan,
            start_date_plan: start_date_plan,
            start_date_fact: start_date_plan,
            finish_date_fact: finish_date_plan,
            project_client_login: formData.project_client_login,
            project_manager_login: props.username,
            project_workgroup: workgId,
            project_status: formData.status_name,
          },
          {
            headers: {
              'X-CSRFToken': CSRF,
            },
          },
        )
        .then((res) => {
          fetchData();
        })
        .catch((err) => {
          setError(err);
        });
      if (error !== null) return;
      else onClose();
    }
    setLoadingForm(false);
    fetchData();
  };

  const onOrgChange = async (e) => {
    await axios
      .get(`http://localhost:8000/client-org/${e}/`)
      .then((res) => {
        setClients(res.data);
        if (res.data.length === 0) {
          alert('Извините, но в данной организации нет клиентов, выберите другую!');
          setStatusOrg(true);
        } else setStatusOrg(false);
      })
      .catch((err) => console.error(err));
  };

  const statusesFetch = () => {
    axios
      .get(`http://localhost:8000/api/status/`)
      .then((res) => {
        setStatuses(res.data);
      })
      .catch((err) => console.error(err));
  };

  const orgFetch = async () => {
    await axios
      .get(`http://localhost:8000/api/org/`)
      .then((res) => {
        setOrg(res.data);
      })
      .catch((err) => console.error(err));
  };

  const uploadAction = async (e) => {
    switch (e.method) {
      case 'post': {
        const uploadData = new FormData();

        uploadData.append('login_user', props.username);
        uploadData.append('path_file', e.file, e.file.name);

        await axios
          .post('http://127.0.0.1:8000/api/docs/', uploadData)
          .then((res) => {
            console.log(res.data);
            setIdPictures([
              ...idPictures,
              {
                id: res.data.id,
                fileName: e.file.name,
              },
            ]);
          })
          .catch((err) => console.error(err));
        e.onSuccess();
        return console.log('post');
      }
    }
  };

  const removeUploadAction = async (e) => {
    for (let i = 0; i <= idPictures.length; i++) {
      if (idPictures[i])
        if (idPictures[i].fileName === e.name) {
          axios
            .delete(`http://127.0.0.1:8000/api/docs/${idPictures[i].id}/`)
            .then((res) => {
              setIdPictures(idPictures.slice(i, i));
            })
            .catch();
        } else return;
    }
  };

  if (error || errorMessage.length !== 0) {
    for (let key in error.response.data) {
      errorMessage.push(error.response.data[key]);
    }
  }

  return (
    <div>
      <Button
        onClick={handleAdd}
        type="primary"
        style={{
          marginBottom: 16,
          marginTop: 16,
          marginLeft: 16,
        }}
      >
        <PlusOutlined /> Добавить проект
      </Button>

      <Button
        onClick={fetchData}
        type="primary"
        style={{
          marginBottom: 16,
          marginTop: 16,
          marginLeft: 16,
        }}
      >
        Обновить таблицу
      </Button>
      <Table
        loading={loading}
        bordered={true}
        rowKey={(record) => record.project_id}
        dataSource={data}
        columns={columns}
      />
      <Drawer
        title="Создание нового проекта"
        width={720}
        onClose={onClose}
        visible={visible}
        bodyStyle={{ paddingBottom: 80 }}
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
        {loadingForm ? (
          antIcon
        ) : (
          <>
            {errorMessage.map((e, i) => (
              <p style={{ color: 'red' }} key={i}>
                {e}
              </p>
            ))}
            <Form layout="vertical" hideRequiredMark onFinish={onAddNewProject}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="project_name"
                    label="Название проекта"
                    rules={[
                      {
                        required: true,
                        message: 'Пожалуйста напишите название проекта',
                      },
                    ]}
                  >
                    <Input placeholder="Пожалуйста напишите название проекта" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="status_name" label="Статус проекта">
                    <Select placeholder="Выберите статус">
                      {statuses
                        ? statuses.map((e, index) => (
                            <Option key={index} value={e.status_id}>
                              {e.status_name}
                            </Option>
                          ))
                        : null}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="organization"
                    label="Организации"
                    rules={[
                      {
                        required: true,
                        message: 'Пожалуйста выберите организацию, в которой находится ваш клиент',
                      },
                    ]}
                  >
                    <Select onChange={onOrgChange} placeholder="Пожалуйста выберите организацию">
                      {org
                        ? org.map((e, index) => (
                            <Option key={index} value={e.organisation_id}>
                              {e.full_name}
                            </Option>
                          ))
                        : null}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="project_client_login"
                    label="Логин клиента"
                    rules={[
                      {
                        required: true,
                        message: 'Пожалуйста выберите клиента',
                      },
                    ]}
                  >
                    <Select
                      loading={loadingSelect}
                      disabled={statusOrg}
                      placeholder="Выберите клиента"
                    >
                      {clients
                        ? clients.map((e, index) => (
                            <Option key={index} value={e.pk}>
                              {e.pk}
                            </Option>
                          ))
                        : null}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="project_workgroup"
                    label="Рабочая группа"
                    rules={[
                      {
                        required: true,
                        message: 'Пожалуйста напишите название рабочей группы',
                      },
                    ]}
                  >
                    <Input placeholder="Напишите название рабочей группы" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="dateTime"
                    label="Дата начала и окончания проекта"
                    rules={[
                      {
                        required: true,
                        message: 'Пожалуйста выберите даты начала и окончания проекта',
                      },
                    ]}
                  >
                    <DatePicker.RangePicker format="DD.MM.YYYY" style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    name="project_info"
                    label="Информация о проекте"
                    style={{ marginRight: 26 }}
                    rules={[
                      {
                        required: true,
                        message: 'Пожалуйста введите описание проекта',
                      },
                    ]}
                  >
                    <Input.TextArea
                      style={{ maxHeight: 345 }}
                      rows={4}
                      placeholder="Введите описание проекта"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    name="еее"
                    label="Прикрепленные документы к проекту"
                    style={{ marginRight: 26 }}
                  >
                    <Space
                      style={{ maxHeight: 345 }}
                      direction="vertical"
                      style={{ width: '100%' }}
                      size="large"
                    >
                      <Upload
                        customRequest={uploadAction}
                        onRemove={removeUploadAction}
                        listType="picture"
                        maxCount={5}
                        multiple
                      >
                        <Button icon={<UploadOutlined />}>Upload (Max: 5)</Button>
                      </Upload>
                    </Space>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ width: '100%' }}
                    className="login-form-button"
                    loading={props.loading}
                  >
                    Создать новый проект
                  </Button>
                </Form.Item>
              </Row>
            </Form>
          </>
        )}
      </Drawer>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    username: state.username,
  };
};

export default connect(mapStateToProps)(Project);
