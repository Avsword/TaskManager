import { useState } from 'react';
import './newTask.css';
import axios from 'axios';
const api = axios.create({
  baseURL: 'http://localhost:3010/tasks',
});

const NewTask = () => {
  //Add responsivity for adding a new task with some feedback on the status. (If the server is really slow, we could need this)
  const [pendingrequest, setPendingrequest] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [categories, setCategories] = useState('All');

  //States for each input field for submitting to the db
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  //Could use current date as default deadline, but I don't currently see the need for that.
  const [deadline, setDeadline] = useState('');
  const [category, setCategory] = useState('general');

  //Default values for different variables within each task. Id will be automatically updated by axios I think
  //timeleft will be handled later?
  const timeleft = 0;
  //Of course you haven't spent any hours when you just created the object
  const hoursSpent = 0;
  const completed = false;

  //Get and set the categories :)
  if (!fetched) {
    api.get('http://localhost:3010/categories').then((response) => {
      response.data.shift();
      setCategories(response.data);
      /* console.log("resp ", response.data);
      console.log("categories: ", categories); */
      setFetched(true);
    });
  }
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
      .post('/', newTask)
      .then(function (response) {
        setPendingrequest(false);
        console.log('Successfully added the task');
        alert('New task has been added!');
        window.location.reload(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  return fetched ? (
    <>
      <h2 className='newTaskHeader'>Add a new task</h2>
      <div className='newTaskWrapper'>
        <form onSubmit={handleTaskSubmit}>
          <div className='newTaskInput'>
            <label>Title:</label>
            <input
              type={'text'}
              required
              value={title}
              onChange={(eventObject) => {
                setTitle(eventObject.target.value);
              }}
            ></input>
          </div>

          <div className='newTaskInput'>
            <label>Description: </label>
            <textarea
              required
              value={description}
              onChange={(eventObject) => {
                setDescription(eventObject.target.value);
              }}
            ></textarea>
          </div>

          <div className='newTaskInput'>
            <label>Deadline: </label>
            <input
              type={'date'}
              required
              value={deadline}
              onChange={(eventObject) => {
                setDeadline(eventObject.target.value);
              }}
            ></input>
          </div>

          <div className='newTaskInput'>
            <label>Task category: </label>
            <select
              required
              value={category}
              onChange={(eventObject) => {
                setCategory(eventObject.target.value);
              }}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.categoryname}>
                  {category.categoryname}
                </option>
              ))}
            </select>
          </div>
          <span className='newTaskSubmit'>
            {!pendingrequest && <button>Add task</button>}
            {pendingrequest && (
              <span className='material-symbols-outlined'>refresh</span>
            )}
          </span>
        </form>
      </div>
    </>
  ) : (
    <></>
  );
};

export default NewTask;
