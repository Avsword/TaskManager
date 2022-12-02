import React, { useEffect, useState } from "react";
import "./EditPopup.css";
import "./newTask.css";
import axios from "axios";
const api = axios.create({
  baseURL: "http://localhost:3010/tasks",
});

//TODO: Should be able to just... use the newtask component with little to no editing to get this to work. Otherwise this works like a dream rn

function EditPopup(props) {
  const id = props.id;
  //Add responsivity for adding a new task with some feedback on the status. (If the server is really slow, we could need this)
  const [pendingrequest, setPendingrequest] = useState(false);

  //States for each input field for submitting to the db
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  //Could use current date as default deadline, but I don't currently see the need for that.
  const [deadline, setDeadline] = useState("");
  const [hoursSpent, sethoursSpent] = useState("");
  const [category, setCategory] = useState("general");

  const [allcategories, setallcategories] = useState("");

  //We need a new state for fetching all of the categories for the dropdown.

  //Default values for different variables within each task. Id will be automatically updated by axios I think
  //timeleft will be handled later?
  const timeleft = 0;
  const completed = false;

  useEffect(() => {
    //Get the right object with the id, so we can use the values as defaults
    api.get(`/${id}`).then((response) => {
      setTitle(response.data.title);
      setDescription(response.data.description);
      setDeadline(response.data.deadline);
      setCategory(response.data.category);
      sethoursSpent(response.data.hoursSpent);
    });
    //Then set ALL of the available categories in order for the dropdown to work
    api.get("http://localhost:3010/categories").then((response) => {
      setallcategories(response.data);
    });
  }, [id]);

  //Responsive, add some kind of feedback
  const handleTaskSubmit = (eventObject) => {
    //Do not refresh the site
    eventObject.preventDefault();
    //Also add the default values for timeleft, hoursSpent and completed
    const newTask = {
      title,
      description,
      deadline,
      timeleft,
      hoursSpent,
      category,
      completed,
    };

    setPendingrequest(true);

    //axios really helps with posting etc.
    api
      .put(`/${id}`, newTask)
      .then(function (response) {
        setPendingrequest(false);

        window.location.reload(false);
      })
      .catch(function (error) {
        console.log(error);
      });
    props.popuphandler();
  };
  return props.popup ? (
    <div className="EditPopup">
      <div className="EditPopup-inner">
        <button className="exitPopup" onClick={props.popuphandler}>
          <span className="material-symbols-outlined">close</span>
        </button>
        <form onSubmit={handleTaskSubmit}>
          <div className="newTaskInput">
            <label>Title: </label>
            <input
              type={"text"}
              required
              value={title}
              onChange={(eventObject) => {
                setTitle(eventObject.target.value);
              }}
            ></input>
          </div>

          <div className="newTaskInput">
            <label>Description: </label>
            <textarea
              required
              value={description}
              onChange={(eventObject) => {
                setDescription(eventObject.target.value);
              }}
            ></textarea>
          </div>

          <div className="newTaskInput">
            <label>Deadline: </label>
            <input
              type={"date"}
              required
              value={deadline}
              onChange={(eventObject) => {
                setDeadline(eventObject.target.value);
              }}
            ></input>
          </div>

          <div className="newTaskInput">
            <label>Task category: </label>
            <select
              required
              value={category}
              onChange={(eventObject) => {
                setCategory(eventObject.target.value);
              }}
            >
              {allcategories.map((category) => (
                <option key={category.id} value={category.categoryname}>
                  {category.categoryname}
                </option>
              ))}
            </select>
          </div>
          <div className="newTaskInput">
            <label>Hours Spent on Task: </label>
            <input
              type={"number"}
              required
              value={hoursSpent}
              onChange={(eventObject) => {
                sethoursSpent(eventObject.target.value);
              }}
            ></input>
          </div>
          <span className="newTaskSubmit">
            {!pendingrequest && <button>Update task</button>}
            {pendingrequest && (
              <span className="material-symbols-outlined">refresh</span>
            )}
          </span>
        </form>
      </div>
    </div>
  ) : (
    <></>
  );
}

export default EditPopup;
