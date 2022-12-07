import { Link, Route, Routes } from "react-router-dom";
import axios from "axios";
import React, { useState } from "react";
import Completed from "./competedTasks";
import NewTask from "./newTask";
import "./category.css";
import { flipCompleted, deleteTask } from "./taskButtons";
import EditPopup from "./EditPopup";
import Categories from "./Categories";
import Timer from "./TimerComponent";

const api = axios.create({
  baseURL: "http://localhost:3010/tasks",
});

function Task() {
  const [currCat, setcurrCat] = useState("all");
  const handleCategoryChange = (category) => {
    /*  console.log("handler in taskComponent got a category: ", category); */
    setcurrCat(category);
  };
  const [catPopup, setCatPopup] = useState(false);

  const flipPopup = () => {
    setCatPopup(!catPopup);
  };
  return (
    <>
      <nav>
        <ul className="nav-list">
          <div className="nav-item-wrapper">
            <li className="nav-item">
              <Link to="todo">TODO</Link>
            </li>
            <li className="nav-item">
              <Link to="completed">Completed</Link>
            </li>
            <li className="nav-item">
              <Link to="newtask">New task</Link>
            </li>
            <li className="nav-item">
              <button
                className="catPopup"
                onClick={() => {
                  flipPopup();
                }}
              >
                <span>Categories</span>
              </button>
            </li>
          </div>
          <Categories
            popup={catPopup}
            handler={handleCategoryChange}
            currentCat={currCat}
          ></Categories>
        </ul>
      </nav>
      <Routes>
        <Route path="*" element={<Todo currentCat={currCat} />} />

        <Route path="/completed" element={<Completed currentCat={currCat} />} />

        <Route path="/newtask" element={<NewTask />} />
      </Routes>
    </>
  );
}

class Todo extends React.Component {
  constructor(props) {
    super();
    this.state = {
      todos: [],
      popup: false,
      popupId: 1,
      catPopup: false,
      currentCategory: props.currentCat,
    };
    this.popuphandler = this.popuphandler.bind(this);
    this.customSorting = this.customSorting.bind(this);
  }

  getComponents = () => {
    let newDate = new Date();
    api.call("/").then((response) => {
      //List full of all the tasks
      let list = response.data;
      /* console.log(list); */
      //Filter out the tasks to the tasks, which are yet to be completed
      let todolist = [];

      list.forEach((element) => {
        if (!element.completed) {
          let deadlineDate = new Date(element.deadline);

          //Floor, since we want to get how many full days we have left. the big number is converting milliseconds to days, since the diff between dates gives the diff in ms
          element.timeleft = Math.floor((deadlineDate - newDate) / 86400000);

          /* console.log(
            `Element curr cat is: ${element.category} and the state cat is ${this.state.currentCategory}`
          ); */
          if (
            element.category === this.state.currentCategory ||
            this.state.currentCategory === "all"
          ) {
            todolist.push(element);
          }
        }
      });
      //Sort the todolist by time left
      todolist.sort((a, b) => a.timeleft - b.timeleft);

      //TODO: Custom sorting

      this.setState({
        todos: todolist,
      });
    });
  };

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

  // if upDownBool is true, make the item go one up in the array.
  customSorting(upDownBool, mapindex) {
    console.log(this.state.todos.length);
    console.log("i", mapindex);

    //Check for edge cases (can't move up if it's already the first item in the array)
    if (
      (mapindex === 0 && upDownBool === true) ||
      (mapindex === this.state.todos.length - 1 && upDownBool === false)
    ) {
      console.log("Edge case detected!");
    } else {
      console.log("todos: ", this.state.todos);
      //Initalize the new order here just so it's easier for me to understand what I'm coding.
      let newOrder = this.state.todos;
      //Destructuring assignment. Couldn't get a trenary operator to work for this
      if (upDownBool) {
        [newOrder[mapindex], newOrder[mapindex - 1]] = [
          newOrder[mapindex - 1],
          newOrder[mapindex],
        ];
      } else {
        [newOrder[mapindex], newOrder[mapindex + 1]] = [
          newOrder[mapindex + 1],
          newOrder[mapindex],
        ];
      }

      this.setState({
        todos: newOrder,
      });
    }
  }

  popuphandler() {
    this.setState({ popup: !this.state.popup });
  }
  render() {
    //Acts as a guard clause
    if (!this.state.todos.length) return <h1>loading posts...</h1>;

    /* console.log(stateTodos); */
    //Tasks to "component" Inline styling to warn the user about past-due tasks
    let todosmap = this.state.todos.map((item, i) => (
      <div
        key={i + "wrapper"}
        className="task"
        style={{
          border: item.timeleft < 0 ? "2px solid red" : "none",
        }}
      >
        <button
          className="completeTask"
          onClick={() => {
            flipCompleted(item.id, item.completed);
          }}
        >
          <span className="material-symbols-outlined">done</span>
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
        <Timer></Timer>
        <h1 key={i + "h1"} className="taskHeader">
          {item.title}
        </h1>
        <h2 key={i + "daysleft"}>Days left: {item.timeleft}</h2>
        <p key={i + "deadline"}>Deadline: {item.deadline}</p>
        <p key={i + "p"}>{item.description}</p>
        <p key={i + "hours"}>Hours spent: {item.hoursSpent}</p>

        <button
          key={i + "button"}
          className="editTask"
          onClick={() => {
            this.setState({ popup: true, popupId: item.id });
            /* console.log("popup in component", this.state.popup); */
          }}
        >
          <span className="material-symbols-outlined">edit</span>
        </button>
        <div className="updownArrows">
          <button
            onClick={() => {
              this.customSorting(true, i);
            }}
          >
            <span class="material-symbols-outlined">arrow_upward</span>
          </button>
          <button
            onClick={() => {
              this.customSorting(false, i);
            }}
          >
            <span class="material-symbols-outlined">arrow_downward</span>
          </button>
        </div>
      </div>
    ));

    return (
      <>
        <div className="allTasks">{todosmap}</div>
        <EditPopup
          popup={this.state.popup}
          id={this.state.popupId}
          popuphandler={this.popuphandler}
        ></EditPopup>
      </>
    );
  }
}

export default Task;
