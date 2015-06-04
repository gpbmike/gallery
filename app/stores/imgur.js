import AppConstants from "../constants";
import AppDispatcher from "../dispatcher";
import BaseStore from "./base";

let subreddits = [
  "EarthPorn",
  "BotanicalPorn",
  "WaterPorn",
  "MilitaryPorn"
];

let items = [];

let ImgurStore = Object.assign({}, BaseStore, {
  getItems: function(subreddit, orderBy) {
    return items[`${subreddit}/${orderBy}`];
  },
  getSubreddits: function() {
    return subreddits;
  }
});

function parseImgur(results) {
  return results.data.map(function(child) {
    let linkParts = child.link.split(".");
    linkParts[linkParts.length - 2] += "l";
    return linkParts.join(".");
  });
}

function fetchSubreddit(subreddit, orderBy) {

  let itemsKey = `${subreddit}/${orderBy}`;

  if (items[itemsKey]) {
    ImgurStore.emitChange();
    return;
  }

  if (orderBy !== "top") {
    orderBy = "";
  }

  fetch(`https://api.imgur.com/3/gallery/r/${subreddit}/${orderBy}`, {
    headers: {
      "Authorization": "Client-ID e4df882d90e3ac2"
    }
  }).then(function(response) {
    return response.json();
  }).then(function(json) {
    items[itemsKey] = parseImgur(json);
    ImgurStore.emitChange();
  }).catch(function(ex) {
    console.log("parsing failed", ex);
  });
}

ImgurStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.actionType) {
    case AppConstants.IMGUR_FETCH:
      fetchSubreddit(action.data.subreddit, action.data.orderBy);
      break;
  }
});

export default ImgurStore;
