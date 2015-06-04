import React from "react";
import DocumentTitle from "react-document-title";

import GalleryStore from "../stores/gallery";
import Gallery from "../components/gallery";

export default React.createClass({
  displayName: "IndexRoute",

  contextTypes: {
		router: React.PropTypes.func
	},

  getInitialState: function () {
    let subreddits = GalleryStore.getSubreddits();
    return {
      subreddits: subreddits,
      subreddit: subreddits[0],
      orderBy: "hot"
    };
  },

  setSubreddit: function(event) {
    this.setState({
      subreddit: event.target.value
    });
  },

  setOrderBy: function(event) {
    this.setState({
      orderBy: event.target.value
    });
  },

  handleTextInput: function(event) {
    if (event.keyCode === 13) {
      this.setState({
        subreddit: event.target.value
      });
    }
  },

  render: function() {
    let options = this.state.subreddits.map(function(subreddit) {
      return <option key={subreddit}>{subreddit}</option>;
    });
    return (
      <DocumentTitle title="Index Title">
        <div>
          <input onKeyDown={this.handleTextInput} placeholder="eg: pics" />
          <select onChange={this.setSubreddit} value={this.state.subreddit}>
            {options}
          </select>
          <select onChange={this.setOrderBy} value={this.state.orderBy}>
            <option>hot</option>
            <option>top</option>
          </select>
          <Gallery orderBy={this.state.orderBy} subreddit={this.state.subreddit} />
        </div>
      </DocumentTitle>
    );
  }
});
