import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { connect } from 'react-redux';
import axios from 'axios';

/**
 * Страница о сайте.
 *
 * @param {number} projectId
 * @param {number} work_Id
 * @return возвращает разметку.
 */
const StatisticProject = ({ projectId, work_Id }) => {
  const [data, setData] = useState({});
  const [enable, setEnable] = useState(true);

  // Получение статистики
  const fetchStatistic = async () => {
    await axios
      .get(`http://localhost:8000/statistic/${projectId}/`)
      .then((res) => {
        if (res.data[0].allCount === 0 && res.data[0].inProgress === 0) return setEnable(false);
        setData({
          labels: ['Кол-во свободных сотрудников', 'Кол-во занятых сотрудников'],
          datasets: [
            {
              label: '# of Votes',
              data: [res.data[0].allCount - res.data[0].inProgress, res.data[0].inProgress],
              backgroundColor: ['rgb(47,239,0, 0.2)', 'rgba(255,99,132,0.2)'],
              borderColor: ['rgba(47,239,0, 1)', 'rgba(255, 99, 132, 1)'],
              borderWidth: 1,
            },
          ],
        });
      })
      .catch((err) => console.error(err.message));
  };

  useEffect(() => {
    fetchStatistic();
  }, []);

  return (
    <>
      <h1>Статистика свободных и занятых разработчиков всего проекта</h1>
      <hr />
      {enable && data ? (
        <>
          <Pie data={data} />
        </>
      ) : (
        <>
          <h2>Задач в данном проекте еще нет</h2>
        </>
      )}

      <hr />

      {work_Id}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    username: state.username,
  };
};

export default connect(mapStateToProps)(StatisticProject);
