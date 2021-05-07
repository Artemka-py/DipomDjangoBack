import React from 'react';
import { Link } from 'react-router-dom';
import classes from './AboutPage.module.css';
import imageView from './../../images/viewTasks.png';
import addTaskImage from './../../images/addTask.png';
import exportTaskImage from './../../images/exportTasks.png';
import importUsersImage from './../../images/importUsers.png';
import allImage from './../../images/all.png';

const AboutPage = () => {
  const reloadAdmin = () => {
    setTimeout(() => {
      console.log(window.location.pathname);
      window.location.reload();
    }, 1);
  };

  return (
    <div className={classes.AboutPage}>
      <h1 className={classes.center + ' ' + classes.textH}>
        Руководство по началу работы c Помоги себе сам
      </h1>
      <h2>Что такое Помоги себе сам</h2>
      <h3>
        Помоги себе сам - это веб-ресурс направленный на автоматизацию контроля и распределния задач
        среди для администрации и разработчиков отдела R&amp;D, главной задачей которого является
        формирование и расспределение задач среди сотрудников информационно технического отдела, а
        так же учет выполнения поставленных задач, с возможностью экспорта задач
      </h3>
      <h3>
        Создав проект, пользователи данного веб-ресурса: менеджеры, клиенты, разработчики. Могут
        наблюдать за процессом продвижения выполнения проекта, а разработчики могут удобно наблюдать
        свои задачи тем самым распределять свое время и видеть замечания или проблемы в задачах
        после "code review".
      </h3>
      <h3>
        Данное руководство содержит вводные сведения о программном продукте для веб-ресурса "Помоги
        себе сам". В нем представлены рекомендации и указания, с помощью которых вы сможете начать
        работу в программном продукте или перенести существующие задачи.
      </h3>
      <h2>С чего начать?</h2>
      <h3>
        Что бы создать задачу переходим во вкладку Задачи, там есть возможность сформировать задачу,
        которую затем можно расспределить меджду сотрудниками, формируем (
        <Link to="/admin/diploAdmin/tasks/add" onClick={reloadAdmin}>
          переход на данную страницу
        </Link>
        ):
      </h3>
      <div className={classes.center}>
        <img src={addTaskImage} className={classes.imgView} />
      </div>
      <br />
      <h3>
        Затем данная задача отобразиться в списке всех задач. Если выбрать любую из задач, над ней
        можно проводить манипуляции, а именно: Изменять, Удалять, смотерть подробности задачи (
        <Link to="/admin/diploAdmin/tasks" onClick={reloadAdmin}>
          переход на данную страницу
        </Link>
        ):
      </h3>
      <div className={classes.center}>
        <img src={imageView} className={classes.imgView} />
      </div>
      <br />
      <h3>
        Так же можно эксопртировать задачи в нескольких форматах (
        <Link to="/admin/diploAdmin/tasks" onClick={reloadAdmin}>
          переход на данную страницу
        </Link>
        ):
      </h3>
      <div className={classes.center}>
        <img src={exportTaskImage} style={{ width: '25%' }} />
      </div>
      <br />
      <h3>
        Вдобавок есть импорт пользователей. Импорт можно воспроизводить, в некоторых форматах,
        данные форматы будут представлены на скриншоте (
        <Link to="/admin/diploAdmin/users/import" onClick={reloadAdmin}>
          переход на данную страницу
        </Link>
        ):
      </h3>
      <div className={classes.center}>
        <img src={importUsersImage} className={classes.imgView} />
      </div>
      <br />
      <h3>
        Так же стандартные функции по типу: добавление, изменение, удаление, фильтрация, поиск.
        Представлены на следующих страницах, которые служат для заполнения контента и данных (
        <Link to="/admin" onClick={reloadAdmin}>
          переход на данную страницу
        </Link>
        ):
      </h3>
      <div className={classes.center}>
        <img src={allImage} style={{ height: '50% !important' }} />
      </div>
      <br />
      <h2 style={{ fontSize: '180%', textAlign: 'center' }}>Системные характеристики</h2>
      <br />
      <table className="table">
        <thead>
          <tr>
            <th>Название</th>
            <th>Характеристики</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Процессор</td>
            <td>1.6 МГц</td>
          </tr>
          <tr>
            <td>Оперативная память</td>
            <td>1 ГБ</td>
          </tr>
          <tr>
            <td>Накопитель информации</td>
            <td>30 ГБ</td>
          </tr>
          <tr>
            <td>ОС</td>
            <td>Любая</td>
          </tr>
          <tr>
            <td>Скорость интернета</td>
            <td>10 мб/c</td>
          </tr>
        </tbody>
      </table>
      <br />
      <h2 style={{ fontSize: '180%', textAlign: 'center' }}>Сравнение с аналогами</h2>
      <br />
      <div>
        <table className="zebra" style={{ width: '50vw' }}>
          <thead>
            <tr>
              <th>Критерии</th>
              <th>Помоги себе сам</th>
              <th>Trello</th>
              <th>Jira</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="round-top">Разработчик</td>
              <td>Лыткин А.Н., Билл Гейтс</td>
              <td>Atlassian</td>
              <td>Atlassian</td>
            </tr>
            <tr>
              <td>Цена</td>
              <td>Бесплатно</td>
              <td>Начиная с 10$ в месяц</td>
              <td>Бесплатно</td>
            </tr>
            <tr>
              <td>Хостинг</td>
              <td>Облачный</td>
              <td>Локальный и облачный</td>
              <td>Облачный</td>
            </tr>
            <tr>
              <td>Мобильные приложения</td>
              <td>В будущем возможен релиз, зависит от Стив Джобса</td>
              <td>Android, iOS</td>
              <td>Android, iOS</td>
            </tr>
            <tr>
              <td>Управление задачами</td>
              <td>Да</td>
              <td>Да</td>
              <td>Да</td>
            </tr>
            <tr>
              <td>Отслеживание времени</td>
              <td>Да</td>
              <td>Да</td>
              <td>Нет</td>
            </tr>
            <tr>
              <td>Формирование отчета</td>
              <td>Да</td>
              <td>Да</td>
              <td>Нет</td>
            </tr>
            <tr>
              <td>Назначение ресуров на задачу</td>
              <td>Да</td>
              <td>Да</td>
              <td>Да</td>
            </tr>
            <tr>
              <td className="round-bottom">Импорт ресурсов</td>
              <td>Да</td>
              <td>Нет</td>
              <td>Нет</td>
            </tr>
          </tbody>
        </table>
      </div>
      <br />
      <h3>
        Данный веб-ресурс до сих пор находится в разработке. Если увидите замечания или найдете
        ошибки или есть{' '}
        <a href="mailto:i_a.n.litkin@mpt.ru">предложения пишите на электронную почту</a>.
      </h3>
    </div>
  );
};

