import React from "react";
import DocumentTitle from "react-document-title";

import Imgur from "../components/imgur";

export default React.createClass({
  displayName: "IndexRoute",

  render: function() {
    return (
      <DocumentTitle title="Index Title">
        <Imgur />
      </DocumentTitle>
    );
  }
});
