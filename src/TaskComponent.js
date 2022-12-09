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
      timers: [],
    };
    this.popuphandler = this.popuphandler.bind(this);
    this.customSorting = this.customSorting.bind(this);
    this.tracktimers = this.tracktimers.bind(this);
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

  // BOOLEANS: True = up, False = down.
  customSorting(upDownBool, mapindex, topBottomBool) {
    // I'm ridiculously proud of this even if it's just basic arrays

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

      let len = this.state.todos.length - 1;

      //With the previous implementation we just switched 2 items. We actually want to... loop the change between neighbouring item
      //=> the last and first items don't get switched, but only the item we want to change position changes position.

      //WHY AM I SO GOOD AT CODING???
      let loops = topBottomBool ? (upDownBool ? mapindex : len - mapindex) : 1;
      //Destructuring assignment. Couldn't get a trenary operator to work for this
      //Loops are for setting a task straight to the top or bottom.
      if (upDownBool) {
        for (let index = 0; index < loops; index++) {
          //Move current task up
          [newOrder[mapindex - index], newOrder[mapindex - 1 - index]] = [
            newOrder[mapindex - 1 - index],
            newOrder[mapindex - index],
          ];
        }
      } else {
        for (let index = 0; index < loops; index++) {
          //Move current task down
          [newOrder[mapindex + index], newOrder[mapindex + 1 + index]] = [
            newOrder[mapindex + 1 + index],
            newOrder[mapindex + index],
          ];
        }
      }

      this.setState({
        todos: newOrder,
      });
    }
  }

  popuphandler() {
    this.setState({ popup: !this.state.popup });
  }

  //Track timers above, so that idk what im even trying to do...
  tracktimers(time, taskid) {
    //Can't just push, gotta do edit the value but sure.
    //If there is already that id being tracked, update the value. If there isn't this id being tracked, push the new key value pair to the state.
    //If it's undefined, guard that clause

    /*  console.log(this.state.timers.length); */
    let updated = this.state.timers;
    let isTracked = false;
    //Guard that clause my man
    if ((time || taskid) === undefined) {
      return;
    }
    if (this.state.timers.length === 0) {
      console.log("len is 0");
      updated.push({ id: 0, time: 0 });
    } else {
      updated.map((task) => {
        if (task.id === taskid) {
          console.log(true);
          //Update the time
          task.time = time;
          isTracked = true;
          console.log(
            "maps for task",
            task,
            "has a time of, ",
            time,
            " but the time for this task is: ",
            task.time,
            "and the taskid is:",
            taskid
          );
        }
      });
      //After map, check if the id was being tracked. If not, then add it to the array of tracked timers.
      if (!isTracked) {
        updated.push({ id: taskid, time: time });
      }
    }
    /* 
    console.log(`Tracktimers called with values: ${time} and id of ${taskid}`); */
    /*  */

    this.setState({ timers: updated });
    console.log("timers in parent: ", this.state.timers, "updated,", updated);
  }

  render() {
    //Acts as a guard clause
    if (!this.state.todos.length) return <h1>loading posts...</h1>;

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
          key={i + "button"}
          className="editTask"
          onClick={() => {
            this.setState({ popup: true, popupId: item.id });
            /* console.log("popup in component", this.state.popup); */
          }}
        >
          <span className="material-symbols-outlined">edit</span>
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
        {
          <Timer
            taskid={item.id}
            i={i}
            tracktimers={this.tracktimers}
            //Store the timers in the parent element so that when the Timer component
            //'refreshes' the timer data doesn't have to be pushed and read, but can just handle with a state store in parent
            parenttimers={this.state.timers}
          ></Timer>
        }
        <h1 key={i + "h1"} className="taskHeader">
          task {item.id}
        </h1>
        <h2 key={i + "daysleft"}>Days left: {item.timeleft}</h2>
        <p key={i + "deadline"}>Deadline: {item.deadline}</p>
        <p key={i + "p"}>{item.description}</p>
        <p key={i + "hours"}>Hours spent: {item.hoursSpent}</p>

        <div className="updownDropdown">
          <span class="material-symbols-outlined">menu</span>
          <div className="updownContent">
            <button
              onClick={() => {
                this.customSorting(true, i, true);
              }}
            >
              <span class="material-symbols-outlined">
                keyboard_double_arrow_up
              </span>
            </button>
            <button
              onClick={() => {
                this.customSorting(true, i, false);
              }}
            >
              <span class="material-symbols-outlined">arrow_upward</span>
            </button>
            <button
              onClick={() => {
                this.customSorting(false, i, false);
              }}
            >
              <span class="material-symbols-outlined">arrow_downward</span>
            </button>
            <button
              onClick={() => {
                this.customSorting(false, i, true);
              }}
            >
              <span class="material-symbols-outlined">
                keyboard_double_arrow_down
              </span>
            </button>
          </div>
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