export default AboutPage;

// {/* <div>
//       <h2>Для кого?</h2>
//       <h3>
//         <div style={{ marginLeft: "20px" }}>
//           Для команд требующих распределения задач между ответственными зонами
//           команды, отделами, разработчиками и компаниями.
//         </div>
//       </h3>
//       <h2>Для чего?</h2>
//       <h3>
//         <div style={{ marginLeft: "20px" }}>
//           Для того, чтобы задачи определенного проекта были видны сотрудникам и
//           наглядно показывали, что нужно выполнять им,
//         </div>{" "}
//         что делают другие, что нужно доделать и т.д..
//       </h3>
//       <h2>Как пользоваться?</h2>
//       <h3 style={{ marginLeft: "20px" }}>
//         Административная панель (для менеджеров и администрации веб-ресурса)
//       </h3>
//       <h4>
//         <div style={{ marginLeft: "40px" }}>
//           {" "}
//           При переходе на страницу{" "}
//           <Link to="/admin" onClick={reloadAdmin}>
//             административная панель
//           </Link>{" "}
//           вы увидите таблицы с данными информационного ресурса. Данные таблицы в
//           себе хранят информацию нужную для работы информационного ресурса.
//           Данными в таблицах можно оперировать с помощью функций добавить,
//           изменить, удалить, перетащить, экспортировать, ипортировать, удалить
//           выбранные данные, фильтрация, поиск и т.д..
//         </div>
//       </h4>
//     </div> */}
