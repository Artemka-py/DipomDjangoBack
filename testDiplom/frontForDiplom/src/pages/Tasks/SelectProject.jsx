import { Select } from 'antd';
import {useEffect, useState} from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import {Spin } from 'antd';


const { Option } = Select;
let realFetchData;

const SelectProject = (props, { value = {}, onChange }) =>{
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [project_id, setProject] = useState(props.project_id);

    const triggerChange = (changedValue) => {
        onChange?.({
          project_id,
          ...value,
          ...changedValue,
        });
    };

    const oneProjectChange = (newProject) => {
        setProject(newProject);
        triggerChange({project_id: newProject});
        props.onProjectChange(newProject);
      };

    function onSearch(val) {
        console.log('search:', val);
    }

    const fetchData = async () => {
        await axios
          .get(`http://localhost:8000/project-login/${props.username}/`)
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
      }, []);

    return (
        <>
            <Select
                showSearch
                style={{ width: 200 }}
                placeholder="Select a person"
                optionFilterProp="children"
                value={project_id} 
                onChange={oneProjectChange}
                onSearch={onSearch}
                filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                // prefix={<UserOutlined/>} 
                }
            >
                {!data ? 
                (<Option><Spin /></Option>) : 
                (data.map((val, index)=>
                    <Option key={index} value={val.project_id}>{val.project_name}</Option>
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

export default connect(mapStateToProps)(SelectProject);