import React from "react";

import ImgurStore from "../stores/imgur";
import Gallery from "../components/gallery";

import AppConstants from "../constants";
import AppDispatcher from "../dispatcher";

export default React.createClass({
  displayName: "Imgur",

  getInitialState: function () {
    return {
      subreddit: "EarthPorn",
      sort: "latest",
      window: "week"
    };
  },

  componentWillMount: function() {
    ImgurStore.addChangeListener(this.itemsChanged);
  },

  componentDidMount: function() {
    this.fetchGallery();
  },

  componentWillUnmount: function() {
    ImgurStore.removeChangeListener(this.itemsChanged);
  },

  itemsChanged: function() {
    this.setState({
      items: ImgurStore.getItems(this.state.subreddit, {
        sort: this.state.sort,
        window: this.state.window
      })
    });
  },

  fetchGallery: function() {
    AppDispatcher.dispatch({
      actionType: AppConstants.IMGUR_FETCH,
      data: {
        subreddit: this.state.subreddit,
        options: {
          sort: this.state.sort,
          window: this.state.window
        }
      }
    });
  },

  setSubreddit: function(event) {
    this.setState({
      items: [],
      subreddit: event.target.value
    }, this.fetchGallery);
  },

  setSort: function(event) {
    this.setState({
      items: [],
      sort: event.target.value
    }, this.fetchGallery);
  },

  setWindow: function(event) {
    this.setState({
      items: [],
      window: event.target.value
    }, this.fetchGallery);
  },

  handleTextInput: function(event) {
    if (event.keyCode === 13) {
      this.setState({
        items: [],
        subreddit: event.target.value
      }, this.fetchGallery);
    }
  },

  render: function() {
    let subreddits = ImgurStore.getSubreddits().map(function(subreddit) {
      return <option key={subreddit}>{subreddit}</option>;
    });
    let windows = ImgurStore.getWindows().map(function(window) {
      return <option key={window}>{window}</option>;
    });
    let windowSelect = null;
    if (this.state.sort === "top") {
      windowSelect = (<select onChange={this.setWindow} value={this.state.window}>
        {windows}
      </select>);
    }
    return (
      <div>
        <input onKeyDown={this.handleTextInput} placeholder="eg: pics" />
        <select onChange={this.setSubreddit} value={this.state.subreddit}>
          {subreddits}
        </select>
        <select onChange={this.setSort} value={this.state.sort}>
          <option>latest</option>
          <option>top</option>
        </select>
        {windowSelect}
        <Gallery items={this.state.items} />
      </div>
    );
  }
});
