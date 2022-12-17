import './App.css';
import './task.css';
import './nav.css';
import './weather.css';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import GraphComponent from './GraphComponent';
import Info from './InfoComponent';
import Task from './TaskComponent';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';

function App() {
  const [time, setTime] = useState('Hello');

  useEffect(() => {
    //Get current date for home text
    const hours = new Date().getHours();
    setTime(hours);
    console.log(typeof hours);
    switch (true) {
      case hours >= 0 && hours < 8:
        setTime('Good night!');
        break;
      case hours >= 8 && hours < 10:
        setTime('Good morning!');
        break;
      case hours >= 10 && hours < 12:
        setTime('Good day!');
        break;
      case hours >= 12 && hours < 18:
        setTime('Good afternoon!');
        break;
      case hours >= 18 && hours < 20:
        setTime('Good evening!');
        break;
      case hours >= 20 && hours < 22:
        setTime('Good late evening!');
        break;
      case hours >= 22 && hours < 24:
        setTime('Working late?');
        break;
      default:
        break;
    }
  }, []);

  return (
    <BrowserRouter>
      <>
        <nav>
          <ul className='nav-list'>
            <li className='nav-item'>
              <Link to='/'>Home</Link>
            </li>
            <li className='nav-item'>
              <Link to='/tasks'>Tasks</Link>
            </li>
            <li className='nav-item'>
              <Link to='/time'>Time</Link>
            </li>
            <li className='nav-item'>
              <Link to='/info'>Info</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route
            path='/'
            element={
              <div className='home'>
                <h1>{time}</h1>
                <div className='homeWrapper'>
                  <Weather className='weather' />

                  <ImportantTask></ImportantTask>
                </div>
              </div>
            }
          ></Route>
          <Route path='tasks/*' element={<Task />} />
          <Route path='time/*' element={<GraphComponent />} />
          <Route path='info/*' element={<Info />} />
        </Routes>
      </>
    </BrowserRouter>
  );
}

function Weather() {
  const [weather, setWeather] = useState(0);
  const [weatherIcon, setWeatherIcon] = useState();
  const [weatherStatus, setWeatherStatus] = useState('sunny');
  const [locationInAPI, setLocationInAPI] = useState('');
  const [q, setQ] = useState(
    JSON.parse(window.localStorage.getItem('location')) || 'Helsinki'
  );

  const [weatherAPIKEY, setweatherAPIKEY] = useState(
    JSON.parse(window.localStorage.getItem('apikey')) || null
  );
  const [userInput, setUserInput] = useState('');

  //Update
  useEffect(() => {
    //Get the location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setQ(
          position.coords.latitude.toString() +
            ',' +
            position.coords.longitude.toString()
        );
      },
      (error) => {
        console.warn(`ERROR GETTING THE LOCATION DATA, ${error.code}`);
      }
    );
    if (weatherAPIKEY) {
      axios
        .get('https://api.weatherapi.com/v1/current.json', {
          params: { key: weatherAPIKEY, q: q },
        })
        .then((response) => {
          window.localStorage.setItem('location', JSON.stringify(q));
          setWeather(response.data.current);
          setLocationInAPI(response.data.location.name.toString());
          setWeatherIcon(response.data.current.condition.icon);
          setWeatherStatus(response.data.current.condition.text);
        })
        .catch((error) => {
          localStorage.removeItem('apikey');
          setweatherAPIKEY(null);
          alert(
            'The API Key was bad. Please re-enter. If this error continues to come up, please contact me at: aaro.varjonen@tuni.fi'
          );
        });
    }
  }, [q, weatherAPIKEY]);

  const submitAPIKEY = (e) => {
    e.preventDefault();
    window.localStorage.setItem('apikey', JSON.stringify(userInput));
    setweatherAPIKEY(userInput);
  };
  return weatherAPIKEY ? (
    <div className='weather'>
      <h2>
        Current weather in {locationInAPI}: <br></br>
        {weatherStatus}
        <img
          src={weatherIcon}
          alt='Icon which reflects the weather outside'
          className='weatherIcon'
        ></img>
      </h2>
      <h3>
        {' '}
        Temperature is: {weather.temp_c} °C and it feels like:{' '}
        {weather.feelslike_c} °C
      </h3>
      <p>
        Humidity is: {weather.humidity} % and the wind is {weather.wind_kph}{' '}
        km/h
      </p>
      Powered by{' '}
      <a href='https://www.weatherapi.com/' title='Free Weather API'>
        WeatherAPI.com
      </a>
    </div>
  ) : (
    <div className='weather'>
      <h2>To see the current weather, check if you have an API key!</h2>
      <form onSubmit={submitAPIKEY}>
        <label>Please input your API Key</label>
        {
          <input
            type={'text'}
            required
            value={userInput}
            onChange={(e) => {
              setUserInput(e.target.value);
            }}
          ></input>
        }
        {<input type={'submit'}></input>}
      </form>
    </div>
  );
}

function ImportantTask() {
  const [tasks, setTasks] = useState('');

  const getcomponents = () => {
    let newDate = new Date();
    axios.get('http://localhost:3010/tasks').then((response) => {
      //List full of all the tasks
      let list = response.data;
      /* console.log(list); */
      //Filter out the tasks to the tasks, which are yet to be completed
      let todolist = [];

      list.forEach((element) => {
        if (!element.completed) {
          let deadlineDate = new Date(element.deadline);

          //Floor, since we want to get how many full days we have left. the big number is converting milliseconds to days, since the diff between dates gives the diff in ms
          element.timeleft = Math.floor((deadlineDate - newDate) / 86400000);

          todolist.push(element);
        }
      });
      //Sort the todolist by time left
      todolist.sort((a, b) => a.timeleft - b.timeleft);
      let leastTime = todolist[0];

      setTasks(
        <div
          className='leastTime'
          style={{
            border: leastTime.timeleft < 0 ? '2px solid red' : 'none',
          }}
        >
          <h1>Task with the least amount of time until deadline</h1>
          <div
            style={{
              backgroundColor: 'rgba(0,0,0,0.1)',
              padding: '5px',
              borderRadius: '8px',
            }}
          >
            <h2 key={'h1'} className='taskHeader'>
              {leastTime.title}
            </h2>
            <h3 key={'daysleft'}>Days left: {leastTime.timeleft}</h3>
            <p key={'deadline'}>Deadline: {leastTime.deadline}</p>
            <p key={'p'}>{leastTime.description}</p>
          </div>
        </div>
      );
    });
  };
  useEffect(() => {
    getcomponents();
  }, []);

  return <>{tasks}</>;
}
export default App;
