import React, { useState, useEffect } from 'react';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, Upload } from 'antd';
import { LoadingOutlined, UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const { Option } = Select;

const DetailDrawer = ({
  onClose,
  visible,
  infoForDetail,
  username,
  statuses,
  removeUploadAction,
  uploadAction,
  onOrgChange,
  statusesFetch,
  org,
}) => {
  const [rights, setRights] = useState(false);
  const [loading, setLoading] = useState(false);
  console.log(infoForDetail);

  const checkRights = async () => {
    await axios
      .get(`http://127.0.0.1:8000/project-check-rights/${username}/${infoForDetail.project_id}/`)
      .then((res) => {
        console.log(!!res.data);
        setRights(!!res.data);
      })
      .catch((err) => console.error(err));
  };

  const handlerOnClose = () => {
    setRights(false);
    onClose();
  };

  useEffect(() => {
    statusesFetch();
    checkRights();
  }, []);

  const onChangeFinish = () => {};

  const renderStatuses = () => {
    return (
      <>
        {statuses
          ? statuses.map((e, index) => {
              console.log(index);
              return (
                <Option key={index} value={e.status_id}>
                  {e.status_name}
                </Option>
              );
            })
          : null}
      </>
    );
  };

  return (
    <Drawer
      title={
        'Детали проекта: ' +
        infoForDetail.project_name +
        '. ' +
        (rights
          ? 'Вы имеете право редактировать информацию.'
          : 'У вас нет прав для редактирования данного проекта.')
      }
      width={720}
      onClose={handlerOnClose}
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
      <Form layout="vertical" hideRequiredMark onFinish={onChangeFinish}>
        <Row gutter={16}>
          {/*<Col span={12}>*/}
          {/*  <Form.Item*/}
          {/*    name="project_name"*/}
          {/*    label="Название проекта"*/}
          {/*    rules={[*/}
          {/*      {*/}
          {/*        required: true,*/}
          {/*        message: 'Пожалуйста напишите название проекта',*/}
          {/*      },*/}
          {/*    ]}*/}
          {/*  >*/}
          {/*    <Input placeholder="Пожалуйста напишите название проекта" />*/}
          {/*  </Form.Item>*/}
          {/*</Col>*/}
          <Col span={12}>
            <Form.Item name="status_name" label="Статус проекта">
              <Select placeholder="Выберите статус" defaultValue={infoForDetail.status_name}>
                {renderStatuses()}
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
          {/*<Col span={12}>*/}
          {/*  <Form.Item*/}
          {/*    name="project_client_login"*/}
          {/*    label="Логин клиента"*/}
          {/*    rules={[*/}
          {/*      {*/}
          {/*        required: true,*/}
          {/*        message: 'Пожалуйста выберите клиента',*/}
          {/*      },*/}
          {/*    ]}*/}
          {/*  >*/}
          {/*    <Select loading={loadingSelect} disabled={statusOrg} placeholder="Выберите клиента">*/}
          {/*      {clients*/}
          {/*        ? clients.map((e, index) => (*/}
          {/*            <Option key={index} value={e.pk}>*/}
          {/*              {e.pk}*/}
          {/*            </Option>*/}
          {/*          ))*/}
          {/*        : null}*/}
          {/*    </Select>*/}
          {/*  </Form.Item>*/}
          {/*</Col>*/}
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
              <Input placeholder="Напишите название рабочей группы" allowClear />
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
                allowClear
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
                  <Button icon={<UploadOutlined />}>Прикрепить (Максимально: 5)</Button>
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
              loading={loading}
            >
              Создать новый проект
            </Button>
          </Form.Item>
        </Row>
      </Form>
    </Drawer>
  );
};

export default DetailDrawer;
