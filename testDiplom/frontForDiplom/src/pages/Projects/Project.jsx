import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Table, Tooltip, Drawer, Form, Button, Col, Row, Input, Select, DatePicker } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Link, NavLink } from 'react-router-dom';
import moment from 'moment';
import { formatForDate } from '../../common/date';

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
  const [loadingSelect, setLoadingSelect] = useState(false);
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState(false);
  const [statusOrg, setStatusOrg] = useState(true);
  let getFetchData;

  const fetchData = async () => {
    if (!status) setLoading(true);
    setStatus(true);

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
    getFetchData = setInterval(fetchData, 10000);

    return function cleanup() {
      clearInterval(getFetchData);
    };
  }, [props.username]);

  const handleAdd = (e) => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const onAddNewProject = (formData) => {
    const start_date_plan = formatForDate(formData.dateTime[0]._d.toLocaleString().substr(0, 10));
    const finish_date_plan = formatForDate(formData.dateTime[1]._d.toLocaleString().substr(0, 10));
  };

  const onOrgChange = (e) => {
    console.log(e);
    setStatusOrg(false);
  };

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
                  <Option value="xiao">Xiaoxiao Fu</Option>
                  <Option value="mao">Maomao Zhou</Option>
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
                  <Option value="xiao">Xiaoxiao Fu</Option>
                  <Option value="mao">Maomao Zhou</Option>
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
                <Select loading={loadingSelect} disabled={statusOrg} placeholder="Выберите клиента">
                  <Option value="xiao">Xiaoxiao Fu</Option>
                  <Option value="mao">Maomao Zhou</Option>
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
                rules={[
                  {
                    required: true,
                    message: 'Пожалуйста введите описание проекта',
                  },
                ]}
              >
                <Input.TextArea rows={4} placeholder="Введите описание проекта" />
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
