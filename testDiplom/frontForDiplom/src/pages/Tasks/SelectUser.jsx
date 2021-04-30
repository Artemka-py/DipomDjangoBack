import { Select } from 'antd';
import {useEffect, useState} from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import {Spin } from 'antd';
import { UserOutlined } from '@ant-design/icons';


const { Option } = Select;
let realFetchData;

const SelectUser = (props, { value, onChange }
  ) =>{
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [user_login, setUser] = useState(props.user_login);
    const [project_id, setProject] = useState(props.project_id);
    // const[value, setValue] = useState(null);

    // const triggerChange = (changedValue) => {
    //     onChange?.({
    //       user_login,
    //       value,
    //       changedValue,
    //     });
    // };

    // const onUserChange = (newUser) => {
    //       setUser(newUser);
    //       // setValue(newUser);
    //     triggerChange({user_login: newUser});
    // };

    // function onBlur() {
    //     console.log('blur');
    // }

    // function onFocus() {
    //     console.log('focus');
    // }

    // function onSearch(val) {
    //     console.log('search:', val);
    // }

    const fetchData = async () => {
        console.log(props.project_id);
        await axios
          .get(`http://localhost:8000/workgroup-developers/${props.project_id}/`)
          .then(async (res) => {
            console.log(res.data);
            setData(res.data);
          })
          .catch((err) => console.error(err));
    }

    useEffect(() => {
        setLoading(true);
        fetchData().
        then(setLoading(false));
      }, []);

    useEffect(()=>{
      setProject(props.project_id);
      console.log("Prject Updated");
    },[project_id]);

    return (
            <Select
                // showSearch
                style={{ width: 200 }}
                // optionFilterProp="children"
                // value={user_login} 
                // onChange={onUserChange}
                // onSearch={onSearch}
                prefix={<UserOutlined/>} 
                // filterOption={(input, option) =>
                //   option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                // }
            >
                {data && 
                // (<Option key="spin"><Spin /></Option>) : 
                data.map((val, index)=>(
                    <Option value={val.developer_login} key={index}>
                      {val.developer_login}
                    </Option>
                  )
                )}
            </Select>
    )
}

const mapStateToProps = (state) => {
    return {
      username: state.username,
    };
  };

export default connect(mapStateToProps)(SelectUser);