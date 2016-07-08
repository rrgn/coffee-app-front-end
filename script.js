var app = angular.module('app', ['ngRoute']);

app.config(function($routeProvider) {
  $routeProvider
  .when('/home', {
    templateUrl: 'home.html',
    controller: 'MainController'
  })

  .when('/options', {
    templateUrl: 'options.html',
    controller: 'OptionsController'
  })

  .when('/delivery', {
    templateUrl: 'delivery.html'
  })

  .when('/payment', {
    templateUrl: 'payment.html'
  })

  .when('/thanks', {
    templateUrl: 'thanks.html'
  })

  .when('/login', {
    templateUrl: 'login.html'
  })

  .when('/register', {
    templateUrl: 'register.html'
  })

  .otherwise({
    redirectTo: '/home'
  });
});

app.controller('MainController', function($scope) {

});

app.controller('OptionsController', function($scope, grindOps) {
  $scope.makeOrder = function(qty) {
    return {
      qty: qty,
      grindType: $scope.grindType
    },
    console.log('inside scope makeOrder', $scope.grindType);
  };
  grindOps.getGrindOptions(function(data) {
    $scope.grinds = data;
    console.log(data);
  });
});

app.factory('grindOps', function($http) {
  return {
    getGrindOptions: function(callback) {
      $http({
        url: "http://localhost:8080/options"
      }).success(function(data){
        callback(data);
      });
    }
  };
});
