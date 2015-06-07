import React from "react";

export default React.createClass({
  displayName: "Gallery",

  propTypes: {
    items: React.PropTypes.array,
    minRowHeight: React.PropTypes.number,
    onEnd: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      items: [],
      minRowHeight: 200,
      onEnd: function () {}
    };
  },

  getInitialState: function() {
    return {
      loadedItems: [],
      componentWidth: null,
      focusedItem: null
    };
  },

  componentWillMount: function() {
    window.addEventListener("resize", this.handleResize);
    window.addEventListener("scroll", this.handleScroll);
  },

  componentDidMount: function() {
    this.setState({componentWidth: this.getDOMNode().offsetWidth});
  },

  componentWillReceiveProps: function(nextProps) {
    this.loadItems(nextProps.items);
  },

  componentDidUpdate: function() {
    this.hasEnded = false;
  },

  componentWillUnmount: function() {
    window.removeEventListener("resize", this.handleResize);
    window.removeEventListener("scroll", this.handleScroll);
  },

  handleResize: function() {
    this.setState({componentWidth: this.getDOMNode().offsetWidth});
  },

  hasEnded: false,

  handleScroll: function() {
    let scrollTolerance = this.props.minRowHeight * 4;
    let viewportBottom = document.body.scrollTop + document.documentElement.clientHeight;
    let componentBottom = this.getDOMNode().offsetTop + this.getDOMNode().offsetHeight;

    // fetch the next page
    if (viewportBottom + scrollTolerance > componentBottom && !this.hasEnded) {
      this.hasEnded = true;
      this.props.onEnd();
    }
  },

  loadItems: function(items) {
    let loadedItems = this.state.loadedItems;

    items.forEach(function(item, index) {

      var img = new Image();
      img.onload = function() {

        let galleryItem = {
          thumbnail: item.thumbnail,
          original: item.original,
          width: img.width,
          height: img.height,
          aspectRatio: img.width / img.height,
          data: item.data
        };

        loadedItems[index] = galleryItem;

        this.setState({loadedItems: loadedItems});

      }.bind(this);

      img.src = item.thumbnail;

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
    let componentWidth = this.state.componentWidth;
    let rows = [];
    let rowItems = [];

    loadedOrderedItems.forEach(function(item) {

      let itemWidth = item.aspectRatio * minRowHeight;

      if (itemsWidth + itemWidth > componentWidth) {
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

  focusItem: function(item, event) {
    event.preventDefault();
    this.setState({
      focusedItem: item
    });
  },

  handleFocusedClick: function() {
    this.setState({
      focusedItem: null
    });
  },

  render: function() {

    let componentWidth = this.state.componentWidth;
    let minRowHeight = this.props.minRowHeight;

    if (!componentWidth) {
      return <div/>;
    }

    let itemStyle = {
      display: "inline-block",
      verticalAlign: "bottom",
      cursor: "pointer"
    };

    let focusItem = this.focusItem;

    function buildRow(row) {
      return row.items.map(function(item) {
        let imgStyle = {
          display: "block"
        };
        if (row.full) {
          imgStyle.width = item.aspectRatio * minRowHeight / row.width * componentWidth;
        } else {
          imgStyle.height = minRowHeight;
        }
        return (
          <a href={item.url} key={item.thumbnail} onClick={focusItem.bind(null, item)} style={itemStyle}>
            <img src={item.thumbnail} style={imgStyle} />
          </a>
        );
      });
    }

    let rowStyle = {};

    var rows = this.getRows(this.state.loadedItems).map(function(row) {
      let key = row.items.reduce(function (memo, item) {
        return memo + item.thumbnail;
      }, "");
      return <div key={key} style={rowStyle}>{buildRow(row)}</div>;
    });

    let focusedContainerStyle = {
      cursor: "pointer",
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(0, 0, 0, 0.9)"
    };

    let focusedImgStyle = {
      maxWidth: "100%",
      maxHeight: "100%"
    };

    let focusedItem = this.state.focusedItem;
    let handleFocusedClick = this.handleFocusedClick;

    function getFocusedImg() {
      if (focusedItem) {
        return (
          <div onClick={handleFocusedClick} style={focusedContainerStyle}>
            <img src={focusedItem.original} style={focusedImgStyle} />
          </div>
        );
      } else {
        return null;
      }
    }

    return (
      <div>
        {rows}
        {getFocusedImg()}
      </div>
    );
  }
});
