import { Select } from 'antd';

const { Option } = Select;

const UserSelect = (props) =>{
    const [data, setData] = UseState(null);

    function onChange(value) {
        console.log(`selected ${value}`);
    }

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
        await axios
          .get(`http://localhost:8000/api/tasks/${task_id}/`)
          .then(async (res) => {
            console.log(res.data);
            setData(res.data);
          })
          .catch((err) => console.error(err));
      }

    return (
        <>
            <Select
                showSearch
                style={{ width: 200 }}
                placeholder="Select a person"
                optionFilterProp="children"
                onChange={onChange}
                onFocus={onFocus}
                onBlur={onBlur}
                onSearch={onSearch}
                filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
            >
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="tom">Tom</Option>
            </Select>
        </>
    )
}