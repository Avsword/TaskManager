import { Link, Routes, Route, useParams } from "react-router-dom";

function InfoComponent() {
  return (
    <>
      <nav>
        <ul className="nav-list">
          <li className="nav-item">
            <Link to="author">Author</Link>
          </li>
          <li className="nav-item">
            <Link to="instructions">User instructions</Link>
          </li>
          <li className="nav-item">
            <Link to="legal">Legal info (copyrights etc)</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path=":subpageId" element={<Subpage />} />
        <Route path="*" element={<Subpage />} />
      </Routes>
    </>
  );
}
function Subpage() {
  const { subpageId } = useParams();
  console.log(subpageId);
  switch (subpageId) {
    case undefined:
    case "author":
      return (
        <>
          <h1>This application was created by Aaro Varjonen</h1>
        </>
      );
    case "instructions":
      return (
        <>
          <h1>How to use this web app</h1>
          <p>
            Coming soon, once all of the functionality has been thought out and
            implemented.
          </p>
        </>
      );
    case "legal":
      return (
        <>
          <h1>Legal Info & Copyrights</h1>
          <h2>This site uses the Google material icons</h2>
          <a
            href={
              "https://github.com/google/material-design-icons/blob/master/LICENSE"
            }
          >
            https://github.com/google/material-design-icons/blob/master/LICENSE
          </a>
        </>
      );
    default:
      break;
  }
}
export default InfoComponent;
