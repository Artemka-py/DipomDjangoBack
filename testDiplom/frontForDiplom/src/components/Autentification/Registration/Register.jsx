import React, { useState } from "react";
import { Form, Input, Select, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import classes from "./Register.module.css";
import * as actions from "../../../store/actions/auth";

const Register = (props) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
    props.onRegister(
      values.username,
      values.email,
      values.password1,
      values.password2
    );
    props.history.push("/");
  };

  // const prefixSelector = (
  //   <Form.Item name="prefix" noStyle>
  //     <Select
  //       style={{
  //         width: 70,
  //       }}
  //     >
  //       <Option value="+7">+7</Option>
  //     </Select>
  //   </Form.Item>
  // );

  return (
    <div className={classes.test}>
      <Form form={form} name="register" onFinish={onFinish} scrollToFirstError>
        <Form.Item
          name="username"
          label="Никнейм"
          rules={[
            {
              required: true,
              message: "Пожалуйста напишите ваш никнейм!",
              whitespace: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              type: "email",
              message: "Некорректный E-mail!",
            },
            {
              required: true,
              message: "Пожалуйста напишите ваш E-mail!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password1"
          label="Пароль"
          rules={[
            {
              required: true,
              message: "Пожалуйста напишите пароль!",
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="password2"
          label="Подтвердите пароль"
          dependencies={["password1"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Пожалуйста потдвердите ваш пароль!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password1") === value) {
                  return Promise.resolve();
                }

                return Promise.reject("Оба пароля должны совпадать!");
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        {/*<Form.Item*/}
        {/*  name="phone"*/}
        {/*  label="Phone Number"*/}
        {/*  rules={[*/}
        {/*    {*/}
        {/*      required: true,*/}
        {/*      message: "Please input your phone number!",*/}
        {/*    },*/}
        {/*  ]}*/}
        {/*>*/}
        {/*  <Input*/}
        {/*    addonBefore={prefixSelector}*/}
        {/*    style={{*/}
        {/*      width: "100%",*/}
        {/*    }}*/}
        {/*  />*/}
        {/*</Form.Item>*/}

        {/*<Form.Item*/}
        {/*  name="agreement"*/}
        {/*  valuePropName="checked"*/}
        {/*  rules={[*/}
        {/*    {*/}
        {/*      validator: (_, value) =>*/}
        {/*        value*/}
        {/*          ? Promise.resolve()*/}
        {/*          : Promise.reject("Should accept agreement"),*/}
        {/*    },*/}
        {/*  ]}*/}
        {/*  {...tailFormItemLayout}*/}
        {/*>*/}
        {/*  <Checkbox>*/}
        {/*    I have read the <a href="">agreement</a>*/}
        {/*  </Checkbox>*/}
        {/*</Form.Item>*/}
        <Form.Item>
          <Button type="primary" style={{ width: "100%" }} htmlType="submit" loading={props.loading}>
            Зарегистрироваться
          </Button>
        </Form.Item>
      </Form>
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
    onRegister: (username, email, password1, password2) =>
      dispatch(actions.authSignup(username, email, password1, password2)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
