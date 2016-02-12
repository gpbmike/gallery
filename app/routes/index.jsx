import React from "react";
import DocumentTitle from "react-document-title";

import Imgur from "../components/imgur";

export default React.createClass({
  displayName: "IndexRoute",

  propTypes: {
    params: React.PropTypes.object
  },

  render: function() {
    return (
      <DocumentTitle title="Gallery Thing">
        <Imgur {...this.props.params} />
      </DocumentTitle>
    );
  }
});
