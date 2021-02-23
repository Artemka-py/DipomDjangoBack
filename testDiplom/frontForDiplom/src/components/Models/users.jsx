import React from "react";
import { Table, Checkbox } from "antd";

const columns = [
  {
    title: "Логин пользователя",
    dataIndex: "user_login",
    key: "user_login",
  },
  {
    title: "Пароль пользователя",
    dataIndex: "user_password",
    key: "user_password",
  },
  {
    title: "Имя",
    dataIndex: "first_name",
    key: "first_name",
  },
  {
    title: "Фамилия",
    dataIndex: "middle_name",
  },
  {
    title: "Отчество",
    dataIndex: "sur_name",
  },
  {
    title: "Дата рождения",
    dataIndex: "birth_date",
  },
  {
    title: "Номер телефона",
    dataIndex: "phone_num",
    align: "center",
  },
  {
    title: "E-mail",
    dataIndex: "email_addr",
    align: "center",
  },
  {
    title: "Путь аватара",
    dataIndex: "user_image_src",
  },
  {
    title: "Логическое удаление",
    dataIndex: "logical_delete_status",
    align: "center",
    render: (logDel) => <Checkbox defaultChecked={logDel} disabled={true} />,
  },
];

const Users = (props) => {
  return (
    <Table
      bordered={true}
      loading={props.load}
      columns={columns}
      dataSource={props.data}
    />
  );
};

export default Users;
