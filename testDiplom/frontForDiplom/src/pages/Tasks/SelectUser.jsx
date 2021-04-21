import { Select } from 'antd';
import {useEffect, useState} from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import {Spin } from 'antd';


const { Option } = Select;
let realFetchData;

const SelectUser = (props, { value = {}, onChange }) =>{
    const [data, setData] = useState(null);
    const [project_id, setProjectId] = useState(props.project_id);
    const [loading, setLoading] = useState(false);
    const [user_login, setUser] = useState(props.user_login);

    const triggerChange = (changedValue) => {
        onChange?.({
          user_login,
          ...value,
          ...changedValue,
        });
    };

    const onUserChange = (newUser) => {
        if (!('user' in value)) {
          setUser(newUser);
        }
    
        triggerChange({
          user_login: newUser,
        });
      };

    function onBlur() {
        console.log('blur');
    }

    function onFocus() {
        console.log('focus');
    }

    function onSearch(val) {
        console.log('search:', val);
    }

    const fetchData = async () => {
        console.log(props.project_id);
        await axios
          .get(`http://localhost:8000/workgroup-developers/${project_id}/`)
          .then(async (res) => {
            console.log(res.data);
            setData(res.data);
          })
          .catch((err) => console.error(err));
    }

    useEffect(() => {
        setLoading(true);
        fetchData().
        then(setLoading(false))
      }, [props.username]);

    return (
        <>
            <Select
                showSearch
                style={{ width: 200 }}
                placeholder="Select a person"
                optionFilterProp="children"
                value={value.user_login || user_login} 
                onChange={onUserChange}
                onFocus={onFocus}
                onBlur={onBlur}
                onSearch={onSearch}
                filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                // prefix={<UserOutlined/>} 
                }
            >
                {!data ? 
                (<Option><Spin /></Option>) : 
                (data.map((val)=>
                    <Option value={val.developer_login}>{val.developer_login}</Option>
                ))}
            </Select>
        </>
    )
}

const mapStateToProps = (state) => {
    return {
      username: state.username,
    };
  };

export default connect(mapStateToProps)(SelectUser);