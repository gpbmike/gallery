import React from "react";
import ReactDOM from "react-dom";
import Router, { Route } from "react-router";

import App from "./routes/app";
import Index from "./routes/index";

let routes = (
	<Route handler={App}>
		<Route handler={Index} name="index" path="/:subreddit?/?:sort?/?:window?" />
	</Route>
);

Router.run(routes, Router.HashLocation, function (Handler) {
  ReactDOM.render(<Handler />, document.getElementById("gallery"));
});
