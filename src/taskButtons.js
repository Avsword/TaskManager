import axios from "axios";
const api = axios.create({
  baseURL: "http://localhost:3010/tasks",
});

const flipCompleted = async (id, completed, canReload) => {
  let data = {};
  //Apparently I need to get the current values and then update the entire table with the new completed status. Sure.
  console.log(id);
  await api.get(`/${id}`).then((response) => {
    //List full of all the tasks
    data = response.data;
    console.log("obj after call", data);
  });

  //Flip the completed
  data.completed = !completed;

  api.put(`/${id}`, data).then((response) => {
    console.log(response);
  });
  if (canReload || canReload === undefined) {
    window.location.reload(false);
  }

  /* !completed
    ? alert("Task has been completed!")
    : alert("Task has been sent back to the 'TODO'-page"); */
};
const deleteTask = (id) => {
  //Make sure if the user really wants to delete the task
  let areyousure = window.confirm(
    "Are you sure you want to delete this task FOREVER?"
  );
  if (areyousure) {
    axios
      //I don't know why, but the base URL didn't want to work for the delete...
      .delete(`http://localhost:3010/tasks/${id}`)
      .then((response) => window.location.reload(false));
  }
};

export { flipCompleted, deleteTask };
