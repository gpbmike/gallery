import React from "react";
import Router, { Route } from "react-router";

import App from "./routes/app";
import Index from "./routes/index";

let routes = (
	<Route handler={App}>
		<Route handler={Index} name="index" path="/" />
	</Route>
);

Router.run(routes, Router.HashLocation, function (Handler) {
  React.render(<Handler />, document.body);
});
