import { Form, Input, Button, Checkbox } from "antd";
import { UserOutlined, LockOutlined, LoadingOutlined } from "@ant-design/icons";
import "./Auth.css";
import { connect } from "react-redux";
import * as actions from "../../../store/actions/auth";
import { NavLink } from "react-router-dom";
import { Spin } from "antd/es";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const Auth = (props) => {
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
    props.onAuth(values.username, values.password);
    props.history.push("/");
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  let errorMessage = null;
  if (props.error) {
    errorMessage = <p>{props.error.message}</p>;
  }

  return (
    <div style={{ marginLeft: "40%", height: "100vh", marginTop: "40px" }}>
      {errorMessage}
      {props.loading ? (
        <Spin indicator={antIcon} />
      ) : (
        <Form
          name="normal_login"
          className="login-form"
          style={{ maxWidth: "300px" }}
          onFinishFailed={onFinishFailed}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your Username!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Никнейм"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Пароль"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Запомнить меня</Checkbox>
            </Form.Item>

            <a className="login-form-forgot" style={{ float: "right" }} href="">
              Забыли пароль?
            </a>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: "100%" }}
              className="login-form-button"
            >
              Войти
            </Button>
            <br />
            <br />
            Или <NavLink to="/register">зарегистрируйтесь сейчас!</NavLink>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    loading: state.loading,
    error: state.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAuth: (username, password) =>
      dispatch(actions.authLogin(username, password)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
