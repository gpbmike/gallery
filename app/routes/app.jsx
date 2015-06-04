import React from "react";
import { RouteHandler } from "react-router";

export default React.createClass({
	displayName: "AppRoute",

  contextTypes: {
		router: React.PropTypes.func
	},

	render: function() {
		return <RouteHandler />;
	}
});
