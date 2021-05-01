import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { connect } from 'react-redux';

const StatisticsExport = ({}) => {
  return <h1>Statisctic</h1>;
};

const mapStateToProps = (state) => {
  return {
    username: state.username,
  };
};

export default connect(mapStateToProps)(StatisticsExport);
