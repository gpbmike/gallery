import React from "react";

export default React.createClass({
  displayName: "Gallery",

  propTypes: {
    items: React.PropTypes.array,
    minRowHeight: React.PropTypes.number
  },

  getDefaultProps: function() {
    return {
      items: [],
      minRowHeight: 200
    };
  },

  getInitialState: function() {
    return {
      loadedItems: [],
      componentWidth: null
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
    this.setState({
      loadedItems: []
    }, this.loadItems.bind(this, nextProps.items));
  },

  componentWillUnmount: function() {
    window.removeEventListener("resize", this.handleResize);
    window.removeEventListener("scroll", this.handleScroll);
  },

  handleResize: function() {
    this.setState({componentWidth: this.getDOMNode().offsetWidth});
  },

  handleScroll: function() {
    let scrollTolerance = this.props.minRowHeight * 2;
    let viewportBottom = document.body.scrollTop + document.documentElement.clientHeight;
    let componentBottom = this.getDOMNode().offsetTop + this.getDOMNode().offsetHeight;

    // fetch the next page
    if (viewportBottom + scrollTolerance > componentBottom) {
      console.log('FETCH NEXT PAGE');
    }
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

  zoomItem: function(item, event) {
    event.preventDefault();
    console.log(item);
  },

  render: function() {

    let componentWidth = this.state.componentWidth;
    let minRowHeight = this.props.minRowHeight;

    if (!componentWidth) {
      return <div/>;
    }

    let itemStyle = {
      display: "inline-block",
      verticalAlign: "bottom"
    };

    let zoomItem = this.zoomItem;

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
        return <a href={item.url} key={item.url} onClick={zoomItem.bind(null, item)} style={itemStyle}><img src={item.url} style={imgStyle} /></a>;
      });
    }

    let rowStyle = {};

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
