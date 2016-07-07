var app = angular.module('app', ['ngRoute']);

app.config(function($routeProvider) {
  $routeProvider
  .when('/home', {
    templateUrl: 'home.html'
  })

  .when('/options', {
    templateUrl: 'options.html'
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
