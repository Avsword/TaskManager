import { Link, Routes, Route, useParams } from 'react-router-dom';

function InfoComponent() {
  return (
    <>
      <nav>
        <ul className='nav-list'>
          <li className='nav-item'>
            <Link to='author'>Author</Link>
          </li>
          <li className='nav-item'>
            <Link to='instructions'>User instructions</Link>
          </li>
          <li className='nav-item'>
            <Link to='legal'>Legal info (copyrights etc)</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path=':subpageId' element={<Subpage />} />
        <Route path='*' element={<Subpage />} />
      </Routes>
    </>
  );
}
function Subpage() {
  const { subpageId } = useParams();
  /* console.log(subpageId); */

  switch (subpageId) {
    /* case undefined: */
    case 'author':
      return (
        <>
          <h1>This application was created by Aaro Varjonen</h1>
        </>
      );
    case 'instructions':
      return (
        <div style={{ width: '80vw', padding: '20px' }}>
          <h1>How to use this web app</h1>
          <h2>Tasks</h2>
          <p>
            In the TODO-page, you will see all tasks, which are yet to be
            completed. Each task has controls for marking the task as completed,
            editing the task and removing the task entirely. In addition to
            that, each task also has controls for tracking the task's work time,
            and buttons for reorganizing the tasks to your liking!
          </p>

          <p>
            The 'Completed' page shows all thats, which you have marked as
            completed. You can also mark it as not completed in case you made a
            mistake, or you can delete it forever.
          </p>
          <p>
            The 'New Task' page allows you to create a new task to be tracked
            and set it's title, description, deadline and the task category
          </p>
          <p>
            The 'Categories'-popup is a handy tool for sorting all of your
            tasks. You can create new categories and delete existing categories
            except for 'all' and 'general'. <br></br> The buttons are
            automatically generated from what categories exist in the database,
            and allow you to sort through the TODO and completed -pages.
          </p>
          <p>
            Special notes: Should you remove a category, all the tasks which
            have said category will be set to have the category 'general'.
          </p>
          <h2>Time</h2>
          <p>
            By default, the 'Time' Page shows a bar graph representation of all
            time logged from the past week. You can toggle between minutes and
            hours, since 6 thousand minutes doesn't really say as much as a
            hundred hours.
          </p>
          <p>
            IMPORTANT: If you wish to see the daily logs for a certain task, you
            will just have to press the bar on the graph and it'll automatically
            update itself for you! Personally, I'm really proud of this feature{' '}
          </p>
          <p>By default, it shows you the past week of progress.</p>
        </div>
      );
    case 'legal':
      return (
        <>
          <h1>Legal Info & Copyrights</h1>
          <h2>This site uses the Google material icons</h2>
          <a
            href={
              'https://github.com/google/material-design-icons/blob/master/LICENSE'
            }
          >
            https://github.com/google/material-design-icons/blob/master/LICENSE
          </a>
          <h2>
            favicon was created by{' '}
            <a href={'https://openai.com/dall-e-2/'}> DALL-E 2.0</a>
          </h2>
          <h2>
            {' '}
            The Weather API on the home screen uses the weatherapi.com API.{' '}
          </h2>
        </>
      );
    default:
      break;
  }
}
export default InfoComponent;
