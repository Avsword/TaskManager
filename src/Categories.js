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

  const [newCategory, setNewCategory] = useState("all");
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
    let id = 1;
    //Prevent instant page load
    e.preventDefault();
    //First we need to get the id of the category
    await api.get("/").then((response) => {
      response.data.forEach((element) => {
        console.log(element.categoryname === catToBeDeleted);
        if (element.categoryname === catToBeDeleted) {
          id = element.id;
          return;
        } else {
          alert("Category not found");
          return;
        }
      });
    });

    //Make sure if the user really wants to delete the task
    let areyousure = window.confirm(
      "Are you sure you want to delete this category FOREVER?"
    );
    if (areyousure) {
      await axios
        //I don't know why, but the base URL didn't want to work for the delete...
        .delete(`http://localhost:3010/categories/${id}`)
        .then((response) => window.location.reload(false));
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
          {/* <span class="material-symbols-outlined">add</span> */}
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
          {/* <span class="material-symbols-outlined">close</span> */}
        </button>
      </form>
    </>
  ) : (
    <></>
  );
};

export default Categories;
