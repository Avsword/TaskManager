import "./App.css";
import "./task.css";
import "./nav.css";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import Hours from "./HourComponent";
import Info from "./InfoComponent";
import Task from "./TaskComponent";

function App() {
  return (
    <BrowserRouter>
      <>
        <nav>
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/tasks">Tasks</Link>
            </li>
            <li className="nav-item">
              <Link to="/hours">Hours</Link>
            </li>
            <li className="nav-item">
              <Link to="/info">Info</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route
            path="/"
            element={
              <div className="home">
                <h1>Task Manager</h1>
                <p>
                  Hello, there! The home page will be updated soon enough, once
                  I get the tasks working the way I want them to :)
                </p>
              </div>
            }
          ></Route>
          <Route path="tasks/*" element={<Task />} />
          <Route path="hours/*" element={<Hours />} />
          <Route path="info/*" element={<Info />} />
        </Routes>
      </>
    </BrowserRouter>
  );
}

/* function Foobar() {
  //God I love React's documentation, it's actually readable.
  const [text, setText] = useState("foo");
  //Update
  useEffect(() => {
    const interval = setInterval(() => {
      text === "foo" ? setText("bar") : setText("foo");
    }, 2000);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <>
      <h2>{text}</h2>
    </>
  );
} */

export default App;
