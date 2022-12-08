import "./TimerComponent.css";
import React, { useState } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3010/timers",
});

function Timer(props) {
  const taskid = props.taskid;
  let firstStart;

  const [active, setActive] = useState(false);
  const [paused, setPaused] = useState(false);
  const [time, settime] = useState(0);
  const [startdate, setstartdate] = useState(0);

  /**
 * "taskid": 1,
      "active": true,
      "timeInSeconds": 0,
      "startedDate": 0
 */

  //Initialize the timer values per task depending on database values etc.
  React.useEffect(() => {
    api.get("/").then((response) => {
      let allTimers = response.data;
      allTimers.forEach((timer) => {
        if (timer.taskid === taskid && timer.active === true) {
          console.log("Timer is active for task, ", taskid);
          firstStart = false;
          settime(timer.timeInMilliseconds);
          handleStart();
        }
      });
    });
  }, []);

  React.useEffect(() => {
    let timeInterval = null;

    //If the timer for said task is not active, nor paused, then calc time
    if (active && paused === false) {
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
  }, [active, paused]);

  const handleStart = () => {
    if (firstStart) {
      setstartdate(Date.now());
    }
    setActive(true);
  };
  const handlePause = () => {
    setPaused(!paused);
  };

  //TODO: send the data to the server when stopping
  const handleStop = () => {
    setActive(false);
  };

  return (
    <>
      <div className="stopwatch">
        <span className="stopwatch-minutes">
          {"0" + Math.floor((time / (1000 * 60 * 60)) % 24)}:
        </span>
        <span className="stopwatch-minutes">
          {("0" + Math.floor((time / 60000) % 60)).slice(-2)}:
        </span>
        <span className="stopwatch-seconds">
          {("0" + Math.floor((time / 1000) % 60)).slice(-2)}
        </span>

        <button
          onClick={() => {
            handleStart();
          }}
        >
          <span className="material-symbols-outlined">play_arrow</span>
        </button>
        <button
          onClick={() => {
            handlePause();
          }}
        >
          <span className="material-symbols-outlined">play_pause</span>
        </button>
        <button
          onClick={() => {
            handleStop();
          }}
        >
          <span className="material-symbols-outlined">stop</span>
        </button>
      </div>
    </>
  );
}

export default Timer;
