import React from "react";

import ImgurStore from "../stores/imgur";
import Gallery from "../components/gallery";

import AppConstants from "../constants";
import AppDispatcher from "../dispatcher";

export default React.createClass({
  displayName: "Imgur",

  getInitialState: function () {
    let subreddits = ImgurStore.getSubreddits();
    return {
      subreddits: subreddits,
      subreddit: subreddits[0],
      orderBy: "hot"
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
      items: ImgurStore.getItems(this.state.subreddit, this.state.orderBy)
    });
  },

  fetchGallery: function() {
    AppDispatcher.dispatch({
      actionType: AppConstants.IMGUR_FETCH,
      data: {
        subreddit: this.state.subreddit,
        orderBy: this.state.orderBy
      }
    });
  },

  setSubreddit: function(event) {
    this.setState({
      items: [],
      subreddit: event.target.value
    }, this.fetchGallery);
  },

  setOrderBy: function(event) {
    this.setState({
      items: [],
      orderBy: event.target.value
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
    let options = this.state.subreddits.map(function(subreddit) {
      return <option key={subreddit}>{subreddit}</option>;
    });
    return (
      <div>
        <input onKeyDown={this.handleTextInput} placeholder="eg: pics" />
        <select onChange={this.setSubreddit} value={this.state.subreddit}>
          {options}
        </select>
        <select onChange={this.setOrderBy} value={this.state.orderBy}>
          <option>hot</option>
          <option>top</option>
        </select>
        <Gallery items={this.state.items} />
      </div>
    );
  }
});
