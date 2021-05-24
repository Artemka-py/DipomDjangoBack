import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Table, Tooltip } from 'antd';

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
function transformData(data) {
  const data_transformed = {};
  console.log(data);
  data.forEach((item) => {
    let dataItem = {
      key: item.task_id,
      task_name: item.task_name,
      task_developer: item.task_developer_login,
      task_setter: item.task_setter_login_id,
      start_date_plan: item.start_date,
      finish_date_plan: item.finish_date,
    };
    if (!data_transformed[item.project_task_id]) {
      data_transformed[item.project_task_id] = {
        project_name: item.project_name,
        data: [],
      };
    }
    data_transformed[item.project_task_id].data.push(dataItem);
  });

  console.log(data_transformed);

  return data_transformed;
}

/**
 * Страница с задачами.
 *
 * @return возвращает разметку.
 */
const Tasks_list = (props) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  let getFetchData;

  // Получение задач
  const fetchData = async () => {
    await axios
      .get(`http://localhost:8000/tasks-login/${props.username}/`)
      .then((res) => {
        setData(transformData(res.data));
        console.log('data', res.data);
        // return transformData(res.data);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    setLoading(true);
    fetchData().then((data) => setLoading(false));
  }, []);

  // Стили блока
  const projectTitleStyle = {
    backgroundColor: 'grey',
    fontSize: 20,
    fontWeight: 600,
    paddingLeft: 30,
    paddingTop: 10,
    paddingRight: 30,
    paddingBottom: 10,
    color: 'white',
    marginBottom: 0,
  };

  return (
    <>
      {data &&
        Object.entries(data).map(([key, value]) => (
          <>
            <p style={projectTitleStyle}>
              <a
                style={{ textDecoration: 'none', color: '#fff' }}
                href={`http://localhost:3006/project-detail/${key}`}
              >
                {value.project_name}
              </a>
            </p>
            <Table
              columns={columns}
              rowSelection={{ ...rowSelection }}
              rowKey={(record) => record.key}
              dataSource={value.data}
              loading={loading}
            />
          </>
        ))}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    username: state.username,
  };
};

export default connect(mapStateToProps)(Tasks_list);
