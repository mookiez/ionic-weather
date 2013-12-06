angular.module('ionic.weather.filters', ['ionic.weather.services'])

.filter('temp', function(Settings) {
  return function(input) {
    if(Settings.getTempUnits() == 'f') {
      return input.fahrenheit;
    }
    return input.celsius;
  };
})

// Silly Wunderground uses a different name for f/c in the hourly forecast
.filter('tempEnglish', function(Settings) {
  return function(input) {
    if(Settings.getTempUnits() == 'f') {
      return input.english;
    }
    return input.metric;
  };
})

.filter('hourFormat', function() {
  return function(input) {
    var h = parseInt(input);
    var postfix = h >= 12 ? 'PM' : 'AM';
    var h12 = (h % 12) || 12;
    return h12 + postfix;
  }
});
