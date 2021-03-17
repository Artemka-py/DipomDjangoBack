import React, { useEffect, useState } from "react";
import axios from "axios";
import { connect } from "react-redux";
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
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const columns = [
  {
    title: "Название проекта",
    dataIndex: "project_name",
    key: "name",
    align: "center",
    render: (text, row, index) => {
      return <Link to={`projects/${row.project_id}`}>{text}</Link>;
    },
  },
  {
    title: "Информация о проекте",
    dataIndex: "project_info",
    key: "project_info",
    align: "center",
    ellipsis: {
      showTitle: false,
    },
    render: (projectInfo) => {
      if (projectInfo.length > 150)
        projectInfo = projectInfo.substring(0, 150).trim() + "...";
      return (
        <Tooltip placement="topLeft" title={projectInfo}>
          {projectInfo}
        </Tooltip>
      );
    },
  },
  {
    title: "Статус",
    dataIndex: "status_name",
    key: "status",
    align: "center",
  },
  {
    title: "Дата начала проекта",
    dataIndex: "start_date_plan",
    key: "start_date_plan",
    align: "center",
  },
  {
    title: "Дата окончания проекта",
    dataIndex: "finish_date_plan",
    key: "finish_date_plan",
    align: "center",
  },
  {
    title: "Рабочая группа",
    dataIndex: "workgroup_name",
    key: "workgroup_name",
    align: "center",
  },
];
const { Option } = Select;

const Project = (props) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
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
    fetchData();
  }, [props.username]);

  const handleAdd = (e) => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
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
              textAlign: "right",
            }}
          >
            <Button onClick={onClose} style={{ marginRight: 8 }}>
              Отмена
            </Button>
            <Button onClick={onClose} type="primary">
              Создать новый проект
            </Button>
          </div>
        }
      >
        <Form layout="vertical" hideRequiredMark>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="project_name"
                label="Название проекта"
                rules={[
                  {
                    required: true,
                    message: "Пожалуйста напишите название проекта",
                  },
                ]}
              >
                <Input placeholder="Пожалуйста напишите название проекта" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="project_client_login" label="Логин клиента">
                <Select placeholder="Please select an owner">
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
                rules={[{ required: true, message: "Please select an owner" }]}
              >
                <Select placeholder="Please select an owner">
                  <Option value="xiao">Xiaoxiao Fu</Option>
                  <Option value="mao">Maomao Zhou</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Type"
                rules={[{ required: true, message: "Please choose the type" }]}
              >
                <Select placeholder="Please choose the type">
                  <Option value="private">Private</Option>
                  <Option value="public">Public</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="approver"
                label="Approver"
                rules={[
                  { required: true, message: "Please choose the approver" },
                ]}
              >
                <Select placeholder="Please choose the approver">
                  <Option value="jack">Jack Ma</Option>
                  <Option value="tom">Tom Liu</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="dateTime"
                label="DateTime"
                rules={[
                  { required: true, message: "Please choose the dateTime" },
                ]}
              >
                <DatePicker.RangePicker
                  style={{ width: "100%" }}
                  getPopupContainer={(trigger) => trigger.parentElement}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="description"
                label="Description"
                rules={[
                  {
                    required: true,
                    message: "please enter url description",
                  },
                ]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="please enter url description"
                />
              </Form.Item>
            </Col>
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
