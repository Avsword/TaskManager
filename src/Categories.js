import axios from "axios";
import React, { useEffect, useState } from "react";
/* 
import "./category.css"; */
import "./categories.css";

const api = axios.create({
  baseURL: "http://localhost:3010/categories",
});

const Categories = (props) => {
  const handler = props.handler;
  /* console.log("Categories prop currcat: ", props.currCat); */

  const [newCategory, setNewCategory] = useState("");
  const [catToBeDeleted, setcatToBeDeleted] = useState("");
  const [fetched, setFetched] = useState(false);
  const [categoriesMap, setcategoriesMap] = useState(<></>);

  if (!fetched) {
    api.get("http://localhost:3010/categories").then((response) => {
      setcategoriesMap(response.data);

      setFetched(true);
    });
  }

  const addTask = async (e) => {
    //Prevent instant page load
    e.preventDefault();

    //Check if category already exists
    //If not, add it.
    let isInDb = false;
    await api.get("/").then((response) => {
      let data = response.data;
      console.log("data: ", response);
      data.forEach((element) => {
        if (
          (newCategory === element.categoryname || newCategory === "all") &&
          !isInDb
        ) {
          isInDb = true;

          alert(`The value you submit was already in database.`);
          return;
        }
      });
    });

    if (!isInDb) {
      //axios really helps with posting etc.
      await api
        .post("http://localhost:3010/categories/", {
          categoryname: newCategory,
        })
        .then((response) => {
          console.log("Successfully added the category");
          alert("New category has been added!");
          window.location.reload(false);
        })
        .catch(function (error) {
          console.log(error.response.data);
        });
    }
  };
  const deleteCategory = async (e) => {
    let tasksThatHaveCategory = [];
    let id = 1;
    //assume that the value is false, but validate it below
    let isInDb = false;
    //Prevent instant page load
    e.preventDefault();
    //First we need to get the id of the category.

    await api.get("/").then((response) => {
      console.log("resp data", response.data);
      response.data.forEach((element) => {
        console.log(element.categoryname === catToBeDeleted);
        if (element.categoryname === catToBeDeleted) {
          id = element.id;
          //TODO: Read comments above, must add element id to array tasksThatHaveCategory
          //TODO:     and then set the category to "general" in the next TODO

          isInDb = true;
          //You can't exit a foreach loop according to google, so it will still go through the response, but.. that's fine, sure, I don't want to use lodash or anything.
        }
      });
    });

    /*  console.log(tasksThatHaveCategory); */
    if (isInDb) {
      //Make sure if the user really wants to delete the task
      let areyousure = window.confirm(
        "Are you sure you want to delete this category FOREVER?"
      );
      if (areyousure && isInDb) {
        //TODO: Set any tasks with the category to be deleted to have the category "normal"
        await axios
          //I don't know why, but the base URL didn't want to work for the delete...
          .delete(`http://localhost:3010/categories/${id}`)
          .then(async () => {
            //get all tasks
            await axios
              .get("http://localhost:3010/tasks")
              .then((response) => {
                //Push all tasks that have the category to an array for.. mapping?
                response.data.forEach((task) => {
                  if (task.category === catToBeDeleted) {
                    tasksThatHaveCategory.push(task);
                  }
                });
              })
              //After tasks have been set to the array
              .then(async () => {
                await tasksThatHaveCategory.forEach((task) => {
                  //Put the new info to to their corresponding place
                  const newTask = {
                    title: task.title,
                    description: task.description,
                    deadline: task.deadline,
                    timeleft: task.timeleft,
                    hoursSpent: task.hoursSpent,
                    category: "general",
                    completed: task.completed,
                  };
                  console.log(newTask);
                  axios.put(`http://localhost:3010/tasks/${task.id}`, newTask);
                });
              })
              .then(() => window.location.reload(false));
          });
      }
    } else {
      //If it's not in the database, send out an alert
      alert(
        `Could not find ${catToBeDeleted} in database. Check for spelling errors`
      );
    }
  };

  return fetched && props.popup ? (
    <>
      <div className="categories">
        <div className="categories-select">
          <button
            onClick={() => {
              handler("all");
            }}
          >
            All
          </button>
          {categoriesMap.map((category, i) => (
            <button
              key={i + "button"}
              onClick={() => {
                console.log("the button WAS pressed");
                props.handler(category.categoryname);
              }}
            >
              {category.categoryname}
            </button>
          ))}
        </div>
      </div>

      <form className="categoryform" onSubmit={addTask}>
        <label>New Category: </label>
        <input
          type={"text"}
          required
          value={newCategory}
          onChange={(eventObject) => {
            setNewCategory(eventObject.target.value);
          }}
        ></input>
        <button type="submit">
          {<span class="material-symbols-outlined">add</span>}
        </button>
      </form>

      <form className="categoryform" onSubmit={deleteCategory}>
        <label>Delete by name: </label>
        <input
          type={"text"}
          required
          value={catToBeDeleted}
          onChange={(eventObject) => {
            setcatToBeDeleted(eventObject.target.value);
          }}
        ></input>
        <button type="submit">
          {<span class="material-symbols-outlined">close</span>}
        </button>
      </form>
    </>
  ) : (
    <></>
  );
};

export default Categories;
