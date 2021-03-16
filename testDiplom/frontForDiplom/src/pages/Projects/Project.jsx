import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { Table, Tooltip } from 'antd'
import {Link} from "react-router-dom";

const columns = [
  {
    title: 'Название проекта',
    dataIndex: 'project_name',
    key: 'name',
    align: 'center',
    render: (text, row, index) => {
      console.log('render')
      console.log(row)
      return (<Link to={`${row.project_id}`}>{text}</Link>)
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
      if (projectInfo.length > 150)
        projectInfo = projectInfo.substring(0, 150).trim() + '...'
      return (
        <Tooltip placement="topLeft" title={projectInfo}>
          {projectInfo}
        </Tooltip>
      )
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
]

const Project = (props) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      await axios
        .get(`http://localhost:8000/project-login/${props.username}/`)
        .then((res) => {
          setData(res.data)
        })
        .catch((err) => console.error(err))

      setLoading(false)
    }
    fetchData()
  }, [])

  return (
    <div>
      <Table
        loading={loading}
        onRow={(record, rowIndex) => {
          return {
            onClick: event => {
              console.log('click')
              console.log(record, rowIndex)
            }
          }
        }}
        bordered={true}
        rowKey={(record) => record.project_id}
        dataSource={data}
        columns={columns}
      />
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    username: state.username,
  }
}

export default connect(mapStateToProps)(Project)
