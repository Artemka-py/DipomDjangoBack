import React from "react";
import { Layout, Menu } from "antd";
import { Footer } from "antd/es/layout/layout";
import { Link } from "react-router-dom";
import "../App.css";
import { connect } from "react-redux";
import * as actions from "../store/actions/auth";

const { Header, Content } = Layout;

const Master = (props) => {
  return (
    <Layout>
      <Header className="header">
        <div className="logo" />
        <Menu
          theme="dark"
          style={{ color: "#fff" }}
          mode="horizontal"
          defaultSelectedKeys={["1"]}
        >
          <Menu.Item key="1">
            <Link to="/">Главная</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/about">О сайте</Link>
          </Menu.Item>
          {/*TODO: Сделать выравнивание по правой стороне */}
          {props.isAuthenticated ? (
            <Menu.Item key="3" onClick={props.onLogout}>
              <Link to="/">Выход</Link>
            </Menu.Item>
          ) : (
            <Menu.Item key="3">
              <Link to="/auth">Авторизация</Link>
            </Menu.Item>
          )}
        </Menu>
      </Header>
      <Layout>
        <Layout style={{ padding: "0 24px 24px" }}>
          <hr />
          <hr />
          <Content className="site-layout-background">
            <main>{props.children}</main>
          </Content>
        </Layout>
      </Layout>
      <Footer style={{ textAlign: "end" }}>&#169;Lytkin</Footer>
    </Layout>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLogout: () => dispatch(actions.logout()),
  };
};

export default connect(null, mapDispatchToProps)(Master);
