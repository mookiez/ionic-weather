angular.module('ionic.weather.services', ['ngResource'])

.constant('DEFAULT_SETTINGS', {
  'tempUnits': 'f'
})

.factory('Settings', function($rootScope, DEFAULT_SETTINGS) {
  var _settings = {};
  try {
    _settings = JSON.parse(window.localStorage['settings']);
  } catch(e) {
  }

  // Just in case we have new settings that need to be saved
  _settings = angular.extend({}, DEFAULT_SETTINGS, _settings);

  if(!_settings) {
    window.localStorage['settings'] = JSON.stringify(_settings);
  }

  var obj = {
    getSettings: function() {
      return _settings;
    },
    // Save the settings to localStorage
    save: function() {
      window.localStorage['settings'] = JSON.stringify(_settings);
      $rootScope.$broadcast('settings.changed', _settings);
    },
    // Get a settings val
    get: function(k) {
      return _settings[k];
    },
    // Set a settings val
    set: function(k, v) {
      _settings[k] = v;
      this.save();
    },

    getTempUnits: function() {
      return _settings['tempUnits'];
    }
  }

  // Save the settings to be safe
  obj.save();
  return obj;
})

.factory('Geo', function($q) {
  return {
    getLocation: function() {
      var q = $q.defer();

      navigator.geolocation.getCurrentPosition(function(position) {
        q.resolve(position);
      }, function(error) {
        q.reject(error);
      });

      return q.promise;
    }
  };
})

.factory('Flickr', function($q, $resource, FLICKR_API_KEY) {
  var baseUrl = 'http://api.flickr.com/services/rest/'

  var flickrSearch = $resource(baseUrl, {
    method: 'flickr.groups.pools.getPhotos',
    group_id: '1463451@N25',
    safe_search: 1,
    jsoncallback: 'JSON_CALLBACK',
    api_key: FLICKR_API_KEY,
    format: 'json'
  }, {
    get: {
      method: 'JSONP'
    }
  });

  return {
    search: function(tags, lat, lng) {
      var q = $q.defer();

      flickrSearch.get({
        tags: tags,
        lat: lat,
        lng: lng
      }, function(val) {
        q.resolve(val);
      }, function(httpResponse) {
        q.reject(httpResponse);
      });

      return q.promise;
    }
  };
})

.factory('Weather', function($q, $resource, WUNDERGROUND_API_KEY) {
  var baseUrl = 'http://api.wunderground.com/api/' + WUNDERGROUND_API_KEY;

  var locationResource = $resource(baseUrl + '/geolookup/conditions/q/:coords.json', {
    callback: 'JSON_CALLBACK'
  }, {
    get: {
      method: 'JSONP'
    }
  });

  var forecastResource = $resource(baseUrl + '/forecast/q/:coords.json', {
    callback: 'JSON_CALLBACK'
  }, {
    get: {
      method: 'JSONP'
    }
  });

  return {
    getForecast: function(lat, lng) {
      var q = $q.defer();

      forecastResource.get({
        coords: lat + ',' + lng
      }, function(resp) {
        q.resolve(resp);
      }, function(httpResponse) {
        q.reject(httpResponse);
      });

      return q.promise;
    },

    getAtLocation: function(lat, lng) {
      var q = $q.defer();

      locationResource.get({
        coords: lat + ',' + lng
      }, function(resp) {
        q.resolve(resp);
      }, function(error) {
        q.reject(error);
      });

      return q.promise;
    }
  }
})
