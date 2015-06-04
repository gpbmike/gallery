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

let GalleryStore = Object.assign({}, BaseStore, {
  getItems: function(subreddit, orderBy) {
    return items[`${subreddit}/${orderBy}`];
  },
  getSubreddits: function() {
    return subreddits;
  }
});

// function parseReddit(results) {
//   let parsedItems = [];
//   for (var child of results.data.children) {
//     if (child.data.domain === "i.imgur.com") {
//       parsedItems.push(child.data.url);
//     } else if (/\.jpg$/i.test(child.data.url)) {
//       parsedItems.push(child.data.url);
//     } else {
//       console.log(child.data);
//     }
//   }
//   return parsedItems;
// }

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
    GalleryStore.emitChange();
    return;
  }

  if (orderBy !== "top") {
    orderBy = "";
  }

  // e4df882d90e3ac2
  // https://api.imgur.com/3/gallery/r/{subreddit}/{sort}/{page}

  fetch(`https://api.imgur.com/3/gallery/r/${subreddit}/${orderBy}?`, {
    headers: {
      "Authorization": "Client-ID e4df882d90e3ac2"
    }
  }).then(function(response) {
    return response.json();
  }).then(function(json) {
    // console.log(json);
    items[itemsKey] = parseImgur(json);
    GalleryStore.emitChange();
  }).catch(function(ex) {
    console.log("parsing failed", ex);
  });
}

GalleryStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.actionType) {
    case AppConstants.GALLERY_FETCH:
      fetchSubreddit(action.data.subreddit, action.data.orderBy);
      break;
  }
});

export default GalleryStore;
