import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { Table } from 'antd'

const dataSource = [
  {
    key: '1',
    name: 'Mike',
    age: 32,
    address: '10 Downing Street',
  },
  {
    key: '2',
    name: 'John',
    age: 42,
    address: '10 Downing Street',
  },
]

const columns = [
  {
    title: 'ID',
    dataIndex: 'project_id',
    key: 'id',
    align: 'center',
  },
  {
    title: 'Name',
    dataIndex: 'project_name',
    key: 'name',
    align: 'center',
  },
]

const Project = (props) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(async () => {
    setLoading(true)
    await axios
      .get(`http://localhost:8000/project-login/${props.username}/`)
      .then((res) => {
        setData(res.data)
      })
      .catch((err) => console.error(err))
    setLoading(false)
  }, [])

  return (
    <div>
      <Table loading={loading} dataSource={data} columns={columns} />
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    username: state.username,
  }
}

export default connect(mapStateToProps)(Project)
