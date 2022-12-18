import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './graph.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { Bar, getElementAtEvent } from 'react-chartjs-2';

//This hasn't been explained ANYWHERE in the chart.js documentation.
//All I know is that it needs to be there. wtf.
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
function Graph() {
  const chartRef = useRef();
  const [validGraphs, setValidGraphs] = useState({
    labels: [],
    datasets: [],
  });
  const [inputStartDate, setInputStartDate] = useState(
    new Date(Date.now() - 604800000).toISOString().split('T')[0]
  );
  const [inputEndDate, setInputEndDate] = useState(
    new Date(Date.now()).toISOString().split('T')[0]
  );
  const [startDate, setStartDate] = useState(Date.now() - 604800000);
  const [endDate, setEndDate] = useState(Date.now()); /*Date.now() */
  const [tasksShown, setTasksShown] = useState('all');
  const [rawData, setRawData] = useState({});
  const [indexToTaskID, setIndexToTaskID] = useState([]);
  const [useMinutes, setUseMinutes] = useState(true);
  const [totalTime, setTotalTime] = useState(0);

  useEffect(() => {
    let completedTimersTaskIDs = [];
    let fullTimers = [];
    const minutesOrHours = useMinutes ? 60000 : 3600000;
    axios
      .get('http://localhost:3010/timers/')
      .then((response) => {
        let data = response.data;

        //Check for each of the objects if the task is completed and if the start and end dates
        //Are within our guide limits.
        let letrawData = [];
        data.forEach((log) => {
          if (
            log.completed === true &&
            log.startdate >= startDate &&
            log.enddate <= endDate
          ) {
            /*  console.log('FULL LOG,', log); */
            letrawData.push(log);

            //Check if we want to show all tasks or just one task
            if (tasksShown === 'all') {
              //Check if the taskid is already being counted, if it is, then add to the total sum
              if (fullTimers.some((e) => e.taskid === log.taskid)) {
                let i = fullTimers.findIndex(
                  (timer) => timer.taskid === log.taskid
                );

                fullTimers[i] = {
                  taskid: fullTimers[i].taskid,
                  time: fullTimers[i].time + log.time,
                };
              } else {
                //If it isn't being counted, then add it to the array
                fullTimers.push({ taskid: log.taskid, time: log.time });
              }
            }

            //We are going to use the timerIDs which are logged to fetch the actual task labels from another endpoint
            if (!completedTimersTaskIDs.includes(log.taskid)) {
              completedTimersTaskIDs.push(log.taskid);
            }
          }
        });
        setRawData(letrawData);
        /* console.log(completedTimersTaskIDs); */
        /* console.log('FULL TIMERS: ', fullTimers); */
        setIndexToTaskID(fullTimers);
      })
      //After all of that is done, fetch the labels
      .then(async () => {
        let letLabels = [];
        let letdata = [];
        if (tasksShown === 'all') {
          await axios.get('http://localhost:3010/tasks/').then((response) => {
            let allTasks = response.data;

            allTasks.forEach((element) => {
              if (completedTimersTaskIDs.includes(element.id)) {
                let i = fullTimers.findIndex(
                  (timer) => timer.taskid === element.id
                );

                fullTimers[i] = {
                  taskid: fullTimers[i].taskid,
                  time: fullTimers[i].time,
                  title: element.title,
                };
              }
            });
          });
          for (let index = 0; index < fullTimers.length; index++) {
            const element = fullTimers[index];

            letLabels.push(element.title);
            letdata.push(element.time / minutesOrHours);
          }
        } else {
          await axios
            .get(`http://localhost:3010/tasks/${tasksShown}`)
            .then(() => {
              rawData.forEach((element) => {
                //Check if the task id is the correct one
                if (element.taskid === tasksShown) {
                  //We want to get each DAY logged, so... check if the date is the same?

                  let enddate = new Date(element.enddate);

                  let enddatedate = `${enddate.getFullYear()}-${
                    enddate.getMonth() + 1
                  }-${enddate.getDate()}`;
                  console.log(enddatedate);

                  if (!fullTimers.some((e) => e.day === enddatedate)) {
                    if (
                      element.startdate >= startDate &&
                      element.enddate <= endDate
                    ) {
                      letLabels.push(enddatedate);
                      letdata.push(element.time / minutesOrHours);
                      fullTimers.push({ day: enddatedate, time: element.time });
                    }
                  }
                }
              });
            });
        }
        let sum = 0;
        await letdata.forEach((log) => {
          console.log(typeof log);
          sum += log;
        });
        await setTotalTime(sum.toFixed(2));
        await setValidGraphs({
          labels: letLabels,
          datasets: [
            {
              label: `Logged${useMinutes ? ' minutes' : ' hours'}`,
              data: letdata,
              backgroundColor: `rgba(${0 + Math.random() * (255 - 0)}, ${
                0 + Math.random() * (255 - 0)
              }, ${0 + Math.random() * (255 - 0)}, 1)`,
            },
          ],
        });
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, tasksShown, useMinutes]);

  //Get element on click for further investigation :)
  const onClick = async (e) => {
    let onclickindex = await getElementAtEvent(chartRef.current, e)[0].index;

    await setTasksShown(indexToTaskID[onclickindex].taskid);
  };

  const toggleHours = (e) => {
    setUseMinutes(!useMinutes);
  };

  return (
    <div className='graphComponent'>
      <form>
        <div className='inputStart'>
          <label>Set Starting Date</label>
          <input
            type={'date'}
            required
            value={inputStartDate}
            onChange={(eventObject) => {
              setInputStartDate(
                new Date(eventObject.target.value).toISOString().split('T')[0]
              );
              var result = new Date(eventObject.target.value);

              result.setDate(result.getDate() + 7);

              //automatically set the enddate to +7 days
              /* setInputEndDate(eventObject.target.value + 7); */
              setStartDate(Date.parse(eventObject.target.value));
            }}
          ></input>
        </div>
        <br></br>
        <div className='inputEnd'>
          <label>Set End Date</label>
          <input
            type={'date'}
            required
            value={inputEndDate}
            min={inputStartDate}
            onChange={(eventObject) => {
              setInputEndDate(
                new Date(eventObject.target.value).toISOString().split('T')[0]
              );
              setEndDate(Date.parse(eventObject.target.value));
            }}
          ></input>
        </div>
      </form>
      <div className='toggleHours'>
        <button
          onClick={() => {
            toggleHours();
          }}
        >
          <label>Hours/Minutes</label>

          {useMinutes ? (
            <span class='material-symbols-outlined'>toggle_on</span>
          ) : (
            <span class='material-symbols-outlined'>toggle_off</span>
          )}
        </button>
      </div>
      <div
        className='backArrow'
        style={{ display: tasksShown === 'all' ? 'none' : 'block' }}
      >
        <button
          onClick={() => {
            setTasksShown('all');
          }}
        >
          <span class='material-symbols-outlined'>arrow_back</span>
        </button>
      </div>
      <br></br>
      <div className='graph'>
        <Bar data={validGraphs} ref={chartRef} onClick={onClick}></Bar>
      </div>
      <h2 style={{ textAlign: 'center' }}>
        Total {useMinutes ? 'minutes' : 'hours'} for time period: {totalTime}
      </h2>
    </div>
  );
}

export default Graph;
