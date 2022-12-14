import './App.css';
import './task.css';
import './nav.css';
import './weather.css';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import Hours from './HourComponent';
import Info from './InfoComponent';
import Task from './TaskComponent';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';

const weatherAPIKEY = '0516b4bbd3f44f15922162639221412';

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
              <Link to='/hours'>Hours</Link>
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
                </div>
              </div>
            }
          ></Route>
          <Route path='tasks/*' element={<Task />} />
          <Route path='hours/*' element={<Hours />} />
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
  const [q, setQ] = useState('Shanghai');

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
    axios
      .get('https://api.weatherapi.com/v1/current.json', {
        params: { key: weatherAPIKEY, q: q },
      })
      .then((response) => {
        setWeather(response.data.current);
        setLocationInAPI(response.data.location.name.toString());
        setWeatherIcon(response.data.current.condition.icon);
        setWeatherStatus(response.data.current.condition.text);
      });
  }, [q]);

  return (
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
  );
}

export default App;
