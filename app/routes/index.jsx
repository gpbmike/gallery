import React from "react";
import DocumentTitle from "react-document-title";

import Imgur from "../components/imgur";

export default React.createClass({
  displayName: "IndexRoute",

  contextTypes: {
    router: React.PropTypes.func
  },

  componentWillMount: function() {
    if (!this.context.router.getCurrentParams().subreddit) {
      this.context.router.replaceWith("index", {
        subreddit: "EarthPorn"
      });
    }
  },

  render: function() {
    return (
      <DocumentTitle title="Gallery Thing">
        <Imgur {...this.context.router.getCurrentParams()} />
      </DocumentTitle>
    );
  }
});
