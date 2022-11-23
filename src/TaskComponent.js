import { Link, Route, Routes } from "react-router-dom";
import axios from "axios";
import React from "react";
import Completed from "./competedTasks";

const api = axios.create({
  baseURL: "http://localhost:3010/tasks",
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
//TODO: Sort elements by their timeleft element.
class Todo extends React.Component {
  constructor() {
    super();
    this.state = {
      todos: [],
    };
  }

  componentDidMount() {
    let newDate = new Date();
    api.call("/").then((response) => {
      //List full of all the tasks
      let list = response.data;
      //Filter out the tasks to the tasks, which are yet to be completed
      let todolist = [];
      //TODO: Push new timeleft to the actual server.
      list.forEach((element) => {
        if (!element.completed) {
          let deadlineDate = new Date(element.deadline);

          //Floor, since we want to get how many full days we have left. the big number is converting milliseconds to days, since the diff between dates gives the diff in ms
          element.timeleft = Math.floor((deadlineDate - newDate) / 86400000);

          todolist.push(element);
        }
      });
      //Sort the todolist by time left
      todolist.sort((a, b) => a.timeleft - b.timeleft);

      this.setState({
        todos: todolist,
      });
    });
  }

  render() {
    //Acts as a guard clause
    if (!this.state.todos.length) return <h1>loading posts...</h1>;

    //I very much like map.
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
