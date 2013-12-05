angular.module('ionic.weather.directives', [])

.constant('WEATHER_ICONS', {
  'partlycloudy': 'ion-ios7-partlysunny',
  'mostlycloudy': 'ion-ios7-partlysunny',
  'cloudy': 'ion-ios7-cloudy',
  'rain': 'ion-ios7-rainy',
  'tstorms': 'ion-ios7-thunderstorm',
  'sunny': 'ion-ios7-sunny',
  'nt_clear': 'ion-ios7-moon'
})

.directive('currentWeatherIcon', function(WEATHER_ICONS) {
  return {
    restrict: 'E',
    replace: true,
    scope: {},
    template: '<i class="icon" ng-class="weatherIcon"></i>',
    link: function($scope) {

      $scope.$parent.$watch('current', function(v) {
        if(!v) { return; }

        var icon = v.icon;

        if(icon in WEATHER_ICONS) {
          $scope.weatherIcon = WEATHER_ICONS[icon];
        } else {
          $scope.weatherIcon = WEATHER_ICONS['cloudy'];
        }
      });
    }
  }
})

.directive('currentTime', function($timeout, $filter) {
  return {
    restrict: 'E',
    replace: true,
    template: '<span class="current-time">{{currentTime}}</span>',
    scope: {
      localtz: '=',
    },
    link: function($scope, $element, $attr) {
      $timeout(function checkTime() {
        if($scope.localtz) {
          $scope.currentTime = $filter('date')(+(new Date), 'h:mm') + $scope.localtz;
        }
        $timeout(checkTime, 500);
      });
    }
  }
 })

.directive('currentWeather', function($timeout, $rootScope, Settings) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'templates/current-weather.html',
    scope: true,
    compile: function(element, attr) {
      return function($scope, $element, $attr) {

        $rootScope.$on('settings.changed', function(settings) {
          var units = Settings.get('tempUnits');

          if($scope.forecast) {

            var forecast = $scope.forecast;
            var current = $scope.current;

            if(units == 'f') {
              $scope.highTemp = forecast.forecastday[0].high.fahrenheit;
              $scope.lowTemp = forecast.forecastday[0].low.fahrenheit;
              $scope.currentTemp = Math.floor(current.temp_f);
            } else {
              $scope.highTemp = forecast.forecastday[0].high.celsius;
              $scope.lowTemp = forecast.forecastday[0].low.celsius;
              $scope.currentTemp = Math.floor(current.temp_c);
            }
          }
        });

        $scope.$watch('current', function(current) {
          var units = Settings.get('tempUnits');

          if(current) {
            if(units == 'f') {
              $scope.currentTemp = Math.floor(current.temp_f);
            } else {
              $scope.currentTemp = Math.floor(current.temp_c);
            }
          }
        });

        $scope.$watch('forecast', function(forecast) {
          var units = Settings.get('tempUnits');

          if(forecast) {
            if(units == 'f') {
              $scope.highTemp = forecast.forecastday[0].high.fahrenheit;
              $scope.lowTemp = forecast.forecastday[0].low.fahrenheit;
            } else {
              $scope.highTemp = forecast.forecastday[0].high.celsius;
              $scope.lowTemp = forecast.forecastday[0].low.celsius;
            }
          }
        });

      // Delay so we are in the DOM and can calculate sizes
      $timeout(function() {
        var windowHeight = window.innerHeight;
        var thisHeight = $element[0].offsetHeight;
        var headerHeight = document.querySelector('#header').offsetHeight;
        $element[0].style.paddingTop = (windowHeight - thisHeight) + 'px';
        angular.element(document.querySelector('.content')).css('-webkit-overflow-scrolling', 'auto');
        $timeout(function() {
          angular.element(document.querySelector('.content')).css('-webkit-overflow-scrolling', 'touch');
        }, 50);
      });
      }
    }
  }
})

.directive('weatherBox', function($timeout) {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    scope: {
      title: '@'
    },
    template: '<div class="weather-box"><h4 class="title">{{title}}</h4><div ng-transclude></div></div>',
    link: function($scope, $element, $attr) {
    }
  }
})
