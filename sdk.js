var Config = {};

Config.getUrl = function () {
  if (url) return url;
  var port = window.location.port;
  var url = window.location.protocol + '//' + window.location.hostname;
  if (port) url = url + ':1337';
  return url;
};


/**
 * XHR object
 */

var XHR = {};

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

XHR.POST = function (path, post) {
  this.xhttp.open("POST", Config.getUrl() + path, false);
  this.xhttp.setRequestHeader("X-Parse-Application-Id", appId);
  this.xhttp.setRequestHeader("Content-type", "application/json");
  // this.xhttp.setRequestHeader("X-Parse-Revocable-Session", "1");
  this.xhttp.send(JSON.stringify(post));
};

XHR.GET = function (path) {
  this.xhttp.open("GET", Config.getUrl() + path, false);
  this.xhttp.setRequestHeader("X-Parse-Application-Id", appId);
  this.xhttp.setRequestHeader("Content-type", "application/json");
  this.xhttp.send(null);
};

XHR.GET_SPECIFIC = function (path, req) {
  this.xhttp.open("GET", Config.getUrl() + path + '?where=' + req, false);
  this.xhttp.setRequestHeader("X-Parse-Application-Id", appId);
  this.xhttp.setRequestHeader("Content-type", "application/json");
  this.xhttp.send();
};

XHR.GET_USER = function (path, name) {
  const req = JSON.stringify({
    "username": name
  });
  this.xhttp.open("GET", Config.getUrl() + path + '?where=' + req, false);
  this.xhttp.setRequestHeader("X-Parse-Application-Id", appId);
  this.xhttp.setRequestHeader("Content-type", "application/json");
  this.xhttp.send();
};

XHR.PUT = function (path, put, objectId) {
  this.xhttp.open("PUT", Config.getUrl() + path + '/' + objectId, false);
  this.xhttp.setRequestHeader("X-Parse-Application-Id", appId);
  this.xhttp.setRequestHeader("Content-type", "application/json");
  this.xhttp.setRequestHeader("X-Parse-Revocable-Session", "1");
  this.xhttp.send(JSON.stringify(put));
};

XHR.DELETE = function (path, objectId) {
  this.xhttp.open("DELETE", Config.getUrl() + path + '/' + objectId, false);
  this.xhttp.setRequestHeader("X-Parse-Application-Id", appId);
  this.xhttp.setRequestHeader("Content-type", "application/json");
  this.xhttp.send(null);
};

function addActivity(seed, id_plugin) {
  /*if (!checkActivityParameters(seed)) {
    return -1;
  }*/
  console.log(seed);
  XHR.setCallback(function (data) {
    },
    function (error) {
      console.log('There was a failure: ' + error);
    });
  XHR.POST('/parse/classes/' + id_plugin, seed);
  return seed.id;
}

function getActivities(id_plugin) {
  var return_data = '';
  XHR.setCallback(function (data) {
      //document.getElementById('get_quiz_text').innerHTML = data;
      //console.log(data);
      return_data = JSON.parse(data);
    },
    function (error) {
      console.log('There was a failure: ' + error);
    });
  XHR.GET('/parse/classes/' + id_plugin);
  console.log(return_data);
  return return_data;
}

function updateActivity(id_plugin, seed) {
  XHR.setCallback(function (data) {
      console.log(JSON.parse(data));
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

function deleteActivity(id_plugin, name) {
  XHR.setCallback(function (data) {
      const json = JSON.parse(data);
      console.log(json);
      for (let i in json.results) {
        console.log(json.results[i]);
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

function checkActivityParameters(seed) {
  if (seed.id < 0
    || seed.name.length === 0
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

function connect(username) {
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

function get_prefs(username) {
  var return_data = 'test';
  XHR.setCallback(function (data) {
      // console.log(JSON.parse(data).results[0]);

      return_data = data;
      //XHR.GET_USER('/parse/classes/Visitors', {pref: user.pref}, user.objectId);
    },
    function (error) {
      console.log('There was a failure: ' + error);
    });
  XHR.GET_SPECIFIC('/parse/classes/Visitors', JSON.stringify({
    "username": username
  }));
  return JSON.parse(return_data).results[0].pref;
}

function add_pref(username, pref) {
  XHR.setCallback(function (data) {
      console.log(JSON.parse(data).results);

      let user = JSON.parse(data).results[0];
      //console.log(JSON.parse(data).results[0]);
      // console.log(user.pref);
      user.pref[user.pref.length] = pref;
      XHR.PUT('/parse/classes/Visitors', {pref: user.pref}, user.objectId);
    },
    function (error) {
      console.log('There was a failure: ' + error);
    });
  XHR.GET_SPECIFIC('/parse/classes/Visitors', JSON.stringify({
    "username": username
  }));
}

