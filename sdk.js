var Config = {};

/**
 * Returns the server url on port 1337
 */
Config.getUrl = function () {
  if (url) return url;
  var port = window.location.port;
  var url = window.location.protocol + '//localhost';
  if (port) url = url + ':1337';
  return url;
};


/**
 * XHR object
 */
var XHR = {};

/**
 * Sets the callback method to do when a request is done
 */
XHR.setCallback = function (callback, failureCallback) {
  this.xhttp = new XMLHttpRequest();
  var _self = this;
  this.xhttp.onreadystatechange = function () {
    if (_self.xhttp.readyState === 4) {
      if (_self.xhttp.status >= 200 && _self.xhttp.status <= 299) {
        callback(_self.xhttp.responseText);
      } else {
        failureCallback(_self.xhttp.responseText);
      }
    }
  };
};

const appId = 'myAppId';

/**
 * Sends a post request to parse
 * Takes the class path and the object to post
 */
XHR.POST = function (path, post) {
  this.xhttp.open("POST", Config.getUrl() + path, false);
  this.xhttp.setRequestHeader("X-Parse-Application-Id", appId);
  this.xhttp.setRequestHeader("Content-type", "application/json");
  this.xhttp.send(JSON.stringify(post));
};

/**
 * Sends a get request to parse
 * Takes the object path
 */
XHR.GET = function (path) {
  this.xhttp.open("GET", Config.getUrl() + path, false);
  this.xhttp.setRequestHeader("X-Parse-Application-Id", appId);
  this.xhttp.setRequestHeader("Content-type", "application/json");
  this.xhttp.send(null);
};

/**
 * Sends a get request to parse with a where condition
 * Takes the object path and the constraints
 */
XHR.GET_SPECIFIC = function (path, req) {
  this.xhttp.open("GET", Config.getUrl() + path + '?where=' + req, false);
  this.xhttp.setRequestHeader("X-Parse-Application-Id", appId);
  this.xhttp.setRequestHeader("Content-type", "application/json");
  this.xhttp.send();
};

/**
 * Sends a put request to parse
 * Takes the object path, the field to put and the id of the object to update
 */
XHR.PUT = function (path, put, objectId) {
  this.xhttp.open("PUT", Config.getUrl() + path + '/' + objectId, false);
  this.xhttp.setRequestHeader("X-Parse-Application-Id", appId);
  this.xhttp.setRequestHeader("Content-type", "application/json");
  this.xhttp.setRequestHeader("X-Parse-Revocable-Session", "1");
  this.xhttp.send(JSON.stringify(put));
};

/**
 * Sends a delete request to parse
 * Takes the object path and it's id
 */
XHR.DELETE = function (path, objectId) {
  this.xhttp.open("DELETE", Config.getUrl() + path + '/' + objectId, false);
  this.xhttp.setRequestHeader("X-Parse-Application-Id", appId);
  this.xhttp.setRequestHeader("Content-type", "application/json");
  this.xhttp.send(null);
};


/**
 * SDK functions
 */

/**
 * Adds an activity to the database
 * @param seed the object to add
 * @param id_plugin the class to which send the object
 */
function addActivity(seed, id_plugin) {
  /*if (!checkActivityParameters(seed)) {
    return -1;
  }*/
  // console.log(seed);
  XHR.setCallback(function (data) {
    },
    function (error) {
      console.log('There was a failure: ' + error);
    });
  XHR.POST('/parse/classes/' + id_plugin, seed);
  return seed.id;
}

/**
 * @param id_plugin the class of the plugin, eg.: Quiz
 * @returns all the plugin's activities
 */
function getActivities(id_plugin) {
  var return_data = 'this should not appear';
  XHR.setCallback(function (data) {
      //document.getElementById('get_quiz_text').innerHTML = data;
      //console.log(data);
      return_data = JSON.parse(data);
    },
    function (error) {
      console.log('There was a failure: ' + error);
    });
  XHR.GET('/parse/classes/' + id_plugin);
  return return_data;
}

/**
 * @param id_plugin the class of the plugin, eg.: Quiz
 * @param id the activity's id
 * @returns a specific activity
 */
function getActivity(id_plugin, id) {
  var return_data = null;
  XHR.setCallback(function (data) {
      //document.getElementById('get_quiz_text').innerHTML = data;
      //console.log(data);
      return_data = JSON.parse(data);
    },
    function (error) {
      console.log('There was a failure: ' + error);
    });
  XHR.GET_SPECIFIC('/parse/classes/' + id_plugin, JSON.stringify({
    "objectId": id
  }));
  if (return_data.results[0] === undefined) {
    return null;
  }
  return return_data;
}

/**
 * Updates a given activity
 * @param id_plugin the class of the plugin, eg.: Quiz
 * @param seed the object to update
 */
function updateActivity(id_plugin, seed) {
  XHR.setCallback(function (data) {
      XHR.PUT('/parse/classes/' + id_plugin, seed, JSON.parse(data).results[0].objectId);
    },
    function (error) {
      console.log('There was a failure: ' + error);
    });
  XHR.GET_SPECIFIC('/parse/classes/' + id_plugin, JSON.stringify({
    "name": seed.name
  }));
  return seed;
}

/**
 * Deletes a given activity
 * @param id_plugin the class of the plugin, eg.: Quiz
 * @param name the activity name
 */
function deleteActivity(id_plugin, name) {
  XHR.setCallback(function (data) {
      const json = JSON.parse(data);
      for (let i in json.results) {
        XHR.DELETE('/parse/classes/' + id_plugin, json.results[i].objectId);
      }
    },
    function (error) {
      console.log('There was a failure: ' + error);
    });
  XHR.GET_SPECIFIC('/parse/classes/' + id_plugin, JSON.stringify({
    "name": name
  }));
}

