import React from "react";
import { Layout } from "antd";
import classes from "./MyFooter.module.css";
const { Footer } = Layout;

const MyFooter = () => {
  return <Footer className={classes.Footer}>&#169;Lytkin Artem</Footer>;
};

export default MyFooter;
