import React from "react";
import ReactDOM from "react-dom";
import { Router, Route } from "react-router";
import appHistory from "./history";

import App from "./routes/app";
import Index from "./routes/index";

ReactDOM.render((
	<Router history={appHistory}>
		<Route component={App}>
			<Route component={Index} path="/(:subreddit)(/:sort)(/:window)" />
		</Route>
	</Router>
), document.getElementById("gallery"));
