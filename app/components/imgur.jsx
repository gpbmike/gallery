import React from "react";

import appHistory from "../history";

import ImgurStore from "../stores/imgur";
import Gallery from "../components/gallery";

import AppConstants from "../constants";
import AppDispatcher from "../dispatcher";

export default React.createClass({
  displayName: "Imgur",

  propTypes: {
    sort: React.PropTypes.oneOf(ImgurStore.getSorts()),
    subreddit: React.PropTypes.string.isRequired,
    window: React.PropTypes.oneOf(ImgurStore.getWindows())
  },

  getDefaultProps: function () {
    return {
      sort: "latest",
      subreddit: "EarthPorn",
      window: "week"
    };
  },

  getInitialState: function () {
    return {
      items: []
    };
  },

  componentWillMount: function() {
    ImgurStore.addChangeListener(this.itemsChanged);
  },

  componentDidMount: function() {
    this.fetchGallery(this.props);
  },

  componentWillReceiveProps: function (nextProps) {
    if (JSON.stringify(nextProps) !== JSON.stringify(this.props)) {
      this.setState({items: []});
      this.fetchGallery(nextProps);
    }
  },

  componentWillUnmount: function() {
    ImgurStore.removeChangeListener(this.itemsChanged);
  },

  itemsChanged: function() {
    this.setState({
      items: ImgurStore.getItems(this.props.subreddit, {
        sort: this.props.sort,
        window: this.props.window
      })
    });
  },

  page: 1,

  fetchGallery: function(options) {
    AppDispatcher.dispatch({
      actionType: AppConstants.IMGUR_FETCH,
      data: {
        subreddit: options.subreddit,
        options: {
          sort: options.sort,
          window: options.window,
          page: this.page
        }
      }
    });
  },

  transition: function(params) {
    this.page = 1;
    if (params.sort === "latest") {
      delete params.window;
    }
    let path = "/";
    if (params.subreddit) {
      path = path.concat(`${params.subreddit}`);
      if (params.sort) {
        path = path.concat(`/${params.sort}`);
        if (params.window) {
          path = path.concat(`/${params.window}`);
        }
      }
    }
    appHistory.push(path);
  },

  setSubreddit: function(event) {
    this.transition({
      subreddit: event.target.value,
      sort: this.props.sort,
      window: this.props.window
    });
  },

  setSort: function(event) {
    this.transition({
      subreddit: this.props.subreddit,
      sort: event.target.value
    });
  },

  setWindow: function(event) {
    this.transition({
      subreddit: this.props.subreddit,
      sort: this.props.sort,
      window: event.target.value
    });
  },

  handleTextInput: function(event) {
    if (event.keyCode === 13) {
      this.transition({
        subreddit: event.target.value,
        sort: this.props.sort,
        window: this.props.window
      });
    }
  },

  handleEnd: function() {
    this.page++;
    this.fetchGallery(this.props);
  },

  render: function() {
    let navStyle = {
      position: "fixed",
      top: 0,
      height: 25
    };

    let wrapStyle = {
      marginTop: 25
    };

    return (
      <div style={wrapStyle}>
        <nav style={navStyle}>
          <input onKeyDown={this.handleTextInput} placeholder="subreddit eg: pics" ref="input" />
          <select defaultValue={this.props.subreddit} onChange={this.setSubreddit}>
            {ImgurStore.getSubreddits().map(function(subreddit) {
              return <option key={subreddit} value={subreddit}>{subreddit}</option>;
            })}
          </select>
          <select defaultValue={this.props.sort} onChange={this.setSort}>
            <option value="latest">latest</option>
            <option value="top">top</option>
          </select>
          {this.props.sort === "top" && (
            <select defaultValue={this.props.window} onChange={this.setWindow}>
              {ImgurStore.getWindows().map(function(window) {
                return <option key={window} value={window}>{window}</option>;
              })}
            </select>
          )}
        </nav>
        <Gallery items={this.state.items} onEnd={this.handleEnd} />
      </div>
    );

  }
});
