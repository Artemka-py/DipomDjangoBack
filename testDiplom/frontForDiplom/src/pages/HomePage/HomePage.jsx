import React from 'react';

const HomePage = () => {
  return (
    <div
      style={{ width: '100%', height: '1000px' }}
      dangerouslySetInnerHTML={{
        __html: "<iframe style='width: 100%; height: 100%;'  src='https://www.severstal.com' />",
      }}
    />
  );
};

export default HomePage;
