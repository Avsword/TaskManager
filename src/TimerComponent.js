import "./TimerComponent.css";
import React, { useState } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3010/timers",
});

function Timer(props) {
  const [taskid, setTaskid] = useState(props.taskid);

  /* First when we open the tasks, continue active tasks? */
  const [firstRender, setFirstRender] = useState(true);
  const [startNewTimer, setStartNewTimer] = useState(false);
  /* tracktimers(time, taskid) */

  const [active, setActive] = useState(false);

  const [time, settime] = useState(0);

  /**
 * "taskid": 1,
      "active": true,
      "timeInSeconds": 0,
      "startedDate": 0
 */

  //Initialize the timer values per task depending on database values etc.
  React.useEffect(() => {
    //Also handle prop changed (usually resulting from rearranging the tasks)
    setTaskid(props.taskid);
    let activetaskfound = false;
    if (firstRender) {
      api.get("/").then((response) => {
        let allTimers = response.data;
        allTimers.forEach((timer) => {
          if (timer.taskid === props.taskid && timer.active === true) {
            console.log(
              `WAS MET met at ${props.taskid}, because timer task id was ${timer.taskid} and active stat was ${timer.active}`
            );

            settime(timer.time);
            setStartNewTimer(false);
            handleStartPause();
            activetaskfound = true;
          }
        });
        //If the task was not active in the database, then set the startNewTimer to true for
        //  ex. setting the  to the task etc.
        if (activetaskfound === false) {
          settime(0);
          setStartNewTimer(true);
          setActive(false);
        }
        setFirstRender(false);
      });
    }

    console.log(
      "||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||"
    );
  }, []);

  React.useEffect(() => {
    setTaskid(props.taskid);
    console.log(
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
    });
  }, [props.taskid, taskid]);

  React.useEffect(() => {
    /* console.log("timercomponent: ", time); */
    props.tracktimers(time, props.taskid, active, startNewTimer);
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
    if (!active) {
      if (startNewTimer) {
        console.log("date now: ", Date.now());
        const newtimer = {
          taskid,
          active: true,
          time,
          startdate: Date.now(),
        };
        await api.post("/", newtimer).then(() => {
          alert("New task was posted to the db");
          setStartNewTimer(false);
        });
      }
      setActive(true);
    } else {
      setActive(false);
    }
  };

  //TODO: send the data to the server when stopping
  const handleStop = () => {
    setActive(false);

    /* api.post("/", addTask).then(function (response) {
      alert("Data sent to server");
      settime(0);
    }); */
  };

  return (
    <>
      <div className="stopwatch">
        <h1>
          timer {taskid}, props {props.taskid} start {} newtimer
          {startNewTimer.toString()}
        </h1>
        <span className="stopwatch-minutes">
          {"0" + Math.floor((time / (1000 * 60 * 60)) % 24)}:
        </span>
        <span className="stopwatch-minutes">
          {("0" + Math.floor((time / 60000) % 60)).slice(-2)}:
        </span>
        <span className="stopwatch-seconds">
          {("0" + Math.floor((time / 1000) % 60)).slice(-2)}
        </span>
        <br></br>
        <span>{time}</span>

        <button
          onClick={() => {
            handleStartPause();
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