/**
 * Ensures the activity is correctly formatted
 * @param seed: the activity
 */
function checkActivityParameters(seed) {
  if (seed.name.length === 0
    || seed.description.length === 0
    || seed.categories.main.length === 0
    || seed.categories.secondary.length === 0
    || seed.location.length === 0
    || seed.max_participants < 0
    || typeof seed.public === typeof "boolean"
    || seed.items.length < 1
    || seed.difficulty < 0) {
    console.log('false');
    return false;
  }
  return true;
}

/**
 * Makes it possible to connect as a visitor
 * If the username exists, it doesn't recreate it in the database
 * If it doesn't exist, it creates it in the database
 * @param username
 */
function connect(username) {
  var exists = false;
  try {
    if (getUserID(username) !== null) {
      exists = true;
    }
  } catch (e) {

  }
  if (!exists) {
    XHR.setCallback(function (data) {
      },
      function (error) {
        console.log('There was a failure: ' + error);
      });
    XHR.POST('/parse/classes/Visitors', {
      username: username,
      pref: [],
      history: []
    });
  }
}

/**
 * Deletes a user from the database if it exists
 * @param username
 */
function deleteUser(username) {
  var exists = true;
  const user = getUserID(username);
  try {
    if (user === undefined) {
      exists = false;
    }
  } catch (e) {
    console.log(e)
  }
  if (exists) {
    XHR.setCallback(function (data) {
        console.log(username + ' deleted')
      },
      function (error) {
        console.log('There was a failure: ' + error);
      });
    XHR.DELETE('/parse/classes/Visitors', user)
  }
}

/**
 * returns all the prefs of a given user
 */
function get_prefs(username) {
  var return_data = null;
  XHR.setCallback(function (data) {
      return_data = data;
    },
    function (error) {
      console.log('There was a failure: ' + error);
    });
  XHR.GET_SPECIFIC('/parse/classes/Visitors', JSON.stringify({
    "username": username
  }));
  if (return_data === null) {
    return null;
  }
  return JSON.parse(return_data).results[0].pref;
}

/**
 * Adds a pref for an existing user
 */
function add_pref(username, pref) {
  XHR.setCallback(function (data) {
      let user;
      try {
        user = JSON.parse(data).results[0];
        user.pref[user.pref.length] = pref;
        XHR.PUT('/parse/classes/Visitors', {pref: user.pref}, user.objectId);
      } catch (e) {
        console.log(e)
      }
    },
    function (error) {
      console.log('There was a failure: ' + error);
    });
  XHR.GET_SPECIFIC('/parse/classes/Visitors', JSON.stringify({
    "username": username
  }));
}

/**
 * Function to get the user unique ID in the database
 * from it's username
 */
function getUserID(username) {
  let return_data = null;
  XHR.setCallback(function (data) {
      return_data = data;
    },
    function (error) {
      console.log('There was a failure: ' + error);
    });
  XHR.GET_SPECIFIC('/parse/classes/Visitors', JSON.stringify({
    "username": username
  }));
  if (JSON.parse(return_data).results[0] === undefined) {
    return null;
  }
  return JSON.parse(return_data).results[0].objectId;
}

/**
 * Function to get the plugin unique ID
 * in the database from it's name
 */
function getPluginPathID(name) {
  let return_data = null;
  XHR.setCallback(function (data) {
      return_data = data;
    },
    function (error) {
      console.log('There was a failure: ' + error);
    });
  XHR.GET_SPECIFIC('/parse/classes/Plugin', JSON.stringify({
    "name": name
  }));
  if (JSON.parse(return_data).results[0] === undefined) {
    return null;
  }
  return JSON.parse(return_data).results[0].path_id;
}

/**
 * Returns all the categories stored
 * in the database
 */
function getCategories() {
  let return_data = null;
  XHR.setCallback(function (data) {
      return_data = JSON.parse(data);
    },
    function (error) {
      console.log('There was a failure: ' + error);
    });
  XHR.GET('/parse/classes/categories');
  if (return_data.results[0] === undefined) {
    return null;
  }
  return return_data;
}

/**
 * Adds the id of an activity to the user history
 */
function addToHistory(username, activity_name) {
  XHR.setCallback(function (data) {
      const old = JSON.parse(data).results[0].history;
      old.push(activity_name);
      XHR.PUT('/parse/classes/Visitors', {history: old}, JSON.parse(data).results[0].objectId);
    },
    function (error) {
      console.log('There was a failure: ' + error);
    });
  XHR.GET_SPECIFIC('/parse/classes/Visitors', JSON.stringify({
    "username": username
  }));
}

/**
 * Adds the score of a given activity and user the the database
 * @param username the name of the user
 * @param activity_id the unique id of the activity
 * @param score the score obtained by the player for this activity
 */
function addScore(username, activity_id, score) {
  XHR.setCallback(function (data) {
      console.log(data)
    },
    function (error) {
      console.log('There was a failure: ' + error);
    });
  XHR.POST('/parse/classes/user_activity', {
    id_user: getUserID(username),
    id_activity: activity_id,
    score: score
  },);
}

/**
 * Adds or updates the color field in the activity database
 * @param path the plugin path, eg. 'Quiz"
 * @param activity_id the activity's unique id in the database
 * @param color
 */
function setColor(path, activity_id, color) {
  XHR.setCallback(function (data) {
      console.log('color set');
    },
    function (error) {
      console.log('There was a failure: ' + error);
    });
  XHR.PUT('/parse/classes/' + path, {color: color}, activity_id);
}
