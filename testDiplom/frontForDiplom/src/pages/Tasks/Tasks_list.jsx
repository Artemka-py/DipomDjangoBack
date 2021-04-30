import React, { useEffect, useState } from 'react';
import axios from 'axios'; 
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Table, Tooltip} from 'antd';

const columns = [
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
    render: task_developer => (
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
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  onSelect: (record, selected, selectedRows) => {
    console.log(record, selected, selectedRows);
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
    console.log(selected, selectedRows, changeRows);
  },
};

// add new last() method:
if (!Array.prototype.last) {
  Array.prototype.last = function () {
    return this[this.length - 1];
  };
}
function transformData(data){
  const data_transformed = [];
  data.forEach(item => {
    let dataItem = {
      key: item.pk,
      task_name: item.fields.task_name,
      task_developer: item.fields.task_developer_login,
      task_setter: item.fields.task_developer_login,
      start_date_plan: item.fields.start_date,
      finish_date_plan: item.fields.finish_date
    };
    data_transformed.push(dataItem);
  });
  return data_transformed;
}

const Tasks_list = (props) => {                                                                                                                 
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusPage, setStatusPage] = useState(false);
  let getFetchData;

  const fetchData = async () => {
    if (statusPage === false) setLoading(true);

    await axios
      .get(`http://localhost:8000/tasks-login/${props.username}/`)
      .then((res) => {
        console.log(res.data)

        setData(transformData(res.data));
      })
      .catch((err) => console.error(err));

    if (statusPage === false) setLoading(false);
    if (statusPage === false) setStatusPage(true);
  };

  useEffect(() => {
    fetchData();
  }, [props.username]);

  return (
    <>
      <Table
        columns={columns}
        rowSelection={{ ...rowSelection}}
        rowKey={(record) => record.key}
        dataSource={data}
        loading={loading}
      />
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    username: state.username,
  };
};

export default connect(mapStateToProps)(Tasks_list);
