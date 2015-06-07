import React from "react";

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

  contextTypes: {
    router: React.PropTypes.func
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

  setSubreddit: function(event) {
    this.refs.input.getDOMNode().value = "";
    this.page = 1;
    this.context.router.transitionTo("index", {
      subreddit: event.target.value
    });
  },

  setSort: function(event) {
    this.context.router.transitionTo("index", {
      subreddit: this.props.subreddit,
      sort: event.target.value
    });
  },

  setWindow: function(event) {
    this.context.router.transitionTo("index", {
      subreddit: this.props.subreddit,
      sort: this.props.sort,
      window: event.target.value
    });
  },

  handleTextInput: function(event) {
    if (event.keyCode === 13) {
      this.page = 1;
      this.context.router.transitionTo("index", {
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
    let subreddits = ImgurStore.getSubreddits().map(function(subreddit) {
      return <option key={subreddit}>{subreddit}</option>;
    });
    let windows = ImgurStore.getWindows().map(function(window) {
      return <option key={window}>{window}</option>;
    });
    let windowSelect = null;
    if (this.props.sort === "top") {
      windowSelect = (<select defaultValue={this.props.window} onChange={this.setWindow}>
        {windows}
      </select>);
    }
    return (
      <div>
        <input onKeyDown={this.handleTextInput} placeholder="eg: pics" ref="input" />
        <select defaultValue={this.props.subreddit} onChange={this.setSubreddit}>
          {subreddits}
        </select>
        <select defaultValue={this.props.sort} onChange={this.setSort}>
          <option>latest</option>
          <option>top</option>
        </select>
        {windowSelect}
        <Gallery items={this.state.items} onEnd={this.handleEnd} />
      </div>
    );

  }
});
