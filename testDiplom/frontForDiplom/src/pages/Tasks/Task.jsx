import React, { Children, useEffect, useState } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Table, Switch, Space } from 'antd';

const columns = [
  {
    title: 'Название задачи',
    dataIndex: 'task_name',
    key: 'name',
    align: 'center',
    sorter: (a, b) => a.task_name.length - b.task_name.length,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: 'Исполнитель',
    dataIndex: 'task_developer',
    key: 'task_developer',
    align: 'center',
    sorter: (a, b) => a.task_developer.length - b.task_developer.length,
    sortDirections: ['descend', 'ascend'],
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
    sorter: (a, b) => {
      return new Date(a.start_date_plan) - new Date(b.start_date_plan);
    },
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: 'Дата окончания проекта',
    dataIndex: 'finish_date_plan',
    key: 'finish_date_plan',
    align: 'center',
    sorter: (a, b) => {
      return new Date(a.start_date_plan) - new Date(b.start_date_plan);
    },
    sortDirections: ['descend', 'ascend'],
  },
];

if (!Array.prototype.last) {
  Array.prototype.last = function () {
    return this[this.length - 1];
  };
}

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

  console.log(treeData);
  return treeData;
}

const Task = (props) => {
  const [data, setData] = useState(null);
  const [checkStrictly, setCheckStrictly] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [projectsId, setProjectsId] = useState(null);
  const [statusPage, setStatusPage] = useState(false);
  let getFetchData;

  const fetchData = async () => {
    if (statusPage === false) setLoading(true);

    await axios
      .get(`http://127.0.0.1:8000/projects_id-login/${props.username}/`)
      .then((res) => {
        setProjectsId(res.data);
        console.log(res.data);
      })
      .catch((err) => console.error(err));

    // for (let i = 0; i < projectsId.length; i++) {
    //   window.test = projectsId;
    //   console.log(i);
    //   await axios
    //     .get(`http://localhost:8000/tasks-login/${projectsId[i].project_id}/`)
    //     .then((res) => {
    //       console.log(res.data);
    //       setData(transformDataToTree(res.data));
    //     })
    //     .catch((err) => console.error(err));
    // }

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
        expandable
        indentSize={45}
        dataSource={data}
        loading={loading}
        bordered={true}
      />
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    username: state.username,
  };
};

export default connect(mapStateToProps)(Task);
