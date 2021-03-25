import Task from "./Task";
import {Route} from 'react-router-dom';
import Tasks_list from "./Tasks_list";
import { connect } from 'react-redux';

const Tasks = (props) => {
    return (
        <>
            <Tasks_list/>
            <Route path="/tasks/:task_id" component={Task} />
        </>
    );
}
const mapStateToProps = (state) => {
    return {
      username: state.username,
    };
};

export default connect(mapStateToProps)(Tasks);