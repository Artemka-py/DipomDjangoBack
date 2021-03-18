import React, { Children, useEffect, useState } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { Table, Switch, Space } from 'antd';

const columns = [
  {
    title: 'Название задачи',
    dataIndex: 'task_name',
    key: 'name',
    align: 'center',
    sorter: (a, b) => a.name.length - b.name.length,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: 'Исполнитель',
    dataIndex: 'task_developer',
    key: 'task_developer',
    align: 'center',
    sorter: (a, b) => a.task_developer_login.length - b.task_developer_login.length,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: 'Постановщик',
    dataIndex: 'task_setter',
    key: 'task_setter',
    align: 'center',
    sorter: (a, b) => a.task_setter_login.length - b.task_setter_login.length,
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
  }
];

const Task = (props) => {
  const [data, setData] = useState(null);
  const [checkStrictly, setCheckStrictly] = React.useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      await axios
        .get(`http://localhost:8000/tasks-login/${props.username}/`)
        .then((res) => {
          console.log(res.data);
          setData(transformDataToTree(res.data));
        })
        .catch((err) => console.error(err));

      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <>
      <Space align="center" style={{ marginBottom: 16 }}>
        CheckStrictly: <Switch checked={checkStrictly} onChange={setCheckStrictly} />
      </Space>
      <Table
        columns={columns}
        rowSelection={{ ...rowSelection, checkStrictly }}
        dataSource={data}
      />
    </>
  );
}

// add new last() method:
if (!Array.prototype.last){
  Array.prototype.last = function(){
      return this[this.length - 1];
  };
};

function transformDataToTree(data){
  let treeData = [];
  let cur_lvls = [];
  data.map(function(item, i, arr){
    let treeItem = {
      key: item.pk,
      task_name: item.fields.task_name,
      task_developer: item.fields.task_developer_login,
      task_setter: item.fields.task_developer_login,
      start_date_plan: item.fields.start_date,
      finish_date_plan: item.fields.finish_date,
      children: []
    };
    let parent_key = item.fields.parent;
    if(parent_key == null){
      treeData.push(treeItem);
      if(cur_lvls.length == 0)
        cur_lvls[0] = 0
      else {
        cur_lvls[0] += 1;
      }
    } else {
      let lvl_down = 0;
      let copy = treeData[cur_lvls[0]];
      while ( parent_key !== copy.key){
        //copy = copy.children.last();
        copy = copy.children[cur_lvls[lvl_down]];
        lvl_down +=1;
      }
      lvl_down +=1;
      if(cur_lvls[lvl_down] === undefined){
        cur_lvls[lvl_down] = 0;
      } else {
        cur_lvls[lvl_down] +=1;
      }
      copy.children.push(treeItem);
    }
  });
    /*format:
      data=[
        { key: 1,
          name: 'John Brown sr.',
          age: 60,
          address: 'New York No. 1 Lake Park',
          children:[]
        }
      ]
    */
   return treeData;
}

const mapStateToProps = (state) => {
  return {
    username: state.username,
  }
}

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

export default connect(mapStateToProps)(Task)
