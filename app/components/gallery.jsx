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
      rowWidth: null
    };
  },

  componentWillMount: function() {
    window.addEventListener("resize", this.handleResize);
  },

  componentDidMount: function() {
    this.setState({rowWidth: this.getDOMNode().offsetWidth});
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({
      loadedItems: []
    }, this.loadItems.bind(this, nextProps.items));
  },

  componentWillUnmount: function() {
    window.removeEventListener("resize", this.handleResize);
  },

  handleResize: function() {
    this.setState({rowWidth: this.getDOMNode().offsetWidth});
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
      return <div />;
    }

    let rowWidth = this.state.rowWidth;
    let minRowHeight = this.props.minRowHeight;

    let itemStyle = {
      display: "inline-block",
      verticalAlign: "bottom"
    };

    function buildRow(row) {
      return row.items.map(function (item) {
        let imgStyle = {
          display: "block"
        };
        if (row.full) {
          imgStyle.width = item.aspectRatio * minRowHeight / row.width * rowWidth;
        } else {
          imgStyle.height = minRowHeight;
        }
        return <span key={item.url} style={itemStyle}><img src={item.url} style={imgStyle} /></span>;
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
