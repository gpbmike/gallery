import React from "react";

export default React.createClass({
	displayName: "AppRoute",

	propTypes: {
		children: React.PropTypes.any
	},

	render: function() {
		return <div>{this.props.children}</div>;
	}
});
