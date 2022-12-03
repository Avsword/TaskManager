import React from "react";
import axios from "axios";
import { flipCompleted, deleteTask } from "./taskButtons";
const api = axios.create({
  baseURL: "http://localhost:3010/tasks",
});

class completed extends React.Component {
  constructor(props) {
    super();
    this.state = {
      completed: [],
      timeLeft: 0,
      currentCategory: props.currentCat,
    };
  }

  componentDidMount() {
    this.getComponents();
  }
  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.currentCat !== prevProps.currentCat) {
      /* console.log("prop was updated to", this.props.currentCat); */
      this.setState({ currentCategory: this.props.currentCat });
      this.getComponents();
    }
  }
  getComponents = () => {
    api.call("/").then((response) => {
      //List full of all the tasks
      let list = response.data;
      //Filter out the tasks to the tasks, which are yet to be completed
      let completedlist = [];
      //completed: Convert deadline to time left:
      list.forEach((element) => {
        //Check if task has been completed
        if (element.completed) {
          //Check if we are sorting by any category and then push the correct task to the array
          if (
            element.category === this.state.currentCategory ||
            this.state.currentCategory === "all"
          ) {
            completedlist.push(element);
          }
          /* completedlist.push(element); */
        }
      });

      this.setState({
        completed: completedlist,
      });
    });
  };
  render() {
    if (!this.state.completed.length) return <h1>loading posts...</h1>;

    let completedsmap = this.state.completed.map((item, i) => (
      <div key={i + "wrapper"} className="completed">
        <button
          className="completeTask"
          onClick={() => {
            flipCompleted(item.id, item.completed);
          }}
        >
          <span className="material-symbols-outlined">undo</span>
        </button>
        <button
          className="deleteTask"
          onClick={() => {
            deleteTask(item.id);
          }}
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        <br></br>
        <h1 key={i + "h1"}>{item.title}</h1>{" "}
        <p key={i + "p"}>{item.description}</p>
        <p key={i + "hours"}>Hours spent: {item.hoursSpent}</p>
      </div>
    ));

    return <div className="allCompleted">{completedsmap}</div>;
  }
}
export default completed;
