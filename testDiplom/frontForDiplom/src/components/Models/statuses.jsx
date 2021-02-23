import React, { useEffect, useState } from "react";
import axios from "../../axios/axios-models";
import { Table, Popconfirm, Space, Button } from "antd";

const Statuses = (props) => {
  const [fetchedData, setFetchedData] = useState(null);

  useEffect(() => {
    axios
      .get("status/")
      .then((res) => {
        for (let i = 0; i < res.data.length; i++) res.data[i].key = i + 1;
        setFetchedData(res.data);
      })
      .catch(console.error);
  }, []);

  const columns = [
    {
      title: "Название статуса",
      dataIndex: "status_name",
    },
    {
      title: "Действия",
      dataIndex: "operation",
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary">Изменить данные</Button>
          <Popconfirm
            title="Уверены, что хотите удалить?"
            onConfirm={() => handleDelete(record.status_id)}
          >
            <a>Удалить</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleDelete = async (key) => {
    await axios
      .delete(`status/${key}`)
      .then((res) => console.log(res))
      .catch((e) => console.log(e));
  };

  return (
    <Table
      bordered={true}
      columns={columns}
      dataSource={fetchedData}
      loading={props.load}
    />
  );
};

export default Statuses;
