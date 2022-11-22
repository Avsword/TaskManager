import {
  Link,
  resolvePath,
  Route,
  Routes,
  useParams,
  useLocation,
  withRouter,
} from "react-router-dom";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Completed from "./competedTasks";

const api = axios.create({
  baseURL: "http://localhost:3500/tasks",
});

function Task() {
  return (
    <>
      <nav>
        <ul className="nav-list">
          <li className="nav-item">
            <Link to="todo">TODO</Link>
          </li>
          <li className="nav-item">
            <Link to="completed">Completed</Link>
          </li>
          <li className="nav-item">
            <Link to="newtask">New task</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="*" element={<Todo />} />

        <Route path="/completed" element={<Completed />} />

        <Route path="/newtask" element={<Newtask />} />
      </Routes>
    </>
  );
}
class Todo extends React.Component {
  constructor() {
    super();
    this.state = {
      todos: [],
      timeLeft: 0,
    };
  }

  componentDidMount() {
    //TODO: Implement days left, taskLeft state in elements.
    let newDate = new Date();
    let currdate = newDate.getDate();
    let currmonth = newDate.getMonth() + 1;
    let curryear = newDate.getFullYear();

    api.call("/").then((response) => {
      //List full of all the tasks
      let list = response.data;
      //Filter out the tasks to the tasks, which are yet to be completed
      let todolist = [];
      //TODO: Convert deadline to time left:
      list.forEach((element) => {
        if (!element.completed) {
          let deadlineDate = new Date(element.deadline);

          //Can do the calculation here, ok ok pog.
          //Calculate the difference of years and months in to days, since we want a "days left"-tab.
          let years = (deadlineDate.getFullYear() - curryear) * 365;
          let month = (deadlineDate.getMonth() + 1 - currmonth) * 30;
          let date = deadlineDate.getDate() - currdate;

          element.timeleft = years + month + date;

          todolist.push(element);
        }
      });

      this.setState({
        todos: todolist,
      });
    });
  }

  render() {
    if (!this.state.todos.length) return <h1>loading posts...</h1>;

    let todosmap = this.state.todos.map((item, i) => (
      <div key={i + "wrapper"} className="task">
        <h1 key={i + "h1"}>{item.title}</h1>{" "}
        <h2 key={i + "daysleft"}>Days left: {item.timeleft}</h2>
        <p key={i + "deadline"}>Deadline: {item.deadline}</p>
        <p key={i + "p"}>{item.description}</p>
        <p key={i + "hours"}>Hours spent: {item.hoursSpent}</p>
      </div>
    ));

    return <div className="allTasks">{todosmap}</div>;
  }
}

function Newtask() {
  return (
    <>
      <h1>Adding new tasks will soon be implemented</h1>
    </>
  );
}

export default Task;
