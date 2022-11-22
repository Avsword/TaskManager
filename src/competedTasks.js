import React from "react";
import axios from "axios";
const api = axios.create({
  baseURL: "http://localhost:3500/tasks",
});

class completed extends React.Component {
  constructor() {
    super();
    this.state = {
      completed: [],
      timeLeft: 0,
    };
  }

  componentDidMount() {
    let newDate = new Date();
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();

    console.log("current date: ", date, month, year);
    /* const id = GetParams();
      console.log(id); */
    api.call("/").then((response) => {
      //List full of all the tasks
      let list = response.data;
      //Filter out the tasks to the tasks, which are yet to be completed
      let completedlist = [];
      //completed: Convert deadline to time left:
      list.forEach((element) => {
        if (element.completed) {
          completedlist.push(element);
        }
      });

      this.setState({
        completed: completedlist,
      });
    });
  }

  render() {
    if (!this.state.completed.length) return <h1>loading posts...</h1>;

    let completedsmap = this.state.completed.map((item, i) => (
      <div key={i + "wrapper"} className="completed">
        <span class="material-symbols-outlined">done</span>
        <h1 key={i + "h1"}>{item.title}</h1>{" "}
        <h2 key={i + "daysleft"}>Days left: {item.timeleft}</h2>
        <p key={i + "deadline"}>Deadline: {item.deadline}</p>
        <p key={i + "p"}>{item.description}</p>
        <p key={i + "hours"}>Hours spent: {item.hoursSpent}</p>
      </div>
    ));

    return <div className="allCompleted">{completedsmap}</div>;
  }
}
export default completed;
