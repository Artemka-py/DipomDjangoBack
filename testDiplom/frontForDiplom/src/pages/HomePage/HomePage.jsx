import React from 'react';
import { connect } from 'react-redux';

const HomePage = ({ username }) => {
  console.log(username + '');
  return (
    <>
      {username === null && (
        <div style={{ marginBottom: '15px' }}>
          <h2>
            Попробуйте тестовый режим нашего продукта. Войдите с учетными данными. Логин: test.
            Пароль: DiplomNa565.
          </h2>
        </div>
      )}
      <div
        style={{ width: '100%', height: '1000px' }}
        dangerouslySetInnerHTML={{
          __html: "<iframe style='width: 100%; height: 100%;'  src='https://www.severstal.com' />",
        }}
      />
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    username: state.username,
  };
};

export default connect(mapStateToProps)(HomePage);
