import './TimerComponent.css';
import React, { useState } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3010/timers',
});

function Timer(props) {
  const [ID, setID] = useState(null);
  const [taskid, setTaskid] = useState(props.taskid);
  const [fetchorlocal, setFetchorlocal] = useState(props.fetchOrLocalstorage);

  /* First when we open the tasks, continue active tasks? */
  const [firstRender, setFirstRender] = useState(true);
  const [startNewTimer, setStartNewTimer] = useState(true);
  /* tracktimers(time, taskid) */

  const [active, setActive] = useState(false);

  const [time, settime] = useState(0);

  const [startdate, setStartdate] = useState(0);
  /**
 * "taskid": 1,
      "active": true,
      "timeInSeconds": 0,
      "startedDate": 0
 */

  const fetch = async (activetaskfound) => {
    /* console.log(
      "just... get the ref in timercomponent you dumbass?",
      JSON.parse(window.localStorage.getItem("timers"))
    ); */
    const timersFromLocal = await JSON.parse(
      window.localStorage.getItem('timers')
    );
    if (timersFromLocal) {
      timersFromLocal.forEach((timerFromStorage) => {
        if (timerFromStorage.id === taskid) {
          if (timerFromStorage.time !== 0) {
            console.log('localstorage for: ', taskid);
            setActive(timerFromStorage.active);
            settime(timerFromStorage.time);
            setStartdate(timerFromStorage.startdate);
            setStartNewTimer(timerFromStorage.newtimer);
            setFirstRender(false);
            activetaskfound = true;
            console.log('Timer was found in local storage.');
          }
        }
      });
    }
    if (!activetaskfound) {
      console.log('fetching for: ', taskid);
      await api
        .get('/')
        .then((response) => {
          let allTimers = response.data;
          allTimers.forEach((timer) => {
            if (timer.taskid === props.taskid && timer.completed === false) {
              console.log('aaaaaa');

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

    console.log(
      'IN THE TIMER COMPONENT, THE FETCH WAS, ',
      fetchorlocal,
      'FOR TASK ',
      taskid
    );

    if (firstRender) {
      if (props.fetchOrLocalstorage === 'fetch') {
        fetch(activetaskfound);
      }
    }

    console.log(
      '||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||'
    );
  }, [props.fetchOrLocalstorage, fetchorlocal]);

  React.useEffect(() => {
    setTaskid(props.taskid);
    //True, since we've..yeah.
    let activetaskfound = false;
    fetch(activetaskfound);
    /*  console.log(
      "Task change detected, parent timers at the time were",
      props.parenttimers,
      "for id of",
      taskid
    );
    props.parenttimers.forEach((timer) => {
      if (timer.id === taskid) {
        settime(timer.time);
        setActive(timer.active);
        setStartNewTimer(timer.newtimer);
      }
    }); */
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
      console.log('Start & render', startNewTimer, firstRender);
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
          alert('New task was posted to the db');
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
      console.log('ALL TIMERS: ', allTimers);
      console.log('Current taskid: PROPS, NORMAL ', props.taskid, ' ', ID);
      allTimers.forEach((timer) => {
        console.log(
          `timer taskid: ${timer.taskid} props taskid: ${props.taskid} and completed status is: ${timer.completed}`
        );
        if (timer.taskid === props.taskid && timer.completed === false) {
          console.log('TRUE FOR: ', timer);
          setID(timer.id);
          timerID = timer.id;
          console.log('ID IS NOW: ', ID);
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
    console.log('Before put call, id is: ', ID);
    console.log('Before put call, timer id let is: ', timerID);
    await api.put(`/${timerID}`, postTimer).then(function (response) {
      alert('Data sent to server');
      settime(0);
      setStartNewTimer(true);
    });
  };

  return (
    <>
      <div className='stopwatch'>
        <h1 style={{ color: active ? 'green' : 'red' }}>
          props {props.taskid} start {startdate} newtimer
          {startNewTimer.toString()}
        </h1>
        <span className='stopwatch-minutes'>
          {'0' + Math.floor((time / (1000 * 60 * 60)) % 24)}:
        </span>
        <span className='stopwatch-minutes'>
          {('0' + Math.floor((time / 60000) % 60)).slice(-2)}:
        </span>
        <span className='stopwatch-seconds'>
          {('0' + Math.floor((time / 1000) % 60)).slice(-2)}
        </span>
        <br></br>
        <span>{time}</span>

        <button
          onClick={() => {
            handleStartPause();
          }}
        >
          <span className='material-symbols-outlined'>play_pause</span>
        </button>

        <button
          onClick={() => {
            handleStop();
          }}
        >
          <span className='material-symbols-outlined'>stop</span>
        </button>
      </div>
    </>
  );
}

export default Timer;
