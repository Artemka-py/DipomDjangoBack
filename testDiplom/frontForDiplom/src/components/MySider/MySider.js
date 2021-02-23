import React from "react";
import classes from "./MySider.module.css";
import { Menu, Layout } from "antd";
import { NavLink } from "react-router-dom";
import { TagsOutlined, UserOutlined } from "@ant-design/icons";
const { Sider } = Layout;

const MySider = (props) => {
  const state = {
    collectionModels: {
      users: {
        name: "Пользователи",
        icon: <UserOutlined />,
        to: "/admin/users",
      },
      status: {
        name: "Статусы",
        icon: <TagsOutlined />,
        to: "/admin/status",
      },
    },
  };

  return (
    <Sider className={classes.Sider}>
      <Menu theme="dark" defaultSelectedKeys={[props.model]} mode="inline">
        {Object.keys(state.collectionModels).map((nameProperties, index) => {
          const properties = state.collectionModels[nameProperties];
          return (
            <Menu.Item key={nameProperties} icon={properties.icon}>
              <NavLink to={properties.to} exact={true}>
                {properties.name}
              </NavLink>
            </Menu.Item>
          );
        })}
      </Menu>
    </Sider>
  );
};

export default MySider;
