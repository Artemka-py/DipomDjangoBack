import React, { useState, useEffect, Fragment } from 'react';
import { Spin } from 'antd';

const DetailProject = ({ match }) => {
  const ID = match.params.id;
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {};

  useEffect(() => {
    setLoading(true);

    fetchData().then(() => setLoading(false));
  }, []);

  return (
    <div>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Fragment>
          <h1>{ID}</h1>
        </Fragment>
      )}
    </div>
  );
};

export default DetailProject;
