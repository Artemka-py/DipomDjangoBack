import Task from "./Task";
import {Route, Switch} from 'react-router-dom';
import Tasks_list from "./Tasks_list";
import AddTask from "./AddTask";
import { connect } from 'react-redux';
import { Button } from 'antd';

const Tasks = (props) => {
    return (
        <>
            <p><Button type="primary" href="/tasks/add_new_task">Новая задача</Button></p>
            <Tasks_list/>
            <Switch>
                <Route path="/tasks/add_new_task" component={AddTask} />
                <Route path="/tasks/:task_id" component={Task} />
            </Switch>
        </>
    );
}
const mapStateToProps = (state) => {
    return {
      username: state.username,
    };
};

export default connect(mapStateToProps)(Tasks);