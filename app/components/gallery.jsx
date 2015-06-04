import React from "react";

import AppConstants from "../constants";
import AppDispatcher from "../dispatcher";
import GalleryStore from "../stores/gallery";

export default React.createClass({
  displayName: "Gallery",

  propTypes: {
    minRowHeight: React.PropTypes.number,
    orderBy: React.PropTypes.string,
    subreddit: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      minRowHeight: 200,
      orderBy: "hot",
      subreddit: "EarthPorn"
    };
  },

  getInitialState: function() {
    return {
      loadedItems: [],
      rowWidth: null
    };
  },

  componentWillMount: function() {
    document.addEventListener("scroll", this.handleScroll);
    GalleryStore.addChangeListener(this.galleryChanged);
  },

  componentDidMount: function() {
    this.setState({rowWidth: this.getDOMNode().offsetWidth});
    this.fetchGallery(this.props.subreddit, this.props.orderBy);
  },

  componentWillReceiveProps: function(nextProps) {
    // this.loadItems(GalleryStore.getItems(nextProps.subreddit, nextProps.orderBy));
    this.fetchGallery(nextProps.subreddit, nextProps.orderBy);
  },

  componentWillUnmount: function() {
    document.removeEventListener("scroll", this.handleScroll);
    GalleryStore.removeChangeListener(this.galleryChanged);
  },

  galleryChanged: function() {
    this.loadItems(GalleryStore.getItems(this.props.subreddit, this.props.orderBy));
  },

  fetchGallery: function(subreddit, orderBy) {
    this.setState({
      loadedItems: []
    });
    AppDispatcher.dispatch({
      actionType: AppConstants.GALLERY_FETCH,
      data: {
        subreddit: subreddit,
        orderBy: orderBy
      }
    });
  },

  handleScroll: function() {
    let scrollLimit = document.body.scrollTop + document.documentElement.clientHeight;
    let contentLimit = this.getDOMNode().offsetHeight + this.getDOMNode().offsetTop;

    console.log(scrollLimit > contentLimit);
  },

  loadItems: function(items) {
    let loadedItems = this.state.loadedItems;

    items.forEach(function(url, index) {
      var img = new Image();
      img.onload = function() {

        let item = {
          url: url,
          width: img.width,
          height: img.height,
          aspectRatio: img.width / img.height
        };

        loadedItems[index] = item;

        this.setState({loadedItems: loadedItems});

      }.bind(this);
      img.src = url;
    }.bind(this));
  },

  getRows: function(items) {

    let loadedOrderedItems = [];

    for (var i = 0; i < items.length; i++) {
      if (!items[i]) {
        break;
      }
      loadedOrderedItems.push(items[i]);
    }

    let itemsWidth = 0;
    let minRowHeight = this.props.minRowHeight;
    let rowWidth = this.state.rowWidth;
    let rows = [];
    let rowItems = [];

    loadedOrderedItems.forEach(function(item) {

      let itemWidth = item.aspectRatio * minRowHeight;

      if (itemsWidth + itemWidth > rowWidth) {
        rows.push({
          width: itemsWidth,
          items: rowItems,
          full: true
        });
        rowItems = [item];
        itemsWidth = itemWidth;
      } else {
        rowItems.push(item);
        itemsWidth += itemWidth;
      }

    });

    // Throw the leftovers in the final row
    rows.push({
      width: itemsWidth,
      items: rowItems,
      full: false
    });

    return rows;

  },

  render: function() {

    if (!this.state.rowWidth) {
      return <div>Loading</div>;
    }

    let rowWidth = this.state.rowWidth;
    let minRowHeight = this.props.minRowHeight;

    function buildRow(row) {
      return row.items.map(function (item) {
        let imgStyle = {};
        if (row.full) {
          imgStyle.width = item.aspectRatio * minRowHeight / row.width * rowWidth;
        } else {
          imgStyle.height = minRowHeight;
        }
        return <span key={item.url}><img src={item.url} style={imgStyle} /></span>;
      });
    }

    let rowStyle = {
      paddingTop: 5,
      paddingBottom: 5,
      borderBottom: "5px solid gray"
    };

    var rows = this.getRows(this.state.loadedItems).map(function(row) {
      let key = row.items.reduce(function (memo, item) {
        return memo + item.url;
      }, "");
      return <div key={key} style={rowStyle}>{buildRow(row)}</div>;
    });

    return (
      <div>{rows}</div>
    );
  }
});
