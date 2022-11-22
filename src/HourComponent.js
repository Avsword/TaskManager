import { Routes, Route, useParams, Link } from "react-router-dom";
import React from "react";

function HourComponent() {
  return (
    <>
      <nav>
        <ul className="nav-list">
          <li className="nav-item">
            <Link to="goofy">WIP</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path=":subpageId" element={<Subpage />}></Route>
        <Route path="*" element={<h1>Please Select a subpage</h1>}></Route>
      </Routes>
    </>
  );
}
function Subpage() {
  const { subpageId } = useParams();

  /*  const { search } = useLocation(); */

  //The example didnt really.. work with the paramsfromurlsearchparams?? So. Leave it.
  //const paramsFromURLSearchParams = new URLSearchParams(window.location.search);

  switch (subpageId) {
    case "goofy":
      return (
        <>
          <h1>work-in-progres</h1>
          <p>This site is currently under construction, please visit again!</p>
        </>
      );
    //I don't think that I ever entered the default state
    default:
      return <></>;
  }
}
/* const mapStateToProps = (state) => {
  return {
    modeFromReduxStore: state["general"]["mode"],
    colorModeFromReduxStore: state["general"]["colorMode"],
  };
};
const catsview = connect(null, null)(CuteCatComponent); */
export default HourComponent;
