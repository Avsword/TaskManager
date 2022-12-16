import { useState, useEffect } from 'react';
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

import { Bar } from 'react-chartjs-2';

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
  const [endDate, setEndDate] = useState(Date.now());

  useEffect(() => {
    let completedTimersTaskIDs = [];
    let fullTimers = [];
    axios
      .get('http://localhost:3010/timers/')
      .then((response) => {
        let data = response.data;

        //Check for each of the objects if the task is completed and if the start and end dates
        //Are within our guide limits.
        data.forEach((log) => {
          if (
            log.completed === true &&
            log.startdate >= startDate &&
            log.enddate <= endDate
          ) {
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
            //We are going to use the timerIDs which are logged to fetch the actual task labels from another endpoint
            if (!completedTimersTaskIDs.includes(log.taskid)) {
              completedTimersTaskIDs.push(log.taskid);
            }
          }
        });
        /* console.log(completedTimersTaskIDs);
        console.log('FULL TIMERS: ', fullTimers); */
      })
      //After all of that is done, fetch the labels
      .then(async () => {
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
        console.log('Fulltimers with labels: ', fullTimers);
        let letLabels = [];
        let letdata = [];
        for (let index = 0; index < fullTimers.length; index++) {
          const element = fullTimers[index];
          console.log('Timer element: ', element);
          letLabels.push(element.title);
          letdata.push(element.time / 60000);
        }

        await console.log('labels: ', letLabels);
        await console.log('data: ', letdata);
        await setValidGraphs({
          labels: letLabels,
          datasets: [
            {
              label: 'Logged minutes',
              data: letdata,
              backgroundColor: `rgba(${0 + Math.random() * (255 - 0)}, ${
                0 + Math.random() * (255 - 0)
              }, ${0 + Math.random() * (255 - 0)}, 1)`,
            },
          ],
        });

        await console.log('Valid Graphs: CONFIG: ', validGraphs);
      });
  }, [startDate, endDate]);

  return (
    <div className='graphComponent'>
      <form>
        <label>Set Starting Date</label>
        <input
          type={'date'}
          required
          value={inputStartDate}
          onChange={(eventObject) => {
            setInputStartDate(eventObject.target.value);
            var result = new Date(eventObject.target.value);
            console.log('afwafwagwagg', result);
            result.setDate(result.getDate() + 7);
            console.log('afwafwagwagg', result);
            //automatically set the enddate to +7 days
            setInputEndDate(eventObject.target.value + 7);
            setStartDate(Date.parse(eventObject.target.value));
          }}
        ></input>
        <br></br>
        <label>Set End Date</label>
        <input
          type={'date'}
          required
          value={inputEndDate}
          min={inputStartDate}
          onChange={(eventObject) => {
            setInputEndDate(eventObject.target.value);
            setEndDate(Date.parse(eventObject.target.value));
          }}
        ></input>
      </form>
      <br></br>
      <div className='graph'>
        <Bar data={validGraphs}></Bar>
      </div>
    </div>
  );
}

export default Graph;
