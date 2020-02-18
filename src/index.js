import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import AppWithState from "ui/AppWithState";
import AppWithRedux from "ui/AppWithRedux";
import AppWithReactRedux from "ui/AppWithReactRedux";

function Startup() {
  return (
    <Router>
      <Fragment>
        <nav>
          <ul style={{ display: "flex", justifyContent: "space-evenly" }}>
            <li>
              <Link to="/">state</Link>
            </li>
            <li>
              <Link to="/redux">redux</Link>
            </li>
            <li>
              <Link to="/react-redux">react-redux</Link>
            </li>
          </ul>
        </nav>
        <Route exact path="/" component={AppWithState} />
        <Route exact path="/redux" component={AppWithRedux} />
        <Route exact path="/react-redux" component={AppWithReactRedux} />
      </Fragment>
    </Router>
  );
}

ReactDOM.render(<Startup />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
