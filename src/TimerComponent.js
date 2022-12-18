/* eslint-disable react-hooks/exhaustive-deps */
import './TimerComponent.css';
import React, { useState } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3010/timers',
});

function Timer(props) {
  const [taskid, setTaskid] = useState(props.taskid);
  const [fetchorlocal, setFetchorlocal] = useState(props.fetchOrLocalstorage);

  /* First when we open the tasks, continue active tasks? */
  const [firstRender, setFirstRender] = useState(true);
  const [startNewTimer, setStartNewTimer] = useState(true);
  const [active, setActive] = useState(false);
  const [time, settime] = useState(0);
  const [startdate, setStartdate] = useState(0);

  const [visible, setVisible] = useState(false);

  const fetch = async (activetaskfound) => {
    const timersFromLocal = await JSON.parse(
      window.localStorage.getItem('timers')
    );
    if (timersFromLocal) {
      timersFromLocal.forEach((timerFromStorage) => {
        if (timerFromStorage.id === taskid) {
          if (timerFromStorage.time !== 0) {
            setActive(timerFromStorage.active);
            settime(timerFromStorage.time);
            setStartdate(timerFromStorage.startdate);
            setStartNewTimer(timerFromStorage.newtimer);
            setFirstRender(false);
            activetaskfound = true;
          }
        }
      });
    }
    if (!activetaskfound) {
      await api
        .get('/')
        .then((response) => {
          let allTimers = response.data;
          allTimers.forEach((timer) => {
            if (timer.taskid === props.taskid && timer.completed === false) {
              settime(timer.time);
              setStartdate(timer.startdate);
              handleStartPause();
              setStartNewTimer(false);

              activetaskfound = true;
            }
          });

          //If the task was not active in the database, then check is localstorage has them

          setFirstRender(false);
        })
        .then(() => {
          if (activetaskfound === false) {
            settime(20);
            setStartNewTimer(true);
            setActive(false);
          }
        });
    }
  };
  //Initialize the timer values per task depending on database values etc.
  React.useEffect(() => {
    setFetchorlocal(props.fetchOrLocalstorage);
    //Also handle prop changed (usually resulting from rearranging the tasks)
    setTaskid(props.taskid);
    let activetaskfound = false;
    if (firstRender) {
      if (props.fetchOrLocalstorage === 'fetch') {
        fetch(activetaskfound);
      }
    }
  }, [props.fetchOrLocalstorage, fetchorlocal]);

  React.useEffect(() => {
    setTaskid(props.taskid);
    //True, since we've..yeah.
    let activetaskfound = false;
    fetch(activetaskfound);
  }, [props.taskid, taskid]);

  React.useEffect(() => {
    /* console.log("timercomponent: ", time); */
    props.tracktimers(time, props.taskid, active, startNewTimer, startdate);
  }, [time]);

  React.useEffect(() => {
    let timeInterval = null;

    //If the timer for said task is not active, nor paused, then calc time
    if (active) {
      timeInterval = setInterval(
        () => {
          settime((time) => time + 1000);
        },
        //100, since we calculate seconds
        1000
      );
    } else {
      //If the task is not active, or on pause, then clear the interval
      clearInterval(timeInterval);
    }
    return () => {
      clearInterval(timeInterval);
    };
  }, [active]);

  const handleStartPause = async () => {
    //Fetch. It'll stop at the localstorage spot most likely, just to update the startnewtimer

    if (!active) {
      if (startNewTimer && !firstRender) {
        console.log('date now: ', Date.now());
        const newtimer = {
          taskid,
          active: true,
          time,
          startdate: Date.now(),
          enddate: null,
          completed: false,
        };
        setStartdate(Date.now());
        await api.post('/', newtimer).then(() => {
          setStartNewTimer(false);
        });
      }
      setActive(true);
    } else {
      await setActive(false);
      await props.tracktimers(time, props.taskid, false, startNewTimer);
    }
  };

  //TODO: send the data to the server when stopping
  //TIMER COMPONENT SENDS DATA TO DB.JSON, WHEREAS TASKCOMPONENT STORES THE STATE TO LOCALSTORAGE.
  const handleStop = async () => {
    setActive(false);
    let timerID = null;
    //GET timers to get the ID for the active timer so we can put the new 'state' to the db

    await api.get('/').then((response) => {
      let allTimers = response.data;

      allTimers.forEach((timer) => {
        if (timer.taskid === props.taskid && timer.completed === false) {
          timerID = timer.id;
        }
      });
    });

    const postTimer = {
      taskid: taskid,
      active: false,
      time: time,
      startdate: startdate,
      enddate: Date.now(),
      completed: true,
    };

    await api.put(`/${timerID}`, postTimer).then(function (response) {
      settime(0);
      setStartNewTimer(true);
    });
  };

  const handleVisibility = () => {
    setVisible(!visible);
  };
  const styling = {
    width: visible ? '90%' : '0%',
    opacity: visible ? '100%' : '0%',
    transition: 'opacity 0.5s linear,width 0.4s linear ',
  };

  return (
    <>
      <div className='stopwatch'>
        <button
          onClick={() => {
            handleVisibility();
          }}
        >
          <span
            className='material-symbols-outlined'
            style={{ color: active ? '#6e0000' : '' }}
          >
            timer
          </span>
        </button>
        <div className='stopwatch-all'>
          <span className='stopwatch-minutes' style={styling}>
            {'0' + Math.floor((time / (1000 * 60 * 60)) % 24)}:
          </span>
          <span className='stopwatch-minutes' style={styling}>
            {('0' + Math.floor((time / 60000) % 60)).slice(-2)}:
          </span>
          <span className='stopwatch-seconds' style={styling}>
            {('0' + Math.floor((time / 1000) % 60)).slice(-2)}
          </span>
          <div style={styling} className='timerButtons'>
            <button
              className='timerButton'
              onClick={() => {
                handleStartPause();
              }}
            >
              <span className='material-symbols-outlined'>play_pause</span>
            </button>

            <button
              className='timerButton'
              onClick={() => {
                handleStop();
              }}
            >
              <span className='material-symbols-outlined' style={styling}>
                stop
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Timer;
