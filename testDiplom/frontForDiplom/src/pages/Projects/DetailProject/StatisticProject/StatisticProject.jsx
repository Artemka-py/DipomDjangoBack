import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { connect } from 'react-redux';

const StatisticProject = ({ projectId, username, isOpen }) => {
  return (
    <h1>
      Statistic project {projectId} : {username}
    </h1>
  );
};

const mapStateToProps = (state) => {
  return {
    username: state.username,
  };
};

export default connect(mapStateToProps)(StatisticProject);
